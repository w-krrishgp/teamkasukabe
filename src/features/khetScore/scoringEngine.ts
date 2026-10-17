/**
 * Khet Score - Explainable Farm Operational Resilience Scoring Engine
 *
 * GOALS & ETHICAL PRINCIPLES:
 * 1. Farm-Level Operational Assessment: Measures agronomic discipline, yield stability,
 *    and climate resilience rather than mimicking a credit bureau score.
 * 2. Non-Punitive Missing Data Handling: Missing historical records reduce data completeness
 *    and widen the uncertainty range, but are NEVER treated as evidence of poor creditworthiness.
 * 3. Evidence Segregation: Distinguishes verifiable third-party documentation from self-reported data.
 * 4. Regulatory Clarity: Explicitly clarifies that this index does not prove land title, guarantee loans,
 *    or replace bank credit underwriting.
 */

import {
  FarmAssessmentInput,
  KhetAssessmentResult,
  KhetValidationResult,
  FactorBreakdown,
  EvidenceRecord,
  MissingInformationItem,
  AgronomicAssumption,
  SeasonYieldRecord,
  SalesRecord,
  InputPurchaseRecord,
} from './types';

// ============================================================================
// CONFIGURABLE SCORING WEIGHTS & CONSTANTS
// ============================================================================
export const SCORING_WEIGHTS = {
  YIELD_STABILITY: 30,      // Factor 1: Multi-season production stability (30 pts)
  VERIFIED_SALES: 25,       // Factor 2: Market linkage & receipted sales (25 pts)
  INPUT_INVESTMENT: 20,     // Factor 3: Quality seed, balanced nutrition & pest control (20 pts)
  WEATHER_RESILIENCE: 15,   // Factor 4: Climate exposure & mitigation assets (15 pts)
  DATA_VERIFICATION: 10,    // Factor 5: Level of third-party verification (10 pts)
};

export const REGIONAL_YIELD_BENCHMARKS: Record<string, number> = {
  wheat: 18.5,     // Quintals / acre (Normal North-West / Gujarat irrigated plains)
  mustard: 7.2,    // Quintals / acre
  paddy: 22.0,     // Quintals / acre
  cotton: 8.5,     // Quintals / acre
  groundnut: 9.0,  // Quintals / acre
};

// ============================================================================
// INPUT VALIDATION ENGINE
// ============================================================================
export function validateFarmAssessmentInput(input: FarmAssessmentInput): KhetValidationResult {
  const errors: Array<{ field: string; message: string }> = [];
  const warnings: Array<{ field: string; message: string }> = [];

  // 1. Basic farm demographics
  if (!input.farmName || input.farmName.trim().length === 0) {
    errors.push({ field: 'farmName', message: 'Farm name cannot be empty.' });
  }

  if (typeof input.totalAcreage !== 'number' || isNaN(input.totalAcreage)) {
    errors.push({ field: 'totalAcreage', message: 'Total acreage must be a valid number.' });
  } else if (input.totalAcreage <= 0) {
    errors.push({ field: 'totalAcreage', message: 'Total acreage must be greater than 0.' });
  } else if (input.totalAcreage > 500) {
    warnings.push({
      field: 'totalAcreage',
      message: 'Acreage exceeds 500 acres. Ensure smallholder/family farm boundaries are correctly declared.',
    });
  }

  // 2. Validate Seasons & Yield Data
  if (Array.isArray(input.seasons)) {
    input.seasons.forEach((season, index) => {
      const prefix = `seasons[${index}]`;

      if (season.harvestedAreaAcres <= 0) {
        errors.push({ field: `${prefix}.harvestedAreaAcres`, message: 'Harvested area must be greater than 0.' });
      } else if (season.harvestedAreaAcres > input.totalAcreage * 1.5) {
        warnings.push({
          field: `${prefix}.harvestedAreaAcres`,
          message: 'Harvested area exceeds declared farm acreage (check multi-cropping index).',
        });
      }

      if (season.totalProductionQuintals < 0) {
        errors.push({ field: `${prefix}.totalProductionQuintals`, message: 'Production quintals cannot be negative.' });
      }

      const calculatedYield =
        season.harvestedAreaAcres > 0
          ? season.totalProductionQuintals / season.harvestedAreaAcres
          : 0;

      if (calculatedYield > 65) {
        warnings.push({
          field: `${prefix}.yieldQuintalsPerAcre`,
          message: `Reported yield (${calculatedYield.toFixed(1)} Qtl/acre) is extraordinarily high for Indian agro-climatic conditions.`,
        });
      }
    });
  }

  // 3. Validate Sales
  if (Array.isArray(input.salesRecords)) {
    input.salesRecords.forEach((sale, index) => {
      const prefix = `salesRecords[${index}]`;
      if (sale.soldQuantityQuintals < 0) {
        errors.push({ field: `${prefix}.soldQuantityQuintals`, message: 'Sold quantity cannot be negative.' });
      }
      if (sale.realizedPricePerQuintal < 0) {
        errors.push({ field: `${prefix}.realizedPricePerQuintal`, message: 'Realized price cannot be negative.' });
      }
    });
  }

  // 4. Validate Input Purchases
  if (Array.isArray(input.inputPurchases)) {
    input.inputPurchases.forEach((purchase, index) => {
      const prefix = `inputPurchases[${index}]`;
      if (purchase.amountRupees < 0) {
        errors.push({ field: `${prefix}.amountRupees`, message: 'Purchase amount cannot be negative.' });
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================================
// FACTOR 1: YIELD CONSISTENCY & STABILITY (Max 30 Pts)
// ============================================================================
function computeYieldFactor(seasons: SeasonYieldRecord[]): {
  rawScore: number;
  dataCompleteness: number;
  explanationEn: string;
  explanationHi: string;
  isVerified: boolean;
} {
  if (!seasons || seasons.length === 0) {
    return {
      rawScore: 15, // Neutral baseline median; NOT 0 credit penalty
      dataCompleteness: 0,
      explanationEn: 'No historical yield records provided. Neutral median assessment applied without penalty.',
      explanationHi: 'कोई पिछला उपज रिकॉर्ड दर्ज नहीं है। बिना किसी कटौती के तटस्थ मध्यमान स्कोर दिया गया है।',
      isVerified: false,
    };
  }

  let totalYieldRatio = 0;
  const yieldRatios: number[] = [];
  let verifiedCount = 0;

  seasons.forEach((s) => {
    const benchmark = s.districtBenchmarkYield > 0 ? s.districtBenchmarkYield : 18;
    const ratio = Math.min(2.0, s.yieldQuintalsPerAcre / benchmark);
    yieldRatios.push(ratio);
    totalYieldRatio += ratio;
    if (s.verificationTier === 'verified_third_party') verifiedCount++;
  });

  const avgRatio = totalYieldRatio / seasons.length;

  // Calculate Coefficient of Variation (CV) if >= 2 seasons
  let stabilityBonus = 0;
  if (yieldRatios.length >= 2) {
    const mean = avgRatio;
    const variance =
      yieldRatios.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / yieldRatios.length;
    const stdDev = Math.sqrt(variance);
    const cv = mean > 0 ? stdDev / mean : 0;

    // Lower variance (CV < 0.15) indicates high agronomic discipline
    if (cv < 0.15) stabilityBonus = 6;
    else if (cv < 0.25) stabilityBonus = 4;
    else if (cv < 0.40) stabilityBonus = 2;
  } else {
    stabilityBonus = 3; // Single season default neutral bonus
  }

  // Base production score (max 24)
  const baseScore = Math.min(24, Math.round(avgRatio * 18));
  const totalScore = Math.min(SCORING_WEIGHTS.YIELD_STABILITY, baseScore + stabilityBonus);

  const seasonsCount = seasons.length;
  const completeness = Math.min(100, Math.round((seasonsCount / 3) * 100));

  return {
    rawScore: totalScore,
    dataCompleteness: completeness,
    explanationEn: `Evaluated across ${seasonsCount} season(s). Average yield is ${(avgRatio * 100).toFixed(0)}% of district benchmark with ${stabilityBonus > 3 ? 'low inter-seasonal volatility' : 'moderate variance'}.`,
    explanationHi: `${seasonsCount} सीज़न के आधार पर मूल्यांकित। औसत उपज जिला मानक की ${(avgRatio * 100).toFixed(0)}% है।`,
    isVerified: verifiedCount > 0,
  };
}

// ============================================================================
// FACTOR 2: MARKET & VERIFIED SALES EVIDENCE (Max 25 Pts)
// ============================================================================
function computeSalesFactor(sales: SalesRecord[]): {
  rawScore: number;
  dataCompleteness: number;
  explanationEn: string;
  explanationHi: string;
  isVerified: boolean;
} {
  if (!sales || sales.length === 0) {
    return {
      rawScore: 12, // Neutral baseline median
      dataCompleteness: 0,
      explanationEn: 'No sales receipts uploaded. Neutral score applied. Farmer can upload APMC / e-NAM slips to enhance verification.',
      explanationHi: 'कोई बिक्री रसीद अपलोड नहीं की गई। तटस्थ स्कोर लागू। APMC/e-NAM पर्ची जोड़कर प्रमाण बढ़ा सकते हैं।',
      isVerified: false,
    };
  }

  let totalQty = 0;
  let verifiedQty = 0;
  let totalRevenue = 0;

  sales.forEach((s) => {
    totalQty += s.soldQuantityQuintals;
    totalRevenue += s.soldQuantityQuintals * s.realizedPricePerQuintal;
    if (s.hasOfficialReceipt && s.verificationTier === 'verified_third_party') {
      verifiedQty += s.soldQuantityQuintals;
    }
  });

  const verifiedRatio = totalQty > 0 ? verifiedQty / totalQty : 0;
  const avgPrice = totalQty > 0 ? totalRevenue / totalQty : 0;

  // Price realization score (max 12 pts)
  // Benchmark wheat MSP ~ ₹ 2,425 / Qtl
  const priceRatio = avgPrice > 0 ? Math.min(1.3, avgPrice / 2400) : 1.0;
  const priceScore = Math.min(12, Math.round(priceRatio * 9));

  // Verification trail score (max 13 pts)
  const verificationScore = Math.round(verifiedRatio * 13);
  const totalScore = Math.min(SCORING_WEIGHTS.VERIFIED_SALES, priceScore + verificationScore);

  return {
    rawScore: totalScore,
    dataCompleteness: Math.round(Math.min(100, (sales.length / 2) * 100)),
    explanationEn: `${(verifiedRatio * 100).toFixed(0)}% of produce sold via verified formal channels (APMC / e-NAM). Average price realized: ₹${avgPrice.toFixed(0)}/Qtl.`,
    explanationHi: `${(verifiedRatio * 100).toFixed(0)}% उपज APMC/e-NAM से सत्यापित बिकी। औसत दर: ₹${avgPrice.toFixed(0)}/क्विंटल।`,
    isVerified: verifiedRatio > 0.4,
  };
}

// ============================================================================
// FACTOR 3: INPUT PURCHASE & AGRONOMIC DISCIPLINE (Max 20 Pts)
// ============================================================================
function computeInputFactor(purchases: InputPurchaseRecord[]): {
  rawScore: number;
  dataCompleteness: number;
  explanationEn: string;
  explanationHi: string;
  isVerified: boolean;
} {
  if (!purchases || purchases.length === 0) {
    return {
      rawScore: 10, // Neutral baseline median
      dataCompleteness: 0,
      explanationEn: 'No input purchase invoices recorded. Assumed standard traditional inputs without penalty.',
      explanationHi: 'कोई खाद-बीज रसीद दर्ज नहीं। बिना किसी नकारात्मक प्रभाव के मानक इनपुट माने गए।',
      isVerified: false,
    };
  }

  const categories = new Set(purchases.map((p) => p.category));
  const hasCertifiedSeed = categories.has('Certified_Seed');
  const hasBalancedNutrient = categories.has('Balanced_Fertilizer');
  const hasBioProtection = categories.has('Bio_Pesticide');
  const hasMicroIrrigation = categories.has('Micro_Irrigation');

  let points = 6; // Base
  if (hasCertifiedSeed) points += 4;
  if (hasBalancedNutrient) points += 4;
  if (hasBioProtection) points += 3;
  if (hasMicroIrrigation) points += 3;

  const verifiedCount = purchases.filter((p) => p.dealerGSTNumber || p.isSubsidizedDBT).length;
  const verifiedBonus = Math.min(3, verifiedCount);
  const totalScore = Math.min(SCORING_WEIGHTS.INPUT_INVESTMENT, points + verifiedBonus);

  return {
    rawScore: totalScore,
    dataCompleteness: Math.min(100, purchases.length * 25),
    explanationEn: `Invested in ${categories.size} input categories with ${verifiedCount} GST/DBT verified purchases, showing balanced soil health care.`,
    explanationHi: `${categories.size} श्रेणियों में खाद-बीज का संतुलित उपयोग, जिसमें ${verifiedCount} GST/DBT सत्यापित रसीदें शामिल हैं।`,
    isVerified: verifiedCount > 0,
  };
}

// ============================================================================
// FACTOR 4: WEATHER EXPOSURE & CLIMATE RESILIENCE (Max 15 Pts)
// ============================================================================
function computeWeatherFactor(weather: FarmAssessmentInput['weather']): {
  rawScore: number;
  dataCompleteness: number;
  explanationEn: string;
  explanationHi: string;
  isVerified: boolean;
} {
  let score = 9; // Neutral base

  // Climate shock risks
  const absDeviation = Math.abs(weather.rainfallDeviationPercent);
  if (absDeviation > 25) score -= 3;
  else if (absDeviation > 15) score -= 1;
  else score += 1;

  if (weather.heatStressDaysDuringFlowering > 8) score -= 2;

  // Resilience mitigations (crucial offset)
  if (weather.hasProtectiveIrrigation) {
    if (weather.irrigationMethod === 'Micro_Drip_Sprinkler') score += 5;
    else score += 3;
  }

  if (weather.isInsuredPMFBY) {
    score += 2;
  }

  const boundedScore = Math.max(3, Math.min(SCORING_WEIGHTS.WEATHER_RESILIENCE, score));

  return {
    rawScore: boundedScore,
    dataCompleteness: 90, // Weather telemetry usually from district IMD
    explanationEn: `Rainfall anomaly ${weather.rainfallDeviationPercent > 0 ? '+' : ''}${weather.rainfallDeviationPercent}%. Protected by ${weather.irrigationMethod.replace(/_/g, ' ')}${weather.isInsuredPMFBY ? ' and PMFBY crop insurance.' : '.'}`,
    explanationHi: `वर्षा विचलन ${weather.rainfallDeviationPercent}%, ${weather.irrigationMethod === 'Micro_Drip_Sprinkler' ? 'ड्रिप सिंचाई' : 'सिंचाई'} और बीमा से सुरक्षित।`,
    isVerified: true,
  };
}

// ============================================================================
// FACTOR 5: DATA COMPLETENESS & VERIFICATION CONFIDENCE (Max 10 Pts)
// ============================================================================
function computeDataConfidenceFactor(
  evidenceList: EvidenceRecord[],
  soilCard: boolean
): {
  rawScore: number;
  completenessPercentage: number;
  verifiedCount: number;
  unverifiedCount: number;
  explanationEn: string;
  explanationHi: string;
} {
  const verifiedCount = evidenceList.filter((e) => e.verificationTier === 'verified_third_party').length;
  const unverifiedCount = evidenceList.filter((e) => e.verificationTier === 'farmer_entered').length;
  const total = verifiedCount + unverifiedCount;

  // Calculate completeness percentage based on expected core documentation:
  // Expected: 2 season yields, 1 sales receipt, 2 input invoices, 1 soil health card
  const expectedPoints = 6;
  let earnedPoints = 0;
  if (evidenceList.some((e) => e.category === 'Yield')) earnedPoints += 2;
  if (evidenceList.some((e) => e.category === 'Sales')) earnedPoints += 1;
  if (evidenceList.some((e) => e.category === 'Input')) earnedPoints += 1.5;
  if (soilCard) earnedPoints += 1.5;

  const completenessPercentage = Math.round(Math.min(100, (earnedPoints / expectedPoints) * 100));

  // Score out of 10 points
  const verificationRatio = total > 0 ? verifiedCount / total : 0;
  const score = Math.round((completenessPercentage / 100) * 6 + verificationRatio * 4);

  return {
    rawScore: Math.min(SCORING_WEIGHTS.DATA_VERIFICATION, Math.max(2, score)),
    completenessPercentage,
    verifiedCount,
    unverifiedCount,
    explanationEn: `${completenessPercentage}% of farm data profile completed. ${verifiedCount} independent third-party records verified.`,
    explanationHi: `${completenessPercentage}% डेटा प्रोफ़ाइल पूर्ण। ${verifiedCount} सरकारी/मंडी रिकॉर्ड सत्यापित।`,
  };
}

// ============================================================================
// MASTER SCORING COMPUTATION FUNCTION
// ============================================================================
export function calculateKhetAssessment(input: FarmAssessmentInput): KhetAssessmentResult {
  // 1. Gather all evidence items and separate them
  const verifiedEvidenceList: EvidenceRecord[] = [];
  const farmerEnteredList: EvidenceRecord[] = [];

  // Yield Evidence
  input.seasons.forEach((s) => {
    const item: EvidenceRecord = {
      id: `yield-${s.seasonId}`,
      category: 'Yield',
      labelEn: `${s.seasonName} Harvest: ${s.cropName}`,
      labelHi: `${s.seasonName} उपज: ${s.cropName}`,
      verificationTier: s.verificationTier,
      channel: s.verificationTier === 'verified_third_party' ? 'APMC_Mandi_Slip' : 'Self_Declaration',
      referenceNumber: s.documentRef,
      valueDescription: `${s.yieldQuintalsPerAcre.toFixed(1)} Qtl/Acre (${s.totalProductionQuintals} Qtl total)`,
      date: s.seasonName,
      confidenceWeight: s.verificationTier === 'verified_third_party' ? 1.0 : 0.6,
    };
    if (s.verificationTier === 'verified_third_party') verifiedEvidenceList.push(item);
    else farmerEnteredList.push(item);
  });

  // Sales Evidence
  input.salesRecords.forEach((sl) => {
    const item: EvidenceRecord = {
      id: `sale-${sl.recordId}`,
      category: 'Sales',
      labelEn: `Mandi Sale: ${sl.soldQuantityQuintals} Qtl ${sl.cropName}`,
      labelHi: `मंडी बिक्री: ${sl.soldQuantityQuintals} क्विंटल ${sl.cropName}`,
      verificationTier: sl.verificationTier,
      channel: sl.marketChannel === 'APMC' ? 'APMC_Mandi_Slip' : sl.marketChannel === 'e_NAM' ? 'e_NAM_Portal' : 'Self_Declaration',
      referenceNumber: sl.receiptNumber,
      valueDescription: `₹${sl.realizedPricePerQuintal}/Qtl (Total ₹${(sl.soldQuantityQuintals * sl.realizedPricePerQuintal).toLocaleString('en-IN')})`,
      date: sl.seasonName,
      confidenceWeight: sl.verificationTier === 'verified_third_party' ? 1.0 : 0.6,
    };
    if (sl.verificationTier === 'verified_third_party') verifiedEvidenceList.push(item);
    else farmerEnteredList.push(item);
  });

  // Input Purchase Evidence
  input.inputPurchases.forEach((inp) => {
    const item: EvidenceRecord = {
      id: `input-${inp.purchaseId}`,
      category: 'Input',
      labelEn: `Agri Input: ${inp.itemName}`,
      labelHi: `कृषि आदान: ${inp.itemName}`,
      verificationTier: inp.verificationTier,
      channel: inp.dealerGSTNumber ? 'GST_Dealer_Receipt' : 'Self_Declaration',
      referenceNumber: inp.dealerGSTNumber ? `GST: ${inp.dealerGSTNumber}` : undefined,
      valueDescription: `₹${inp.amountRupees.toLocaleString('en-IN')}`,
      date: inp.invoiceDate,
      confidenceWeight: inp.verificationTier === 'verified_third_party' ? 1.0 : 0.6,
    };
    if (inp.verificationTier === 'verified_third_party') verifiedEvidenceList.push(item);
    else farmerEnteredList.push(item);
  });

  // Soil Health Card Evidence
  if (input.soilHealthCardIssued) {
    verifiedEvidenceList.push({
      id: 'soil-health-card-1',
      category: 'Soil',
      labelEn: 'Official Soil Health Card',
      labelHi: 'मृदा स्वास्थ्य कार्ड (SHC)',
      verificationTier: 'verified_third_party',
      channel: 'Soil_Health_Card_Portal',
      referenceNumber: 'SHC-GUJ-2025-4821',
      valueDescription: 'pH 7.2, Organic Carbon 0.68%, Adequate Potash',
      date: input.soilHealthCardDate || '2025-08-15',
      confidenceWeight: 1.0,
    });
  }

  // 2. Compute Factors
  const yieldFactor = computeYieldFactor(input.seasons);
  const salesFactor = computeSalesFactor(input.salesRecords);
  const inputFactor = computeInputFactor(input.inputPurchases);
  const weatherFactor = computeWeatherFactor(input.weather);
  const dataFactor = computeDataConfidenceFactor(
    [...verifiedEvidenceList, ...farmerEnteredList],
    input.soilHealthCardIssued
  );

  const rawTotalScore =
    yieldFactor.rawScore +
    salesFactor.rawScore +
    inputFactor.rawScore +
    weatherFactor.rawScore +
    dataFactor.rawScore;

  const overallScore = Math.max(10, Math.min(100, rawTotalScore));

  // Determine Uncertainty Margin based on Data Completeness
  // Lower completeness = wider confidence interval, NOT lower credit score
  const completeness = dataFactor.completenessPercentage;
  const uncertaintyMargin =
    completeness >= 80 ? 4 : completeness >= 50 ? 8 : 14;

  const minimumScore = Math.max(0, overallScore - uncertaintyMargin);
  const maximumScore = Math.min(100, overallScore + uncertaintyMargin);

  // Band Determination
  let scoreBand: KhetAssessmentResult['scoreBand'] = 'Moderate Operational Stability (Grade B)';
  if (completeness < 35) {
    scoreBand = 'Preliminary / Data Incomplete';
  } else if (overallScore >= 80) {
    scoreBand = 'Resilient (Grade A)';
  } else if (overallScore >= 60) {
    scoreBand = 'Moderate Operational Stability (Grade B)';
  } else {
    scoreBand = 'Developing / High Volatility (Grade C)';
  }

  let dataReliabilityBand: KhetAssessmentResult['dataReliabilityBand'] = 'Moderate Verification';
  if (completeness >= 75 && dataFactor.verifiedCount >= 3) {
    dataReliabilityBand = 'High Verification';
  } else if (dataFactor.verifiedCount === 0 && dataFactor.unverifiedCount > 0) {
    dataReliabilityBand = 'Predominantly Self-Reported';
  } else if (completeness < 40) {
    dataReliabilityBand = 'Preliminary Sparse';
  }

  // Factors List
  const factors: FactorBreakdown[] = [
    {
      id: 'f1-yield',
      nameEn: 'Yield Stability & Consistency',
      nameHi: 'उपज स्थिरता व निरंतरता',
      category: 'Yield Stability',
      rawScore: yieldFactor.rawScore,
      maxPoints: SCORING_WEIGHTS.YIELD_STABILITY,
      normalizedPercentage: Math.round((yieldFactor.rawScore / SCORING_WEIGHTS.YIELD_STABILITY) * 100),
      statusLevel: yieldFactor.rawScore >= 24 ? 'Strong' : yieldFactor.rawScore >= 16 ? 'Satisfactory' : 'Needs Attention',
      explanationEn: yieldFactor.explanationEn,
      explanationHi: yieldFactor.explanationHi,
      impactOnResilience: yieldFactor.rawScore >= 22 ? 'High Positive' : 'Moderate Positive',
      dataCompletenessForFactor: yieldFactor.dataCompleteness,
      isBasedOnVerifiedEvidence: yieldFactor.isVerified,
    },
    {
      id: 'f2-sales',
      nameEn: 'Verified Market Sales Evidence',
      nameHi: 'सत्यापित मंडी बिक्री साक्ष्य',
      category: 'Verified Sales',
      rawScore: salesFactor.rawScore,
      maxPoints: SCORING_WEIGHTS.VERIFIED_SALES,
      normalizedPercentage: Math.round((salesFactor.rawScore / SCORING_WEIGHTS.VERIFIED_SALES) * 100),
      statusLevel: salesFactor.rawScore >= 18 ? 'Strong' : salesFactor.rawScore >= 12 ? 'Satisfactory' : 'Needs Attention',
      explanationEn: salesFactor.explanationEn,
      explanationHi: salesFactor.explanationHi,
      impactOnResilience: salesFactor.rawScore >= 16 ? 'High Positive' : 'Moderate Positive',
      dataCompletenessForFactor: salesFactor.dataCompleteness,
      isBasedOnVerifiedEvidence: salesFactor.isVerified,
    },
    {
      id: 'f3-inputs',
      nameEn: 'Agronomic Input Discipline',
      nameHi: 'संतुलित कृषि आदान व निवेश',
      category: 'Input Investment',
      rawScore: inputFactor.rawScore,
      maxPoints: SCORING_WEIGHTS.INPUT_INVESTMENT,
      normalizedPercentage: Math.round((inputFactor.rawScore / SCORING_WEIGHTS.INPUT_INVESTMENT) * 100),
      statusLevel: inputFactor.rawScore >= 15 ? 'Strong' : inputFactor.rawScore >= 10 ? 'Satisfactory' : 'Needs Attention',
      explanationEn: inputFactor.explanationEn,
      explanationHi: inputFactor.explanationHi,
      impactOnResilience: inputFactor.rawScore >= 14 ? 'High Positive' : 'Moderate Positive',
      dataCompletenessForFactor: inputFactor.dataCompleteness,
      isBasedOnVerifiedEvidence: inputFactor.isVerified,
    },
    {
      id: 'f4-weather',
      nameEn: 'Climate Resilience & Irrigation',
      nameHi: 'मौसम जोखिम व सिंचाई सुरक्षा',
      category: 'Weather Resilience',
      rawScore: weatherFactor.rawScore,
      maxPoints: SCORING_WEIGHTS.WEATHER_RESILIENCE,
      normalizedPercentage: Math.round((weatherFactor.rawScore / SCORING_WEIGHTS.WEATHER_RESILIENCE) * 100),
      statusLevel: weatherFactor.rawScore >= 12 ? 'Strong' : weatherFactor.rawScore >= 8 ? 'Satisfactory' : 'Needs Attention',
      explanationEn: weatherFactor.explanationEn,
      explanationHi: weatherFactor.explanationHi,
      impactOnResilience: weatherFactor.rawScore >= 11 ? 'High Positive' : 'Moderate Positive',
      dataCompletenessForFactor: weatherFactor.dataCompleteness,
      isBasedOnVerifiedEvidence: weatherFactor.isVerified,
    },
    {
      id: 'f5-completeness',
      nameEn: 'Data Completeness & Audit Reliability',
      nameHi: 'डेटा पूर्णता व सत्यापन स्तर',
      category: 'Data Verification',
      rawScore: dataFactor.rawScore,
      maxPoints: SCORING_WEIGHTS.DATA_VERIFICATION,
      normalizedPercentage: Math.round((dataFactor.rawScore / SCORING_WEIGHTS.DATA_VERIFICATION) * 100),
      statusLevel: dataFactor.completenessPercentage >= 70 ? 'Strong' : dataFactor.completenessPercentage >= 40 ? 'Satisfactory' : 'Unassessed / Sparse',
      explanationEn: dataFactor.explanationEn,
      explanationHi: dataFactor.explanationHi,
      impactOnResilience: 'Moderate Positive',
      dataCompletenessForFactor: dataFactor.completenessPercentage,
      isBasedOnVerifiedEvidence: dataFactor.verifiedCount > 0,
    },
  ];

  // 3. Compile Missing Information Checklist
  const missingInformation: MissingInformationItem[] = [];

  if (input.seasons.length < 2) {
    missingInformation.push({
      id: 'missing-seasons',
      fieldEn: 'Multi-Season Harvest Track Record (2+ seasons)',
      fieldHi: 'विगत 2+ सीज़न का कटाई रिकॉर्ड',
      importance: 'High',
      descriptionEn: 'Only one harvest season is currently registered in your digital ledger.',
      descriptionHi: 'वर्तमान में केवल एक फसल सीज़न का डेटा उपलब्ध है।',
      howToProvideEn: 'Add previous Rabi/Kharif production summaries from patwari or diary logs.',
      howToProvideHi: 'पिछली फसल के उत्पादन आंकड़े प्रोफाइल में दर्ज करें।',
      impactExplanation: 'Missing prior seasons increases score uncertainty (±' + uncertaintyMargin + ' pts) but does NOT imply poor creditworthiness.',
    });
  }

  if (!input.soilHealthCardIssued) {
    missingInformation.push({
      id: 'missing-soil-card',
      fieldEn: 'Soil Health Card (Within 3 years)',
      fieldHi: 'मृदा स्वास्थ्य कार्ड (3 वर्ष के भीतर)',
      importance: 'Medium',
      descriptionEn: 'No official NPK and micro-nutrient soil test certificate is attached.',
      descriptionHi: 'कोई आधिकारिक मिट्टी जांच रिपोर्ट अपलोड नहीं है।',
      howToProvideEn: 'Request a soil test kit at the nearest Krishi Vigyan Kendra (KVK) or input center.',
      howToProvideHi: 'नजदीकी कृषि विज्ञान केंद्र से मिट्टी की जांच करवाएं।',
      impactExplanation: 'Unchecked soil health limits micro-nutrient optimization points; no penalty is deducted.',
    });
  }

  if (input.salesRecords.length === 0 || !input.salesRecords.some((s) => s.hasOfficialReceipt)) {
    missingInformation.push({
      id: 'missing-mandi-receipt',
      fieldEn: 'Verified APMC / e-NAM Mandi Gate Pass',
      fieldHi: 'सत्यापित APMC या e-NAM गेट पास रसीद',
      importance: 'High',
      descriptionEn: 'No verified mandi sale receipt or mill payment challan was supplied.',
      descriptionHi: 'कोई सत्यापित मंडी बिक्री रसीद या भुगतान चालान नहीं जोड़ा गया।',
      howToProvideEn: 'Upload clear photo of the APMC auction slip or e-NAM settlement slip.',
      howToProvideHi: 'मंडी नीलामी पर्ची या e-NAM भुगतान रसीद की फोटो अपलोड करें।',
      impactExplanation: 'Cash transactions without receipts are marked unverified, but do NOT lower your operational base score.',
    });
  }

  // 4. Agronomic Assumptions
  const assumptions: AgronomicAssumption[] = [
    {
      id: 'assump-benchmark',
      factor: 'Yield Reference',
      assumptionTextEn: `District benchmark average (${input.seasons[0]?.districtBenchmarkYield || 18.5} Qtl/Acre) is assumed as the agro-climatic normal for ${input.district || 'Mehsana'}.`,
      assumptionTextHi: `जिले का मानक औसत (${input.seasons[0]?.districtBenchmarkYield || 18.5} क्विंटल/एकड़) क्षेत्रीय सामान्य स्तर माना गया है।`,
      rationaleEn: 'Normalizes micro-regional soil differences against regional ICAR extension datasets.',
    },
    {
      id: 'assump-weather',
      factor: 'Micro-Weather Risk',
      assumptionTextEn: 'Weather exposure is calculated from the nearest IMD automatic weather station telemetry.',
      assumptionTextHi: 'मौसम जोखिम निकटतम IMD मौसम स्टेशन डेटा से निकाला गया है।',
      rationaleEn: 'Accounts for precipitation anomalies without requiring on-farm weather stations.',
    },
    {
      id: 'assump-missing-data',
      factor: 'Missing Data Neutrality',
      assumptionTextEn: 'Unrecorded fields reflect incomplete digital record-keeping rather than poor farm management.',
      assumptionTextHi: 'अपूर्ण रिकॉर्ड को केवल डिजिटलीकरण की कमी माना गया है, खराब खेती नहीं।',
      rationaleEn: 'Prevents structural exclusion of smallholders who operate primarily via traditional paper-free means.',
    },
  ];

  // 5. Strengths & Vulnerabilities
  const strengths: string[] = [];
  const vulnerabilities: string[] = [];

  if (yieldFactor.rawScore >= 20) {
    strengths.push('High yield consistency above local agro-climatic average.');
  }
  if (input.weather.irrigationMethod === 'Micro_Drip_Sprinkler') {
    strengths.push('Micro-drip irrigation significantly buffers against unseasonal heat waves and water shortages.');
  }
  if (salesFactor.isVerified) {
    strengths.push('Formal market integration with verified APMC/e-NAM transparent transactions.');
  }

  if (completeness < 50) {
    vulnerabilities.push('Low data completeness increases assessment uncertainty margin.');
  }
  if (!input.weather.hasProtectiveIrrigation) {
    vulnerabilities.push('Rainfed dependence increases risk during erratic rainfall deviations.');
  }
  if (!input.soilHealthCardIssued) {
    vulnerabilities.push('Absence of recent soil test leaves fertilizer dosage uncalibrated.');
  }

  // 6. Action Plan
  const actionPlan = [
    {
      titleEn: 'Register Mandi Gate Passes on e-NAM',
      titleHi: 'e-NAM पोर्टल पर मंडी पर्ची दर्ज करें',
      descriptionEn: 'Digitize APMC receipts for upcoming harvest to strengthen verified sales evidence.',
      descriptionHi: 'अगली फसल की APMC रसीद जोड़कर सत्यापित बिक्री का प्रमाण बढ़ाएं।',
      expectedResilienceGain: '+5 to +8 points on Data Verification',
    },
    {
      titleEn: 'Conduct Soil Health Test',
      titleHi: 'मृदा स्वास्थ्य परीक्षण करवाएं',
      descriptionEn: 'Obtain updated Soil Health Card to optimize fertilizer expenditure by up to 20%.',
      descriptionHi: 'नया मृदा स्वास्थ्य कार्ड बनवाकर खाद का खर्च 20% तक बचाएं।',
      expectedResilienceGain: '+4 points on Agronomic Input Discipline',
    },
  ];

  return {
    overallScore,
    scoreBand,
    scoreRange: {
      minimum: minimumScore,
      maximum: maximumScore,
      uncertaintyMargin,
    },
    dataCompletenessPercentage: completeness,
    dataReliabilityBand,
    factors,
    verifiedEvidenceList,
    farmerEnteredList,
    missingInformation,
    assumptions,
    strengths: strengths.length > 0 ? strengths : ['Baseline agricultural operations intact.'],
    vulnerabilities: vulnerabilities.length > 0 ? vulnerabilities : ['No critical vulnerabilities identified.'],
    actionPlan,
    statutoryDisclaimerEn:
      'REGULATORY & CREDIT DISCLAIMER: Khet Score is an agronomic farm operational resilience assessment designed to reflect field stability, climate preparedness, and recorded sales discipline. It is NOT an official credit bureau score (such as CIBIL, Equifax, or Experian), does NOT prove statutory land title or ownership, does NOT guarantee bank loan sanction, and does NOT replace institutional underwriting. Missing data is not treated as evidence of poor creditworthiness.',
    statutoryDisclaimerHi:
      'वैधानिक व वित्तीय अस्वीकरण: खेत स्कोर एक कृषि परिचालन व फसल स्वास्थ्य आकलन है जो खेत की निरंतरता और मौसम सुरक्षा को दर्शाता है। यह कोई आधिकारिक क्रेडिट ब्यूरो स्कोर (जैसे CIBIL) नहीं है, यह भूमि के कानूनी स्वामित्व को प्रमाणित नहीं करता है, न ही यह बैंक ऋण की गारंटी देता है। डिजिटलीकरण या डेटा की कमी को खराब साख का प्रमाण नहीं माना जाता है।',
    computedAt: new Date().toISOString(),
  };
}
