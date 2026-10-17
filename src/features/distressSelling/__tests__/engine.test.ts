import { describe, it, expect } from 'vitest';
import {
  calculateDistressSellingOptions,
  validateDistressSellingInputs,
  calculateStorageBreakEvenPrice,
} from '../engine';
import type { DistressSellingInputs } from '../types';

const mockWheatInput: DistressSellingInputs = {
  cropName: 'Wheat (Sharbati HD-2967)',
  cropCategory: 'cereal_grain',
  quantityQuintals: 100,
  harvestDate: '2026-03-20',
  shelfLifeDays: 365,
  location: {
    village: 'Kheda Kalan',
    district: 'Mehsana',
    state: 'Gujarat',
  },
  immediateOffer: {
    buyerName: 'Unjha Local Trader',
    buyerType: 'local_apmc_trader',
    pricePerQuintal: 2450,
    paymentTerms: 'immediate_cash',
    distanceKm: 8,
    mandiCommissionPercent: 1.5,
    handlingCostPerQuintal: 15,
  },
  transportParams: {
    baseFreightRatePerKmPerQuintal: 2.2,
    minimumTripCharge: 500,
    loadingUnloadingPerQuintal: 20,
  },
  storageOptions: {
    facilityName: 'Mehsana WDRA Central Warehouse',
    facilityType: 'wdra_warehouse',
    monthlyRentPerQuintal: 35,
    plannedHoldingDays: 90,
    expectedFuturePricePerQuintal: 2850,
    storageEntryHandlingPerQuintal: 25,
    spoilageRatePercentPerMonth: 0.4, // 1.2% over 3 months
    insuranceFeePerQuintal: 5,
    financingInterestRateAnnualPercent: 4,
    isSubsidizedWarehousing: true,
  },
  alternativeBuyerOffer: {
    buyerName: 'Shree Ram Roller Flour Mills',
    buyerType: 'flour_oil_mill',
    pricePerQuintal: 2650,
    distanceKm: 45,
    paymentTerms: 'direct_bank_transfer_24h',
    qualityDeductionPerQuintal: 0,
    transitLossPercent: 0.2,
    commissionPercent: 0,
    minimumBatchQuintals: 50,
  },
  cropPoolingOpportunity: {
    poolId: 'pool-wheat-01',
    poolName: 'Mehsana FPO Bulk Export Cluster',
    organizer: 'Mehsana Kisan Producer FPO',
    currentPooledQuintals: 280,
    targetPoolQuintals: 400,
    destinationHub: 'Kandla Port Terminal',
    distanceKm: 180,
    pooledContractPricePerQuintal: 2780,
    sharedFreightSavingsPercent: 42,
    poolingCoordinationFeePerQuintal: 15,
    pickupWindowDays: 4,
    status: 'filling',
  },
  isKccFinanceEnabled: true,
};

describe('No Distress Selling Engine — Pure TS Function', () => {
  it('correctly calculates immediate sale net proceeds', () => {
    const result = calculateDistressSellingOptions(mockWheatInput);
    const immediate = result.options.sell_immediately;

    expect(immediate).not.toBeNull();
    // Gross = 100 * 2450 = 245000
    expect(immediate!.grossRevenue).toBe(245000);
    // Mandi commission = 1.5% of 245000 = 3675
    expect(immediate!.costs.commissionAndMandiFees).toBe(3675);
    // Handling = 100 * (15 + 20) = 3500
    expect(immediate!.costs.handlingAndLaborCost).toBe(3500);
    // Transport = max(500, 8 * 2.2 * 100) = max(500, 1760) = 1760
    expect(immediate!.costs.transportCost).toBe(1760);
    // Total costs = 3675 + 3500 + 1760 = 8935
    expect(immediate!.costs.totalCosts).toBe(8935);
    // Net proceeds = 245000 - 8935 = 236065
    expect(immediate!.netProceeds).toBe(236065);
    expect(immediate!.netRealizedPricePerQuintal).toBe(2360.65);
  });

  it('calculates storage and sell later with shrink, rent, and KCC finance cost', () => {
    const result = calculateDistressSellingOptions(mockWheatInput);
    const storage = result.options.store_and_sell_later;

    expect(storage).not.toBeNull();
    // 90 days = 3 months. Monthly shrink = 0.4%, so total shrink = 1.2%
    // Effective quantity = 100 * (1 - 0.012) = 98.8 quintals
    expect(storage!.effectiveQuantitySold).toBe(98.8);
    expect(storage!.spoilageQuantityLossKg).toBe(120);

    // Gross = 98.8 * 2850 = 281580
    expect(storage!.grossRevenue).toBe(281580);

    // Storage rent = 100 * 35 * 3 = 10500
    expect(storage!.costs.storageRentCost).toBe(10500);

    // Storage net should significantly exceed immediate sale
    expect(storage!.netProceeds).toBeGreaterThan(result.immediateNetProceeds);
    expect(storage!.netGainVsImmediate).toBeGreaterThan(0);
    expect(storage!.feasibility).toBe('optimal');
  });

  it('correctly calculates the mathematical break-even future price for storage', () => {
    const immediateNet = 236065;
    const breakEven = calculateStorageBreakEvenPrice(mockWheatInput, immediateNet);

    // Test that when expectedFuturePrice = breakEven, storage net proceeds closely match immediateNet
    const breakEvenInput: DistressSellingInputs = {
      ...mockWheatInput,
      storageOptions: {
        ...mockWheatInput.storageOptions,
        expectedFuturePricePerQuintal: breakEven,
      },
    };

    const result = calculateDistressSellingOptions(breakEvenInput);
    const storage = result.options.store_and_sell_later;

    // Difference between storage and immediate should be within negligible rounding margin (<= ₹100 on ₹2.4 Lakhs)
    const difference = Math.abs(storage!.netProceeds - immediateNet);
    expect(difference).toBeLessThanOrEqual(100);
  });

  it('disqualifies storage and raises prohibitive risk when holding days exceed shelf life', () => {
    const perishableTomatoInput: DistressSellingInputs = {
      ...mockWheatInput,
      cropName: 'Tomato (Himsona)',
      cropCategory: 'perishable',
      shelfLifeDays: 14, // 14 days shelf life
      storageOptions: {
        ...mockWheatInput.storageOptions,
        plannedHoldingDays: 45, // Trying to store for 45 days!
        expectedFuturePricePerQuintal: 4000,
      },
    };

    const result = calculateDistressSellingOptions(perishableTomatoInput);
    const storage = result.options.store_and_sell_later;

    expect(storage!.feasibility).toBe('not_recommended');
    expect(storage!.spoilageRisk).toBe('prohibitive');
    // Ensure that despite high theoretical future price, storage is NOT recommended
    expect(result.recommendedOption.id).not.toBe('store_and_sell_later');
    expect(result.storageFeasibility.isShelfLifeExceeded).toBe(true);
    expect(result.storageFeasibility.excessDays).toBe(31);
  });

  it('evaluates alternative buyer with long haul freight and transit loss', () => {
    const result = calculateDistressSellingOptions(mockWheatInput);
    const alt = result.options.alternative_buyer;

    expect(alt).not.toBeNull();
    // Transit loss 0.2% -> 99.8 quintals
    expect(alt!.effectiveQuantitySold).toBe(99.8);
    // Transport 45km * 2.2 * 100 = 9900
    expect(alt!.costs.transportCost).toBe(9900);
    // Net proceeds should be calculated cleanly
    expect(alt!.netProceeds).toBeGreaterThan(0);
  });

  it('evaluates crop pooling with shared freight discount', () => {
    const result = calculateDistressSellingOptions(mockWheatInput);
    const pool = result.options.crop_pooling;

    expect(pool).not.toBeNull();
    // 42% freight discount verified
    expect(pool!.badgeLabel).toContain('42%');
    // Net proceeds should be optimal or viable
    expect(pool!.feasibility).toBe('optimal');
    expect(pool!.netGainVsImmediate).toBeGreaterThan(0);
  });

  it('validates invalid inputs robustly without crashing', () => {
    const invalidInput: DistressSellingInputs = {
      ...mockWheatInput,
      cropName: '',
      quantityQuintals: -10,
      shelfLifeDays: 0,
      immediateOffer: {
        ...mockWheatInput.immediateOffer,
        pricePerQuintal: 0,
      },
    };

    const validation = validateDistressSellingInputs(invalidInput);
    expect(validation.isValid).toBe(false);
    expect(validation.errors.length).toBeGreaterThanOrEqual(3);

    // Engine must still compute safely with fallback boundaries without throwing
    expect(() => calculateDistressSellingOptions(invalidInput)).not.toThrow();
  });
});
