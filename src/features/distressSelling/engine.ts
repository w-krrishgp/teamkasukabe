/**
 * HarvestGuard — No Distress Selling Decision Engine
 * Pure TypeScript Calculation Core
 *
 * Implements deterministic net proceeds calculations across 4 harvest options:
 * 1. Sell immediately (Local distress / APMC cash)
 * 2. Store and sell later (Accredited warehouse / cold storage)
 * 3. Sell to alternative buyer (Direct food processor / distant miller)
 * 4. Join crop pooling (Bulk consolidated farmer logistics)
 */

import type {
  DistressSellingInputs,
  DecisionEngineResult,
  OptionAnalysis,
  OptionId,
  ItemizedCosts,
  EngineValidation,
  RiskLevel,
  FeasibilityStatus,
} from './types';

/**
 * Validates farmer input parameters before execution.
 */
export function validateDistressSellingInputs(inputs: DistressSellingInputs): EngineValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!inputs.cropName || inputs.cropName.trim().length === 0) {
    errors.push('Crop name is required.');
  }

  if (typeof inputs.quantityQuintals !== 'number' || isNaN(inputs.quantityQuintals) || inputs.quantityQuintals <= 0) {
    errors.push('Quantity must be greater than 0 Quintals.');
  }

  if (!inputs.immediateOffer || inputs.immediateOffer.pricePerQuintal <= 0) {
    errors.push('Immediate buyer offer price must be greater than ₹0.');
  }

  if (inputs.shelfLifeDays <= 0) {
    errors.push('Expected shelf life must be at least 1 day.');
  }

  if (inputs.storageOptions) {
    if (inputs.storageOptions.plannedHoldingDays > inputs.shelfLifeDays) {
      warnings.push(
        `Planned storage holding duration (${inputs.storageOptions.plannedHoldingDays} days) exceeds crop shelf life (${inputs.shelfLifeDays} days). Severe spoilage risk!`
      );
    }

    if (inputs.storageOptions.expectedFuturePricePerQuintal < inputs.immediateOffer.pricePerQuintal) {
      warnings.push('Expected future price is lower than the current immediate offer.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Calculates option 1: Sell Immediately
 */
function calculateImmediateSale(
  inputs: DistressSellingInputs
): OptionAnalysis {
  const q = inputs.quantityQuintals;
  const price = inputs.immediateOffer.pricePerQuintal;
  const distanceKm = inputs.immediateOffer.distanceKm || 0;
  const baseRate = inputs.transportParams.baseFreightRatePerKmPerQuintal || 2;
  const minTrip = inputs.transportParams.minimumTripCharge || 0;
  const laborRate = inputs.transportParams.loadingUnloadingPerQuintal || 0;

  // Gross Revenue
  const grossRevenue = Math.round(q * price);

  // Transport to local buyer/mandi
  const rawTransport = distanceKm * baseRate * q;
  const transportCost = Math.round(Math.max(distanceKm > 0 ? minTrip : 0, rawTransport));

  // Mandi commission / platform tax
  const commissionRate = inputs.immediateOffer.mandiCommissionPercent || 0;
  const commissionAndMandiFees = Math.round(grossRevenue * (commissionRate / 100));

  // Handling and loading
  const handlingAndLaborCost = Math.round(
    q * (inputs.immediateOffer.handlingCostPerQuintal || 0) + q * laborRate
  );

  const totalCosts = transportCost + commissionAndMandiFees + handlingAndLaborCost;
  const netProceeds = grossRevenue - totalCosts;
  const netRealizedPrice = q > 0 ? Math.round((netProceeds / q) * 100) / 100 : 0;

  const costs: ItemizedCosts = {
    transportCost,
    storageRentCost: 0,
    handlingAndLaborCost,
    spoilageLossValue: 0,
    commissionAndMandiFees,
    holdingOpportunityFinanceCost: 0,
    totalCosts,
  };

  return {
    id: 'sell_immediately',
    title: 'Sell Immediately',
    subtitle: `${inputs.immediateOffer.buyerName} (${distanceKm} km)`,
    badgeLabel: 'Instant Cash Liquidity',
    isRecommended: false,
    rank: 4,
    grossRevenue,
    effectiveQuantitySold: q,
    spoilageQuantityLossKg: 0,
    costs,
    netProceeds,
    netRealizedPricePerQuintal: netRealizedPrice,
    netGainVsImmediate: 0,
    netGainPercentageVsImmediate: 0,
    spoilageRisk: 'low',
    shelfLifeRemainingAfterActionDays: inputs.shelfLifeDays,
    feasibility: 'viable',
    whyRecommended: 'Provides immediate cash without storage, future market risk, or spoilage uncertainty.',
    bulletAssumptions: [
      `Payment terms: ${inputs.immediateOffer.paymentTerms.replace('_', ' ').toUpperCase()}`,
      `Local transport: ${distanceKm} km at ₹${baseRate}/km/qtl`,
      commissionRate > 0 ? `APMC mandi cess/commission: ${commissionRate}%` : 'Zero APMC commission applied',
      'Zero post-harvest holding risk or degradation',
    ],
    disclaimers: [
      'Offer valid subject to physical grade verification at weighbridge.',
      'Does not guarantee market stability if arrival volume surges tomorrow.',
    ],
  };
}

/**
 * Calculates option 2: Store and Sell Later
 */
function calculateStorageAndLaterSale(
  inputs: DistressSellingInputs,
  immediateNet: number
): OptionAnalysis {
  const q = inputs.quantityQuintals;
  const storage = inputs.storageOptions;
  const holdingDays = Math.max(0, storage.plannedHoldingDays || 0);
  const futurePrice = storage.expectedFuturePricePerQuintal || 0;
  const monthlyRent = storage.monthlyRentPerQuintal || 0;
  const monthlySpoilagePercent = storage.spoilageRatePercentPerMonth || 0;
  const laborRate = inputs.transportParams.loadingUnloadingPerQuintal || 0;
  const baseRate = inputs.transportParams.baseFreightRatePerKmPerQuintal || 2;
  const minTrip = inputs.transportParams.minimumTripCharge || 0;

  // Spoilage calculation: linear monthly degradation capped at 100%
  const totalSpoilagePercent = Math.min(100, (monthlySpoilagePercent * holdingDays) / 30);
  const effectiveQuantity = Math.max(0, q * (1 - totalSpoilagePercent / 100));
  const spoilageLossQuintals = q - effectiveQuantity;
  const spoilageQuantityLossKg = Math.round(spoilageLossQuintals * 100);

  // Gross Revenue from effective preserved volume
  const grossRevenue = Math.round(effectiveQuantity * futurePrice);
  const spoilageLossValue = Math.round(spoilageLossQuintals * futurePrice);

  // Storage Rent
  const monthsHeld = holdingDays / 30;
  const storageRentCost = Math.round(q * monthlyRent * monthsHeld);

  // Handling into/out of warehouse
  const entryHandling = storage.storageEntryHandlingPerQuintal || 0;
  const handlingAndLaborCost = Math.round(q * entryHandling + q * laborRate);

  // Transport to storage facility (~10km assumed average local hub) and onward future dispatch
  const estimatedFacilityDistanceKm = 10;
  const rawTransport = estimatedFacilityDistanceKm * baseRate * q;
  const transportCost = Math.round(Math.max(minTrip, rawTransport));

  // Warehouse insurance cover
  const insuranceFee = Math.round(q * (storage.insuranceFeePerQuintal || 0));

  // Holding opportunity finance cost: KCC interest (e.g. 4% p.a. standard subvention)
  let holdingOpportunityFinanceCost = 0;
  if (inputs.isKccFinanceEnabled) {
    const annualRate = storage.financingInterestRateAnnualPercent || 4;
    const immediateCashValue = q * inputs.immediateOffer.pricePerQuintal;
    holdingOpportunityFinanceCost = Math.round(
      immediateCashValue * (annualRate / 100) * (holdingDays / 365)
    );
  }

  const commissionAndMandiFees = insuranceFee; // Grouped with statutory/regulatory covers
  const totalCosts =
    storageRentCost +
    handlingAndLaborCost +
    transportCost +
    commissionAndMandiFees +
    holdingOpportunityFinanceCost;

  const netProceeds = grossRevenue - totalCosts;
  const netRealizedPrice = q > 0 ? Math.round((netProceeds / q) * 100) / 100 : 0;
  const netGainVsImmediate = netProceeds - immediateNet;
  const netGainPercentage =
    immediateNet > 0 ? Math.round((netGainVsImmediate / immediateNet) * 1000) / 10 : 0;

  const shelfLifeRemaining = inputs.shelfLifeDays - holdingDays;

  // Feasibility & Risk evaluation
  let feasibility: FeasibilityStatus = 'viable';
  let feasibilityReason = '';
  let spoilageRisk: RiskLevel = 'low';

  if (shelfLifeRemaining < 0) {
    feasibility = 'not_recommended';
    spoilageRisk = 'prohibitive';
    feasibilityReason = `Holding duration (${holdingDays}d) exceeds shelf life (${inputs.shelfLifeDays}d) by ${Math.abs(shelfLifeRemaining)} days. High spoilage danger!`;
  } else if (shelfLifeRemaining < 10 && inputs.cropCategory === 'perishable') {
    feasibility = 'warning';
    spoilageRisk = 'high';
    feasibilityReason = `Very tight shelf life buffer (${shelfLifeRemaining} days remaining). Requires active cold chain.`;
  } else if (netGainVsImmediate <= 0) {
    feasibility = 'not_recommended';
    spoilageRisk = 'moderate';
    feasibilityReason = 'Holding costs and shrinkage outweigh the projected future price increase.';
  } else if (netGainPercentage >= 10) {
    feasibility = 'optimal';
    spoilageRisk = totalSpoilagePercent > 5 ? 'moderate' : 'low';
    feasibilityReason = `Solid price appreciation buffer (+${netGainPercentage}% net gain) after deducting storage & finance.`;
  }

  const costs: ItemizedCosts = {
    transportCost,
    storageRentCost,
    handlingAndLaborCost,
    spoilageLossValue,
    commissionAndMandiFees,
    holdingOpportunityFinanceCost,
    totalCosts,
  };

  return {
    id: 'store_and_sell_later',
    title: 'Store & Sell Later',
    subtitle: `${storage.facilityName} (${holdingDays} Days)`,
    badgeLabel: netGainVsImmediate > 0 ? `+₹${netGainVsImmediate.toLocaleString('en-IN')} Net Gain` : 'Capital Lockup',
    isRecommended: false,
    rank: 3,
    grossRevenue,
    effectiveQuantitySold: Math.round(effectiveQuantity * 100) / 100,
    spoilageQuantityLossKg,
    costs,
    netProceeds,
    netRealizedPricePerQuintal: netRealizedPrice,
    netGainVsImmediate,
    netGainPercentageVsImmediate: netGainPercentage,
    spoilageRisk,
    shelfLifeRemainingAfterActionDays: shelfLifeRemaining,
    feasibility,
    feasibilityReason,
    whyRecommended:
      netGainVsImmediate > 0 && feasibility !== 'not_recommended'
        ? `Holding for ${holdingDays} days yields an estimated net bonus of ₹${netGainVsImmediate.toLocaleString('en-IN')} (+${netGainPercentage}%) over distress selling, even after warehouse rent & ${totalSpoilagePercent.toFixed(1)}% weight loss.`
        : 'Storing is not advised under current assumptions due to holding charges and degradation exceeding future margins.',
    bulletAssumptions: [
      `Storage rate: ₹${monthlyRent}/qtl/month for ${holdingDays} days`,
      `Expected future price: ₹${futurePrice}/qtl (vs ₹${inputs.immediateOffer.pricePerQuintal} now)`,
      `Natural shrinkage/moisture loss: ${totalSpoilagePercent.toFixed(1)}% (${spoilageQuantityLossKg} kg)`,
      inputs.isKccFinanceEnabled
        ? `KCC capital holding cost: 4% p.a. (₹${holdingOpportunityFinanceCost.toLocaleString('en-IN')})`
        : 'Opportunity interest cost excluded from holding baseline',
      `Facility: ${storage.facilityType.replace('_', ' ').toUpperCase()}`,
    ],
    disclaimers: [
      'Projected future prices reflect seasonal trends and are not a guaranteed contract.',
      'Storage space availability must be booked in advance with WDRA/Cold store operator.',
    ],
  };
}

/**
 * Calculates option 3: Alternative Buyer (Direct Processor / Distant APMC)
 */
function calculateAlternativeBuyer(
  inputs: DistressSellingInputs,
  immediateNet: number
): OptionAnalysis | null {
  const alt = inputs.alternativeBuyerOffer;
  if (!alt || alt.pricePerQuintal <= 0) return null;

  const q = inputs.quantityQuintals;
  const price = alt.pricePerQuintal;
  const distanceKm = alt.distanceKm || 0;
  const baseRate = inputs.transportParams.baseFreightRatePerKmPerQuintal || 2;
  const minTrip = inputs.transportParams.minimumTripCharge || 0;
  const laborRate = inputs.transportParams.loadingUnloadingPerQuintal || 0;

  // Transit shrinkage loss
  const transitLossPercent = Math.min(10, Math.max(0, alt.transitLossPercent || 0));
  const effectiveQuantity = q * (1 - transitLossPercent / 100);
  const spoilageLossQuintals = q - effectiveQuantity;
  const spoilageQuantityLossKg = Math.round(spoilageLossQuintals * 100);

  // Quality dockage deduction
  const dockageDeduction = q * (alt.qualityDeductionPerQuintal || 0);

  // Gross Revenue
  const baseGross = effectiveQuantity * price;
  const grossRevenue = Math.max(0, Math.round(baseGross - dockageDeduction));
  const spoilageLossValue = Math.round(spoilageLossQuintals * price);

  // Dedicated long-distance freight
  const rawTransport = distanceKm * baseRate * q;
  const transportCost = Math.round(Math.max(distanceKm > 0 ? minTrip : 0, rawTransport));

  // Commission / platform fee
  const commissionRate = alt.commissionPercent || 0;
  const commissionAndMandiFees = Math.round(grossRevenue * (commissionRate / 100));

  // Handling & loading
  const handlingAndLaborCost = Math.round(q * laborRate);

  const totalCosts = transportCost + commissionAndMandiFees + handlingAndLaborCost;
  const netProceeds = grossRevenue - totalCosts;
  const netRealizedPrice = q > 0 ? Math.round((netProceeds / q) * 100) / 100 : 0;
  const netGainVsImmediate = netProceeds - immediateNet;
  const netGainPercentage =
    immediateNet > 0 ? Math.round((netGainVsImmediate / immediateNet) * 1000) / 10 : 0;

  let feasibility: FeasibilityStatus = 'viable';
  if (alt.minimumBatchQuintals && q < alt.minimumBatchQuintals) {
    feasibility = 'warning';
  } else if (netGainVsImmediate > 0) {
    feasibility = 'optimal';
  }

  const costs: ItemizedCosts = {
    transportCost,
    storageRentCost: 0,
    handlingAndLaborCost,
    spoilageLossValue,
    commissionAndMandiFees,
    holdingOpportunityFinanceCost: 0,
    totalCosts,
  };

  return {
    id: 'alternative_buyer',
    title: 'Sell to Alternative Buyer',
    subtitle: `${alt.buyerName} (${distanceKm} km)`,
    badgeLabel: netGainVsImmediate > 0 ? `+₹${netGainVsImmediate.toLocaleString('en-IN')} Net Gain` : 'Long Haul',
    isRecommended: false,
    rank: 2,
    grossRevenue,
    effectiveQuantitySold: Math.round(effectiveQuantity * 100) / 100,
    spoilageQuantityLossKg,
    costs,
    netProceeds,
    netRealizedPricePerQuintal: netRealizedPrice,
    netGainVsImmediate,
    netGainPercentageVsImmediate: netGainPercentage,
    spoilageRisk: transitLossPercent > 1 ? 'moderate' : 'low',
    shelfLifeRemainingAfterActionDays: Math.max(0, inputs.shelfLifeDays - 2),
    feasibility,
    feasibilityReason:
      netGainVsImmediate > 0
        ? `Premium rate (₹${price}/qtl) offsets extra haulage of ${distanceKm} km.`
        : 'Freight costs negate the buyer price premium over local sale.',
    whyRecommended:
      netGainVsImmediate > 0
        ? `Direct buyer offers a ₹${price - inputs.immediateOffer.pricePerQuintal}/qtl premium. Even with ${distanceKm} km freight of ₹${transportCost.toLocaleString('en-IN')}, you net ₹${netGainVsImmediate.toLocaleString('en-IN')} more than immediate local sale.`
        : 'Freight exceeds buyer premium. Consider local APMC or crop pooling instead.',
    bulletAssumptions: [
      `Offered rate: ₹${price}/qtl (${alt.buyerType.replace(/_/g, ' ')})`,
      `Freight: ${distanceKm} km dedicated transport (₹${transportCost.toLocaleString('en-IN')})`,
      alt.qualityDeductionPerQuintal > 0
        ? `Moisture/quality dockage deduction: ₹${alt.qualityDeductionPerQuintal}/qtl`
        : 'Zero dockage deduction (Grade A spec)',
      `Settlement terms: ${alt.paymentTerms.replace(/_/g, ' ').toUpperCase()}`,
    ],
    disclaimers: [
      'Final payout contingent on standard moisture & foreign matter assay at factory gate.',
      'Buyer requires valid e-Way bill and direct bank transfer credentials.',
    ],
  };
}

/**
 * Calculates option 4: Crop Pooling Opportunity (Shared Bulk Logistics)
 */
function calculateCropPooling(
  inputs: DistressSellingInputs,
  immediateNet: number
): OptionAnalysis | null {
  const pool = inputs.cropPoolingOpportunity;
  if (!pool || pool.pooledContractPricePerQuintal <= 0) return null;

  const q = inputs.quantityQuintals;
  const price = pool.pooledContractPricePerQuintal;
  const distanceKm = pool.distanceKm || 0;
  const baseRate = inputs.transportParams.baseFreightRatePerKmPerQuintal || 2;
  const minTrip = inputs.transportParams.minimumTripCharge || 0;
  const laborRate = inputs.transportParams.loadingUnloadingPerQuintal || 0;

  // Gross Revenue
  const grossRevenue = Math.round(q * price);

  // Consolidated Freight with shared bulk truck discount (e.g. 40% discount)
  const soloFreight = distanceKm * baseRate * q;
  const discountFactor = Math.max(0, 1 - (pool.sharedFreightSavingsPercent || 0) / 100);
  const transportCost = Math.round(
    Math.max(distanceKm > 0 ? minTrip * 0.5 : 0, soloFreight * discountFactor)
  );

  // Pooling coordination fee (e.g. ₹15 / qtl)
  const commissionAndMandiFees = Math.round(q * (pool.poolingCoordinationFeePerQuintal || 0));

  // Shared aggregate handling
  const handlingAndLaborCost = Math.round(q * laborRate * 0.85); // 15% bulk loading efficiency

  const totalCosts = transportCost + commissionAndMandiFees + handlingAndLaborCost;
  const netProceeds = grossRevenue - totalCosts;
  const netRealizedPrice = q > 0 ? Math.round((netProceeds / q) * 100) / 100 : 0;
  const netGainVsImmediate = netProceeds - immediateNet;
  const netGainPercentage =
    immediateNet > 0 ? Math.round((netGainVsImmediate / immediateNet) * 1000) / 10 : 0;

  const costs: ItemizedCosts = {
    transportCost,
    storageRentCost: 0,
    handlingAndLaborCost,
    spoilageLossValue: 0,
    commissionAndMandiFees,
    holdingOpportunityFinanceCost: 0,
    totalCosts,
  };

  const poolFillPercent = Math.min(
    100,
    Math.round(((pool.currentPooledQuintals + q) / pool.targetPoolQuintals) * 100)
  );

  return {
    id: 'crop_pooling',
    title: 'Join Crop Pooling Batch',
    subtitle: `${pool.poolName} (${poolFillPercent}% filled)`,
    badgeLabel: `Shared ${pool.sharedFreightSavingsPercent}% Freight Savings`,
    isRecommended: false,
    rank: 1,
    grossRevenue,
    effectiveQuantitySold: q,
    spoilageQuantityLossKg: 0,
    costs,
    netProceeds,
    netRealizedPricePerQuintal: netRealizedPrice,
    netGainVsImmediate,
    netGainPercentageVsImmediate: netGainPercentage,
    spoilageRisk: 'low',
    shelfLifeRemainingAfterActionDays: Math.max(0, inputs.shelfLifeDays - pool.pickupWindowDays),
    feasibility: 'optimal',
    feasibilityReason: `Consolidating with ${pool.organizer} saves ${pool.sharedFreightSavingsPercent}% on transport and secures bulk institutional rates.`,
    whyRecommended: `By pooling ${q} Quintals into the ${pool.destinationHub} collective load, you unlock bulk institutional pricing (₹${price}/qtl) while slashing freight by ${pool.sharedFreightSavingsPercent}%, netting ₹${netGainVsImmediate.toLocaleString('en-IN')} extra in your pocket.`,
    bulletAssumptions: [
      `FPO bulk contract: ₹${price}/qtl to ${pool.destinationHub}`,
      `Consolidated freight savings: ${pool.sharedFreightSavingsPercent}% off solo truckload`,
      `FPO coordination fee: ₹${pool.poolingCoordinationFeePerQuintal}/qtl`,
      `Batch pickup: within next ${pool.pickupWindowDays} days at village cluster`,
    ],
    disclaimers: [
      'Pooling dispatch requires minimum batch aggregate fulfillment before lorry leaves.',
      'Collective payout disbursed via FPO Escrow account within 48 hours of delivery.',
    ],
  };
}

/**
 * Calculates the exact future price per quintal required for storage (Option 2)
 * to break even with the immediate sale net proceeds (Option 1).
 */
export function calculateStorageBreakEvenPrice(
  inputs: DistressSellingInputs,
  immediateNet: number
): number {
  const q = inputs.quantityQuintals;
  if (q <= 0) return inputs.immediateOffer.pricePerQuintal;

  const storage = inputs.storageOptions;
  const holdingDays = Math.max(0, storage.plannedHoldingDays || 0);
  const monthlyRent = storage.monthlyRentPerQuintal || 0;
  const monthlySpoilagePercent = storage.spoilageRatePercentPerMonth || 0;
  const laborRate = inputs.transportParams.loadingUnloadingPerQuintal || 0;
  const baseRate = inputs.transportParams.baseFreightRatePerKmPerQuintal || 2;
  const minTrip = inputs.transportParams.minimumTripCharge || 0;

  const totalSpoilagePercent = Math.min(99.9, (monthlySpoilagePercent * holdingDays) / 30);
  const effectiveQuantity = q * (1 - totalSpoilagePercent / 100);

  if (effectiveQuantity <= 0) return 999999;

  const monthsHeld = holdingDays / 30;
  const storageRentCost = q * monthlyRent * monthsHeld;
  const entryHandling = storage.storageEntryHandlingPerQuintal || 0;
  const handlingAndLaborCost = q * entryHandling + q * laborRate;
  const transportCost = Math.max(minTrip, 10 * baseRate * q);
  const insuranceFee = q * (storage.insuranceFeePerQuintal || 0);

  let holdingFinanceCost = 0;
  if (inputs.isKccFinanceEnabled) {
    const annualRate = storage.financingInterestRateAnnualPercent || 4;
    const immediateCashValue = q * inputs.immediateOffer.pricePerQuintal;
    holdingFinanceCost = immediateCashValue * (annualRate / 100) * (holdingDays / 365);
  }

  const totalStorageCosts =
    storageRentCost + handlingAndLaborCost + transportCost + insuranceFee + holdingFinanceCost;

  // Break-even formula:
  // (P_breakeven * effectiveQuantity) - totalStorageCosts = immediateNet
  // P_breakeven = (immediateNet + totalStorageCosts) / effectiveQuantity
  const breakEvenPrice = Math.round((immediateNet + totalStorageCosts) / effectiveQuantity);
  return Math.max(breakEvenPrice, 0);
}

/**
 * Main Pure Engine Entry Point:
 * Executes the complete comparison analysis across all harvest pathways.
 */
export function calculateDistressSellingOptions(
  inputs: DistressSellingInputs
): DecisionEngineResult {
  const validation = validateDistressSellingInputs(inputs);

  // Fallback safe values if validation fails on critical fields
  const safeInputs: DistressSellingInputs = {
    ...inputs,
    quantityQuintals: Math.max(0.1, inputs.quantityQuintals || 1),
    shelfLifeDays: Math.max(1, inputs.shelfLifeDays || 1),
    immediateOffer: {
      ...inputs.immediateOffer,
      pricePerQuintal: Math.max(1, inputs.immediateOffer?.pricePerQuintal || 1000),
    },
  };

  // 1. Calculate Immediate Sale
  const immediateOption = calculateImmediateSale(safeInputs);
  const immediateNet = immediateOption.netProceeds;

  // 2. Calculate Store & Sell Later
  const storageOption = calculateStorageAndLaterSale(safeInputs, immediateNet);

  // 3. Calculate Alternative Buyer
  const altBuyerOption = calculateAlternativeBuyer(safeInputs, immediateNet);

  // 4. Calculate Crop Pooling
  const poolingOption = calculateCropPooling(safeInputs, immediateNet);

  // Collect available options
  const rawList: OptionAnalysis[] = [
    immediateOption,
    storageOption,
    altBuyerOption,
    poolingOption,
  ].filter((opt): opt is OptionAnalysis => opt !== null);

  // Rank options by Net Proceeds, respecting feasibility penalties
  // Options that are 'not_recommended' (e.g. spoiled before sale) get severely penalized in ranking
  const sorted = [...rawList].sort((a, b) => {
    const aPenalty = a.feasibility === 'not_recommended' ? -10000000 : 0;
    const bPenalty = b.feasibility === 'not_recommended' ? -10000000 : 0;
    return b.netProceeds + bPenalty - (a.netProceeds + aPenalty);
  });

  // Assign 1-indexed ranks and mark recommended
  const rankedOptions = sorted.map((opt, idx) => ({
    ...opt,
    rank: idx + 1,
    isRecommended: idx === 0,
  }));

  const recommendedOption = rankedOptions[0] || immediateOption;

  const breakEvenFuturePriceForStorage = calculateStorageBreakEvenPrice(
    safeInputs,
    immediateNet
  );

  const holdingDays = safeInputs.storageOptions.plannedHoldingDays || 0;
  const isShelfLifeExceeded = holdingDays > safeInputs.shelfLifeDays;
  const excessDays = Math.max(0, holdingDays - safeInputs.shelfLifeDays);
  const priceSpreadRequired = Math.max(
    0,
    breakEvenFuturePriceForStorage - safeInputs.immediateOffer.pricePerQuintal
  );

  const optionsMap: Record<OptionId, OptionAnalysis | null> = {
    sell_immediately:
      rankedOptions.find((o) => o.id === 'sell_immediately') || immediateOption,
    store_and_sell_later:
      rankedOptions.find((o) => o.id === 'store_and_sell_later') || storageOption,
    alternative_buyer:
      rankedOptions.find((o) => o.id === 'alternative_buyer') || altBuyerOption,
    crop_pooling:
      rankedOptions.find((o) => o.id === 'crop_pooling') || poolingOption,
  };

  const maximumNetProceeds = recommendedOption.netProceeds;
  const maxNetGainVsDistress = Math.max(0, maximumNetProceeds - immediateNet);

  return {
    inputs: safeInputs,
    options: optionsMap,
    rankedOptions,
    recommendedOption,
    breakEvenFuturePriceForStorage,
    immediateNetProceeds: immediateNet,
    maximumNetProceeds,
    maxNetGainVsDistress,
    storageFeasibility: {
      isShelfLifeExceeded,
      excessDays,
      priceSpreadRequiredPerQuintal: priceSpreadRequired,
    },
    validation,
    calculatedAt: new Date().toISOString(),
  };
}
