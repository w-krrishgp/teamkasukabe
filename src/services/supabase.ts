import { createClient } from '@supabase/supabase-js';
import { env, isConfigured } from '@/config/env';

/**
 * Supabase client instance.
 * Uses environment credentials with fallback handling.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseLive = isConfigured.supabase;

/**
 * Mock Seed Data for hackathon demo fallback and offline development
 */
export const MOCK_FARMER_PROFILE = {
  id: 'farmer-001',
  fullName: 'Ramesh Patel',
  phone: '+91 98765 43210',
  village: 'Kheda Kalan',
  district: 'Mehsana',
  state: 'Gujarat',
  totalLandAcres: 5.5,
  primaryCrops: ['Wheat (Sharbati)', 'Mustard', 'Cotton'],
  kisanId: 'PMK-GJ-884920',
  preferredLanguage: 'en' as const,
  isKycVerified: true,
  offlineSyncPending: 0,
};

export const MOCK_CROPS = [
  {
    id: 'crop-1',
    name: 'Wheat (Sharbati)',
    variety: 'HD-2967',
    fieldAreaAcres: 3.2,
    sowingDate: '2026-11-15',
    expectedHarvestDate: '2027-03-25',
    status: 'optimal' as const,
    moisturePercent: 68,
    healthScore: 92,
  },
  {
    id: 'crop-2',
    name: 'Mustard',
    variety: 'Pusa Bold',
    fieldAreaAcres: 1.5,
    sowingDate: '2026-10-20',
    expectedHarvestDate: '2027-02-10',
    status: 'attention' as const,
    moisturePercent: 54,
    healthScore: 78,
  },
  {
    id: 'crop-3',
    name: 'Cotton',
    variety: 'Bt Cotton II',
    fieldAreaAcres: 0.8,
    sowingDate: '2026-06-12',
    expectedHarvestDate: '2026-11-30',
    status: 'harvest-ready' as const,
    moisturePercent: 42,
    healthScore: 88,
  },
];

export const MOCK_WEATHER = {
  temperatureC: 28,
  condition: 'Partly Sunny & Favorable',
  humidityPercent: 58,
  rainfallMm: 0,
  windSpeedKmh: 12,
  forecastNotice: 'Light shower anticipated in 48 hours. Postpone foliar spraying.',
  location: 'Mehsana Rural, Gujarat',
};

export const MOCK_MANDI_RATES = [
  {
    id: 'mandi-1',
    cropName: 'Wheat (Sharbati)',
    marketName: 'Unjha Mandi',
    state: 'Gujarat',
    minPrice: 2450,
    maxPrice: 2820,
    modalPrice: 2680,
    unit: '₹ / Quintal',
    priceTrend: 'up' as const,
    updatedAt: 'Today, 09:30 AM',
  },
  {
    id: 'mandi-2',
    cropName: 'Mustard Seed',
    marketName: 'Patan APMC',
    state: 'Gujarat',
    minPrice: 5100,
    maxPrice: 5650,
    modalPrice: 5420,
    unit: '₹ / Quintal',
    priceTrend: 'up' as const,
    updatedAt: 'Today, 10:15 AM',
  },
  {
    id: 'mandi-3',
    cropName: 'Cotton (Medium Staple)',
    marketName: 'Kadi Mandi',
    state: 'Gujarat',
    minPrice: 6900,
    maxPrice: 7400,
    modalPrice: 7250,
    unit: '₹ / Quintal',
    priceTrend: 'stable' as const,
    updatedAt: 'Today, 11:00 AM',
  },
];

export const MOCK_SCHEMES = [
  {
    id: 'sch-1',
    name: 'PM-KISAN Samman Nidhi',
    category: 'direct_benefit' as const,
    benefitAmount: '₹ 6,000 / year (3 Installments)',
    deadline: 'Continuous',
    status: 'approved' as const,
    description: 'Direct income support for all landholding farmer families across India.',
    eligibilityNotes: 'Aadhaar linked bank account active. 16th installment deposited.',
  },
  {
    id: 'sch-2',
    name: 'Kisan Credit Card (KCC) Subvention',
    category: 'credit' as const,
    benefitAmount: 'Up to ₹ 3,00,000 at 4% effective interest',
    deadline: 'Rolling Renewal',
    status: 'approved' as const,
    description: 'Concessional institutional credit for crop cultivation and post-harvest maintenance.',
    eligibilityNotes: 'Limit sanctioned: ₹ 2,50,000. Next renewal in March 2027.',
  },
  {
    id: 'sch-3',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'insurance' as const,
    benefitAmount: 'Full harvest sum insured: ₹ 1,45,000',
    deadline: '15 Dec 2026',
    status: 'eligible' as const,
    description: 'Comprehensive risk insurance coverage against natural non-preventable risks.',
    eligibilityNotes: 'Rabi season premium subsidy eligible. 1.5% farmer contribution.',
  },
];
