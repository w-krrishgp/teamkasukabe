/**
 * HarvestGuard — No Distress Selling Decision Engine
 * Domain Type Definitions
 */

export type CropCategory = 'cereal_grain' | 'perishable' | 'semi_perishable' | 'oilseed_pulse';

export type OptionId =
  | 'sell_immediately'
  | 'store_and_sell_later'
  | 'alternative_buyer'
  | 'crop_pooling';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'prohibitive';

export type FeasibilityStatus = 'optimal' | 'viable' | 'warning' | 'not_recommended';

export interface LocationInput {
  village?: string;
  district: string;
  state: string;
}

export interface ImmediateBuyerOffer {
  buyerName: string;
  buyerType: 'local_apmc_trader' | 'village_aggregator' | 'farmgate_middleman';
  pricePerQuintal: number;
  paymentTerms: 'immediate_cash' | 'credit_7d' | 'credit_15d';
  distanceKm: number;
  mandiCommissionPercent: number; // e.g. 1.5%
  handlingCostPerQuintal: number; // e.g. ₹20/qtl
}

export interface StorageOptions {
  facilityName: string;
  facilityType: 'cold_storage' | 'wdra_warehouse' | 'on_farm_aerated_silo';
  monthlyRentPerQuintal: number; // ₹ / qtl / month
  plannedHoldingDays: number; // Holding duration in days
  expectedFuturePricePerQuintal: number; // Projected market price after holding period
  storageEntryHandlingPerQuintal: number; // In/Out labor and stacking (₹/qtl)
  spoilageRatePercentPerMonth: number; // Natural shrinkage / moisture / spoilage % per month
  insuranceFeePerQuintal: number; // Warehouse insurance cover (₹/qtl)
  financingInterestRateAnnualPercent: number; // e.g. 4% KCC interest opportunity cost
  isSubsidizedWarehousing?: boolean; // NABARD / Govt interest subvention
}

export interface AlternativeBuyerOffer {
  buyerName: string;
  buyerType: 'flour_oil_mill' | 'food_processing_co' | 'organized_retailer' | 'distant_apmc_exporter';
  pricePerQuintal: number;
  distanceKm: number;
  paymentTerms: 'advance_50' | 'credit_3d' | 'direct_bank_transfer_24h';
  qualityDeductionPerQuintal: number; // Moisture/foreign dockage (₹/qtl)
  transitLossPercent: number; // e.g. 0.5% transport weight shrinkage
  commissionPercent: number; // e.g. 0% for direct factory sale, or 1%
  minimumBatchQuintals?: number;
}

export interface CropPoolingOpportunity {
  poolId: string;
  poolName: string;
  organizer: string; // e.g. "Mehsana Kisan Producer FPO"
  currentPooledQuintals: number;
  targetPoolQuintals: number;
  destinationHub: string;
  distanceKm: number;
  pooledContractPricePerQuintal: number;
  sharedFreightSavingsPercent: number; // e.g. 40% transport savings from consolidated 16-ton truck
  poolingCoordinationFeePerQuintal: number; // e.g. ₹15 / qtl
  pickupWindowDays: number;
  status: 'open' | 'filling' | 'ready';
}

export interface TransportParams {
  baseFreightRatePerKmPerQuintal: number; // e.g. ₹2.20 / km / quintal
  minimumTripCharge: number; // e.g. ₹400 minimum lorry / tempo charge
  loadingUnloadingPerQuintal: number; // e.g. ₹25 / quintal labor
}

export interface DistressSellingInputs {
  cropName: string;
  cropCategory: CropCategory;
  quantityQuintals: number;
  harvestDate: string; // YYYY-MM-DD
  shelfLifeDays: number;
  location: LocationInput;
  immediateOffer: ImmediateBuyerOffer;
  transportParams: TransportParams;
  storageOptions: StorageOptions;
  alternativeBuyerOffer?: AlternativeBuyerOffer;
  cropPoolingOpportunity?: CropPoolingOpportunity;
  isKccFinanceEnabled?: boolean; // Include 4% p.a. holding opportunity cost in calculation
}

export interface ItemizedCosts {
  transportCost: number;
  storageRentCost: number;
  handlingAndLaborCost: number;
  spoilageLossValue: number;
  commissionAndMandiFees: number;
  holdingOpportunityFinanceCost: number;
  totalCosts: number;
}

export interface OptionAnalysis {
  id: OptionId;
  title: string;
  subtitle: string;
  badgeLabel: string;
  isRecommended: boolean;
  rank: number; // 1 = highest recommended
  grossRevenue: number;
  effectiveQuantitySold: number;
  spoilageQuantityLossKg: number;
  costs: ItemizedCosts;
  netProceeds: number;
  netRealizedPricePerQuintal: number;
  netGainVsImmediate: number;
  netGainPercentageVsImmediate: number;
  spoilageRisk: RiskLevel;
  shelfLifeRemainingAfterActionDays: number;
  feasibility: FeasibilityStatus;
  feasibilityReason?: string;
  whyRecommended: string;
  bulletAssumptions: string[];
  disclaimers: string[];
}

export interface EngineValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DecisionEngineResult {
  inputs: DistressSellingInputs;
  options: Record<OptionId, OptionAnalysis | null>;
  rankedOptions: OptionAnalysis[];
  recommendedOption: OptionAnalysis;
  breakEvenFuturePriceForStorage: number;
  immediateNetProceeds: number;
  maximumNetProceeds: number;
  maxNetGainVsDistress: number;
  storageFeasibility: {
    isShelfLifeExceeded: boolean;
    excessDays: number;
    priceSpreadRequiredPerQuintal: number;
  };
  validation: EngineValidation;
  calculatedAt: string;
}

export interface BookingEnquiry {
  id?: string;
  farmerId?: string;
  farmerName: string;
  farmerPhone: string;
  cropName: string;
  quantityQuintals: number;
  optionSelected: OptionId;
  targetEntityName: string; // Warehouse name or Buyer name or Pool name
  expectedNetProceeds: number;
  notes?: string;
  createdAt?: string;
  status?: 'pending_confirmation' | 'contacted' | 'confirmed';
}
