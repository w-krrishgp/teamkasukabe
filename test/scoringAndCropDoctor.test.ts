/**
 * Automated Test Suite for Crop Doctor & Khet Score Modules
 * Tests:
 * 1. Image validator (valid, too small, too large, invalid MIME)
 * 2. Crop Doctor model adapter (demo reference, failure simulation, live config detection)
 * 3. Khet Score input validator (valid inputs, invalid inputs, edge cases)
 * 4. Khet Score calculation engine (formula accuracy, missing data neutrality, evidence segregation)
 */

import { validateImageFile, validateImageDataUrl } from '../src/services/cropDoctor/imageValidator.ts';
import { getCropDoctorService } from '../src/services/cropDoctor/modelAdapter.ts';
import {
  validateFarmAssessmentInput,
  calculateKhetAssessment,
} from '../src/features/khetScore/scoringEngine.ts';
import {
  VERIFIED_HIGH_RESILIENCE_PROFILE,
  MISSING_DATA_PROFILE,
  CLIMATE_EXPOSED_PROFILE,
  UNVERIFIED_SELF_REPORTED_PROFILE,
  INVALID_TEST_PROFILE,
} from '../src/features/khetScore/sampleProfiles.ts';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failedTests++;
    throw new Error(message);
  } else {
    console.log(`✅ PASSED: ${message}`);
    passedTests++;
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING CROP DOCTOR & KHET SCORE TEST SUITE');
  console.log('======================================================\n');

  // --------------------------------------------------------------------------
  // TEST GROUP 1: CROP DOCTOR IMAGE VALIDATION
  // --------------------------------------------------------------------------
  console.log('--- 1. Testing Image Validation ---');

  // Valid JPEG
  const validJpeg = new File([new Uint8Array(50 * 1024)], 'leaf.jpg', { type: 'image/jpeg' });
  const validRes = validateImageFile(validJpeg);
  assert(validRes.isValid === true, 'Valid 50KB JPEG passes validation');

  // Valid PNG
  const validPng = new File([new Uint8Array(120 * 1024)], 'leaf.png', { type: 'image/png' });
  assert(validateImageFile(validPng).isValid === true, 'Valid 120KB PNG passes validation');

  // Valid WebP
  const validWebp = new File([new Uint8Array(80 * 1024)], 'leaf.webp', { type: 'image/webp' });
  assert(validateImageFile(validWebp).isValid === true, 'Valid 80KB WebP passes validation');

  // Too small (< 2 KB)
  const tinyFile = new File([new Uint8Array(500)], 'broken.jpg', { type: 'image/jpeg' });
  const tinyRes = validateImageFile(tinyFile);
  assert(tinyRes.isValid === false, 'Too small (< 2KB) file fails validation');
  assert(tinyRes.errorCode === 'FILE_TOO_SMALL', 'Returns FILE_TOO_SMALL error code');

  // Too large (> 10 MB)
  const hugeFile = new File([new Uint8Array(11 * 1024 * 1024)], 'huge.jpg', { type: 'image/jpeg' });
  const hugeRes = validateImageFile(hugeFile);
  assert(hugeRes.isValid === false, 'Over 10MB file fails validation');
  assert(hugeRes.errorCode === 'FILE_TOO_LARGE', 'Returns FILE_TOO_LARGE error code');

  // Invalid format (PDF)
  const pdfFile = new File([new Uint8Array(20 * 1024)], 'document.pdf', { type: 'application/pdf' });
  const pdfRes = validateImageFile(pdfFile);
  assert(pdfRes.isValid === false, 'PDF format fails validation');
  assert(pdfRes.errorCode === 'INVALID_FORMAT', 'Returns INVALID_FORMAT error code');

  // Data URL Validation
  const validDataUrl = 'data:image/jpeg;base64,' + 'A'.repeat(5000);
  assert(validateImageDataUrl(validDataUrl).isValid === true, 'Valid Base64 JPEG data URL passes validation');

  const invalidMimeDataUrl = 'data:application/pdf;base64,' + 'A'.repeat(5000);
  assert(validateImageDataUrl(invalidMimeDataUrl).isValid === false, 'Invalid MIME in data URL fails');

  // --------------------------------------------------------------------------
  // TEST GROUP 2: CROP DOCTOR MODEL ADAPTER & TRANSPARENCY
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Testing Crop Doctor Model Adapter ---');

  // Demo mode
  const demoService = getCropDoctorService('demo');
  assert(demoService.isApiConfigured === false, 'Demo service correctly reports API not configured');
  const demoResult = await demoService.analyzeLeaf({ cropHint: 'wheat', preferredLanguage: 'en' });
  assert(demoResult.isModelConnected === false, 'Demo result isModelConnected is strictly false');
  assert(demoResult.inferenceMode === 'demo_reference', 'Inference mode is demo_reference');
  assert(demoResult.confidenceGenuine === false, 'Demo result marks confidenceGenuine as false');
  assert(demoResult.condition.nameEn.includes('Yellow Rust'), 'Correctly identifies Yellow Rust');
  assert(demoResult.guidance.chemicalRemedies.length > 0, 'Includes cautious chemical guidance');
  assert(demoResult.guidance.organicRemedies.length > 0, 'Includes organic remedies');
  assert(demoResult.guidance.agronomistConsultNotice.length > 0, 'Includes mandatory agronomist consultation note');

  // Service failure simulation
  const failureService = getCropDoctorService('simulate_failure');
  let threwExpected = false;
  try {
    await failureService.analyzeLeaf({ preferredLanguage: 'en' });
  } catch (err: any) {
    threwExpected = true;
    assert(err.message.includes('Inference API unreachable'), 'Failure simulation throws clean 503 error');
  }
  assert(threwExpected, 'Simulated failure properly rejected promise');

  // --------------------------------------------------------------------------
  // TEST GROUP 3: KHET SCORE INPUT VALIDATION
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Testing Khet Score Input Validation ---');

  // Valid profile validation
  const validProfileRes = validateFarmAssessmentInput(VERIFIED_HIGH_RESILIENCE_PROFILE);
  assert(validProfileRes.isValid === true, 'Verified high resilience profile passes validation with 0 errors');
  assert(validProfileRes.errors.length === 0, 'No errors in valid profile');

  // Invalid profile validation
  const invalidProfileRes = validateFarmAssessmentInput(INVALID_TEST_PROFILE);
  assert(invalidProfileRes.isValid === false, 'Invalid profile fails validation');
  assert(invalidProfileRes.errors.length >= 3, 'Catches multiple validation errors (name, acreage, production)');
  const fieldNames = invalidProfileRes.errors.map(e => e.field);
  assert(fieldNames.includes('farmName'), 'Catches empty farmName');
  assert(fieldNames.includes('totalAcreage'), 'Catches negative totalAcreage');

  // --------------------------------------------------------------------------
  // TEST GROUP 4: KHET SCORE ENGINE & ETHICAL MODELING
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Testing Khet Score Engine & Non-Punitive Missing Data ---');

  // Profile 1: Complete verified calculation
  const res1 = calculateKhetAssessment(VERIFIED_HIGH_RESILIENCE_PROFILE);
  assert(res1.overallScore >= 75 && res1.overallScore <= 100, `Complete profile score is strong (${res1.overallScore}/100)`);
  assert(res1.scoreBand === 'Resilient (Grade A)', `Score band is Resilient (Grade A), got: ${res1.scoreBand}`);
  assert(res1.dataCompletenessPercentage >= 80, `Data completeness is high (${res1.dataCompletenessPercentage}%)`);
  assert(res1.scoreRange.uncertaintyMargin <= 5, 'Uncertainty margin is tight for high completeness (<= 5 pts)');
  assert(res1.verifiedEvidenceList.length >= 4, 'Populates verified evidence list from APMC, GST & Soil Card');

  // Profile 2: Missing Data Profile (CRITICAL TEST: Non-punitive)
  const res2 = calculateKhetAssessment(MISSING_DATA_PROFILE);
  assert(res2.dataCompletenessPercentage < 40, `Detects low data completeness (${res2.dataCompletenessPercentage}%)`);
  assert(res2.scoreRange.uncertaintyMargin >= 10, `Widens uncertainty margin (±${res2.scoreRange.uncertaintyMargin} pts)`);
  // Must NOT assign a default punitive 0 score
  assert(res2.overallScore >= 45, `Missing data profile still receives neutral baseline operational score (${res2.overallScore}/100)`);
  assert(res2.missingInformation.length >= 2, 'Explicitly catalogs missing items (Soil Health Card, prior seasons)');
  assert(res2.missingInformation.some(m => m.impactExplanation.includes('does NOT imply poor creditworthiness')),
    'Missing information items clearly state missing data is not penalized as poor credit'
  );

  // Profile 3: Climate Exposed Profile
  const res3 = calculateKhetAssessment(CLIMATE_EXPOSED_PROFILE);
  assert(res3.overallScore >= 50, `Climate exposed farm with drip irrigation maintains resilience (${res3.overallScore}/100)`);
  assert(res3.strengths.some(s => s.includes('Micro-drip irrigation')), 'Recognizes micro-drip as a critical climate resilience asset');

  // Profile 4: Unverified Self-Reported Profile
  const res4 = calculateKhetAssessment(UNVERIFIED_SELF_REPORTED_PROFILE);
  assert(res4.farmerEnteredList.length > 0, 'Farmer-entered items are explicitly segregated into farmerEnteredList');
  assert(res4.verifiedEvidenceList.length === 0, 'Zero third-party verified items for purely self-declared profile');
  assert(res4.dataReliabilityBand === 'Predominantly Self-Reported', 'Flags reliability band as Predominantly Self-Reported');

  // Statutory Disclaimers Check
  assert(res1.statutoryDisclaimerEn.includes('NOT an official credit bureau score'), 'Contains explicit CIBIL/bureau disclaimer');
  assert(res1.statutoryDisclaimerEn.includes('does NOT prove statutory land title'), 'Contains explicit land title disclaimer');
  assert(res1.statutoryDisclaimerEn.includes('does NOT guarantee bank loan sanction'), 'Contains loan guarantee disclaimer');
  assert(res1.statutoryDisclaimerEn.includes('Missing data is not treated as evidence of poor creditworthiness'), 'Contains non-punitive disclaimer');

  console.log('\n======================================================');
  console.log(`🎉 ALL TESTS COMPLETED: ${passedTests} passed, ${failedTests} failed`);
  console.log('======================================================\n');
}

runTestSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
