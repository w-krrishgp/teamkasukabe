import { FarmAssessmentInput } from './types';

/**
 * Pre-configured Test Profiles for Khet Score Assessment
 * Covers valid, missing data, climate exposed, unverified, and invalid edge cases.
 */

// Profile 1: Complete & Verified Farm Profile
export const VERIFIED_HIGH_RESILIENCE_PROFILE: FarmAssessmentInput = {
  farmId: 'farm-kheda-01',
  farmName: 'Kheda Farm #1, Mehsana',
  farmerName: 'Ramesh Patel',
  plotSurveyNumber: 'SURVEY-MEH-482/A',
  totalAcreage: 4.5,
  district: 'Mehsana, Gujarat',
  soilHealthCardIssued: true,
  soilHealthCardDate: '2025-09-12',
  seasons: [
    {
      seasonId: 's-rabi-2024',
      seasonName: 'Rabi 2024-25',
      cropName: 'Wheat (HD-2967)',
      harvestedAreaAcres: 4.5,
      totalProductionQuintals: 92,
      yieldQuintalsPerAcre: 20.44,
      districtBenchmarkYield: 18.5,
      verificationTier: 'verified_third_party',
      documentRef: 'APMC-UNJ-GATE-8419',
    },
    {
      seasonId: 's-kharif-2024',
      seasonName: 'Kharif 2024',
      cropName: 'Groundnut (GG-20)',
      harvestedAreaAcres: 4.0,
      totalProductionQuintals: 38,
      yieldQuintalsPerAcre: 9.5,
      districtBenchmarkYield: 9.0,
      verificationTier: 'verified_third_party',
      documentRef: 'APMC-KADI-SLIP-3910',
    },
    {
      seasonId: 's-rabi-2023',
      seasonName: 'Rabi 2023-24',
      cropName: 'Wheat (GW-496)',
      harvestedAreaAcres: 4.5,
      totalProductionQuintals: 88,
      yieldQuintalsPerAcre: 19.55,
      districtBenchmarkYield: 18.5,
      verificationTier: 'verified_third_party',
      documentRef: 'APMC-UNJ-GATE-6281',
    },
  ],
  salesRecords: [
    {
      recordId: 'sale-01',
      seasonName: 'Rabi 2024-25',
      cropName: 'Wheat (HD-2967)',
      soldQuantityQuintals: 80,
      realizedPricePerQuintal: 2680,
      marketChannel: 'APMC',
      hasOfficialReceipt: true,
      verificationTier: 'verified_third_party',
      receiptNumber: 'APMC-UNJHA-REC-9241',
    },
    {
      recordId: 'sale-02',
      seasonName: 'Kharif 2024',
      cropName: 'Groundnut',
      soldQuantityQuintals: 32,
      realizedPricePerQuintal: 6450,
      marketChannel: 'e_NAM',
      hasOfficialReceipt: true,
      verificationTier: 'verified_third_party',
      receiptNumber: 'ENAM-GJ-2024-512',
    },
  ],
  inputPurchases: [
    {
      purchaseId: 'inp-01',
      itemName: 'Certified Wheat Seed HD-2967 (180 kg)',
      category: 'Certified_Seed',
      amountRupees: 6400,
      dealerGSTNumber: '24AAACT1284E1Z3',
      isSubsidizedDBT: true,
      verificationTier: 'verified_third_party',
      invoiceDate: '2024-11-05',
    },
    {
      purchaseId: 'inp-02',
      itemName: 'IFFCO Nano Urea & DAP (Balanced NPK)',
      category: 'Balanced_Fertilizer',
      amountRupees: 7850,
      dealerGSTNumber: '24AAACT1284E1Z3',
      isSubsidizedDBT: true,
      verificationTier: 'verified_third_party',
      invoiceDate: '2024-11-18',
    },
    {
      purchaseId: 'inp-03',
      itemName: 'Trichoderma Viride Bio-Fungicide',
      category: 'Bio_Pesticide',
      amountRupees: 1800,
      dealerGSTNumber: '24AABCA5918F1Z8',
      isSubsidizedDBT: false,
      verificationTier: 'verified_third_party',
      invoiceDate: '2024-12-02',
    },
  ],
  weather: {
    district: 'Mehsana',
    rainfallDeviationPercent: -6,
    heatStressDaysDuringFlowering: 3,
    droughtFloodVulnerability: 'Low',
    hasProtectiveIrrigation: true,
    irrigationMethod: 'Micro_Drip_Sprinkler',
    isInsuredPMFBY: true,
  },
};

// Profile 2: Missing Data Profile (Demonstrating non-punitive missing data modeling)
export const MISSING_DATA_PROFILE: FarmAssessmentInput = {
  farmId: 'farm-amreli-new',
  farmName: 'Amreli Smallholder Plot',
  farmerName: 'Kavita Ben',
  plotSurveyNumber: 'SURVEY-AMR-102',
  totalAcreage: 2.0,
  district: 'Amreli, Gujarat',
  soilHealthCardIssued: false, // Missing soil card
  seasons: [
    {
      seasonId: 's-rabi-2024-kavita',
      seasonName: 'Rabi 2024-25',
      cropName: 'Wheat',
      harvestedAreaAcres: 2.0,
      totalProductionQuintals: 36,
      yieldQuintalsPerAcre: 18.0,
      districtBenchmarkYield: 18.5,
      verificationTier: 'farmer_entered', // Self-reported
    },
    // No prior season records (Missing data)
  ],
  salesRecords: [], // No uploaded receipts yet (Missing data)
  inputPurchases: [], // No uploaded GST receipts (Missing data)
  weather: {
    district: 'Amreli',
    rainfallDeviationPercent: -14,
    heatStressDaysDuringFlowering: 5,
    droughtFloodVulnerability: 'Moderate',
    hasProtectiveIrrigation: true,
    irrigationMethod: 'Canal_Borewell_Flood',
    isInsuredPMFBY: false,
  },
};

// Profile 3: Climate Exposed Profile
export const CLIMATE_EXPOSED_PROFILE: FarmAssessmentInput = {
  farmId: 'farm-kutch-arid',
  farmName: 'Bhadreshwar Farm, Kutch',
  farmerName: 'Devji Bhai',
  plotSurveyNumber: 'SURVEY-KUTCH-90',
  totalAcreage: 6.0,
  district: 'Kutch, Gujarat',
  soilHealthCardIssued: true,
  soilHealthCardDate: '2024-04-10',
  seasons: [
    {
      seasonId: 's-kharif-2024-kutch',
      seasonName: 'Kharif 2024',
      cropName: 'Castor Seed',
      harvestedAreaAcres: 6.0,
      totalProductionQuintals: 42,
      yieldQuintalsPerAcre: 7.0,
      districtBenchmarkYield: 7.5,
      verificationTier: 'verified_third_party',
      documentRef: 'APMC-BHUJ-810',
    },
  ],
  salesRecords: [
    {
      recordId: 'sale-kutch-01',
      seasonName: 'Kharif 2024',
      cropName: 'Castor Seed',
      soldQuantityQuintals: 40,
      realizedPricePerQuintal: 5900,
      marketChannel: 'APMC',
      hasOfficialReceipt: true,
      verificationTier: 'verified_third_party',
      receiptNumber: 'APMC-BHUJ-REC-4819',
    },
  ],
  inputPurchases: [
    {
      purchaseId: 'inp-kutch-01',
      itemName: 'Hybrid Castor GCH-7 Seed',
      category: 'Certified_Seed',
      amountRupees: 4200,
      dealerGSTNumber: '24AAACT1284E1Z3',
      isSubsidizedDBT: true,
      verificationTier: 'verified_third_party',
      invoiceDate: '2024-06-20',
    },
  ],
  weather: {
    district: 'Kutch',
    rainfallDeviationPercent: -34, // Severe drought deviation
    heatStressDaysDuringFlowering: 14,
    droughtFloodVulnerability: 'High',
    hasProtectiveIrrigation: true,
    irrigationMethod: 'Micro_Drip_Sprinkler', // Resilient drip saves crop
    isInsuredPMFBY: true,
  },
};

// Profile 4: Unverified Self-Reported Only Profile
export const UNVERIFIED_SELF_REPORTED_PROFILE: FarmAssessmentInput = {
  farmId: 'farm-unverified-01',
  farmName: 'Sabarkantha Unverified Holding',
  farmerName: 'Manish Kumar',
  totalAcreage: 3.0,
  district: 'Sabarkantha, Gujarat',
  soilHealthCardIssued: false,
  seasons: [
    {
      seasonId: 's-rabi-self-1',
      seasonName: 'Rabi 2024-25',
      cropName: 'Wheat',
      harvestedAreaAcres: 3.0,
      totalProductionQuintals: 55,
      yieldQuintalsPerAcre: 18.33,
      districtBenchmarkYield: 18.5,
      verificationTier: 'farmer_entered',
    },
  ],
  salesRecords: [
    {
      recordId: 'sale-cash-1',
      seasonName: 'Rabi 2024-25',
      cropName: 'Wheat',
      soldQuantityQuintals: 50,
      realizedPricePerQuintal: 2500,
      marketChannel: 'Local_Aggregator_Cash',
      hasOfficialReceipt: false, // Cash sale without receipt
      verificationTier: 'farmer_entered',
    },
  ],
  inputPurchases: [
    {
      purchaseId: 'inp-cash-1',
      itemName: 'Fertilizer purchased in village cash',
      category: 'Balanced_Fertilizer',
      amountRupees: 5000,
      isSubsidizedDBT: false,
      verificationTier: 'farmer_entered',
      invoiceDate: '2024-11-20',
    },
  ],
  weather: {
    district: 'Sabarkantha',
    rainfallDeviationPercent: +8,
    heatStressDaysDuringFlowering: 4,
    droughtFloodVulnerability: 'Low',
    hasProtectiveIrrigation: true,
    irrigationMethod: 'Canal_Borewell_Flood',
    isInsuredPMFBY: false,
  },
};

// Profile 5: Invalid Input Profile (To test validation errors)
export const INVALID_TEST_PROFILE: FarmAssessmentInput = {
  farmId: 'invalid-farm',
  farmName: '', // Error: Empty name
  farmerName: 'Test Invalid',
  totalAcreage: -5, // Error: Negative acreage
  district: '',
  soilHealthCardIssued: false,
  seasons: [
    {
      seasonId: 'invalid-season-1',
      seasonName: 'Future Season 2035',
      cropName: 'Wheat',
      harvestedAreaAcres: 0, // Error: 0 area
      totalProductionQuintals: -20, // Error: Negative production
      yieldQuintalsPerAcre: -20,
      districtBenchmarkYield: 18.5,
      verificationTier: 'farmer_entered',
    },
  ],
  salesRecords: [
    {
      recordId: 'invalid-sale',
      seasonName: 'Rabi',
      cropName: 'Wheat',
      soldQuantityQuintals: -10, // Error: Negative quantity
      realizedPricePerQuintal: -500, // Error: Negative price
      marketChannel: 'Local_Aggregator_Cash',
      hasOfficialReceipt: false,
      verificationTier: 'farmer_entered',
    },
  ],
  inputPurchases: [
    {
      purchaseId: 'invalid-inp',
      itemName: 'Negative item',
      category: 'Certified_Seed',
      amountRupees: -4000, // Error: Negative amount
      isSubsidizedDBT: false,
      verificationTier: 'farmer_entered',
      invoiceDate: '2024-11-20',
    },
  ],
  weather: {
    district: 'Unknown',
    rainfallDeviationPercent: 0,
    heatStressDaysDuringFlowering: 0,
    droughtFloodVulnerability: 'Low',
    hasProtectiveIrrigation: false,
    irrigationMethod: 'Rainfed_Only',
    isInsuredPMFBY: false,
  },
};
