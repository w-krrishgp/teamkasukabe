/**
 * Khet Score Engine Types
 * Defines the data contracts for an explainable agricultural operational assessment.
 * Separates verified third-party evidence from farmer-entered data.
 * Adheres strictly to non-punitive missing data modeling.
 */

export type VerificationTier =
  | 'verified_third_party' // Third-party validated (APMC slip, GST invoice, DBT, Satellite)
  | 'farmer_entered'       // Self-declared without supporting formal paper/e-receipt
  | 'missing';             // Not provided

export type VerificationChannel =
  | 'APMC_Mandi_Slip'
  | 'e_NAM_Portal'
  | 'FPO_Purchase_Order'
  | 'GST_Dealer_Receipt'
  | 'Soil_Health_Card_Portal'
  | 'Satellite_NDVI_Pass'
  | 'Self_Declaration'
  | 'Unverified_Cash';

export interface EvidenceRecord {
  id: string;
  category: 'Yield' | 'Sales' | 'Input' | 'Soil' | 'Weather';
  labelEn: string;
  labelHi: string;
  verificationTier: VerificationTier;
  channel: VerificationChannel;
  referenceNumber?: string;
  valueDescription: string;
  date: string;
  confidenceWeight: number; // 1.0 for verified, 0.6 for self-reported, 0 for missing
}

export interface SeasonYieldRecord {
  seasonId: string;
  seasonName: string; // e.g. "Rabi 2024-25"
  cropName: string;
  harvestedAreaAcres: number;
  totalProductionQuintals: number;
  yieldQuintalsPerAcre: number;
  districtBenchmarkYield: number; // Regional average yield for comparison
  verificationTier: VerificationTier;
  documentRef?: string;
}

export interface SalesRecord {
  recordId: string;
  seasonName: string;
  cropName: string;
  soldQuantityQuintals: number;
  realizedPricePerQuintal: number;
  marketChannel: 'APMC' | 'e_NAM' | 'Corporate_Contract' | 'Local_Aggregator_Cash';
  hasOfficialReceipt: boolean;
  verificationTier: VerificationTier;
  receiptNumber?: string;
}

export interface InputPurchaseRecord {
  purchaseId: string;
  itemName: string;
  category: 'Certified_Seed' | 'Balanced_Fertilizer' | 'Bio_Pesticide' | 'Micro_Irrigation' | 'Equipment';
  amountRupees: number;
  dealerGSTNumber?: string;
  isSubsidizedDBT: boolean;
  verificationTier: VerificationTier;
  invoiceDate: string;
}

export interface WeatherExposureData {
  district: string;
  rainfallDeviationPercent: number; // e.g., -12% or +18% from long-term normal
  heatStressDaysDuringFlowering: number; // Count of critical high-temp days
  droughtFloodVulnerability: 'Low' | 'Moderate' | 'High';
  hasProtectiveIrrigation: boolean;
  irrigationMethod: 'Micro_Drip_Sprinkler' | 'Canal_Borewell_Flood' | 'Rainfed_Only';
  isInsuredPMFBY: boolean;
}

export interface FarmAssessmentInput {
  farmId: string;
  farmName: string;
  farmerName: string;
  plotSurveyNumber?: string;
  totalAcreage: number;
  district: string;
  soilHealthCardIssued: boolean;
  soilHealthCardDate?: string;
  seasons: SeasonYieldRecord[];
  salesRecords: SalesRecord[];
  inputPurchases: InputPurchaseRecord[];
  weather: WeatherExposureData;
}

export interface FactorBreakdown {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'Yield Stability' | 'Verified Sales' | 'Input Investment' | 'Weather Resilience' | 'Data Verification';
  rawScore: number;
  maxPoints: number;
  normalizedPercentage: number;
  statusLevel: 'Strong' | 'Satisfactory' | 'Needs Attention' | 'Unassessed / Sparse';
  explanationEn: string;
  explanationHi: string;
  impactOnResilience: 'High Positive' | 'Moderate Positive' | 'Neutral' | 'Vulnerability';
  dataCompletenessForFactor: number; // 0-100%
  isBasedOnVerifiedEvidence: boolean;
}

export interface MissingInformationItem {
  id: string;
  fieldEn: string;
  fieldHi: string;
  importance: 'High' | 'Medium' | 'Low';
  descriptionEn: string;
  descriptionHi: string;
  howToProvideEn: string;
  howToProvideHi: string;
  impactExplanation: string; // Explains why this is not penalized as poor credit
}

export interface AgronomicAssumption {
  id: string;
  factor: string;
  assumptionTextEn: string;
  assumptionTextHi: string;
  rationaleEn: string;
}

export interface KhetAssessmentResult {
  overallScore: number; // 0 - 100
  scoreBand: 'Resilient (Grade A)' | 'Moderate Operational Stability (Grade B)' | 'Developing / High Volatility (Grade C)' | 'Preliminary / Data Incomplete';
  scoreRange: {
    minimum: number;
    maximum: number;
    uncertaintyMargin: number;
  };
  dataCompletenessPercentage: number; // 0 - 100%
  dataReliabilityBand: 'High Verification' | 'Moderate Verification' | 'Predominantly Self-Reported' | 'Preliminary Sparse';
  
  factors: FactorBreakdown[];
  verifiedEvidenceList: EvidenceRecord[];
  farmerEnteredList: EvidenceRecord[];
  missingInformation: MissingInformationItem[];
  assumptions: AgronomicAssumption[];

  strengths: string[];
  vulnerabilities: string[];
  actionPlan: Array<{
    titleEn: string;
    titleHi: string;
    descriptionEn: string;
    descriptionHi: string;
    expectedResilienceGain: string;
  }>;

  statutoryDisclaimerEn: string;
  statutoryDisclaimerHi: string;
  computedAt: string;
}

export interface KhetValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}
