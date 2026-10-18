import type {
  ColdStorageFacility,
  ColdStorageBookingRequest,
} from '@/types/intelligence';

const STORAGE_KEY_BOOKINGS = 'harvestguard_cold_storage_bookings';

export const COLD_STORAGE_FACILITIES: ColdStorageFacility[] = [
  {
    id: 'cs-fac-01',
    name: 'Kadi Kisan Agro Cold Chain & CA Vault',
    location: 'SH-41, Kadi Bypass, Mehsana',
    taluka: 'Kadi',
    district: 'Mehsana',
    distanceKm: 4.5,
    totalCapacityMT: 5000,
    availableCapacityMT: 1150,
    occupancyPercent: 77,
    temperatureRange: '2°C to 4°C (Multi-Chamber)',
    humidityRange: '85% - 90% RH (Controlled Atmosphere)',
    supportedCommodities: ['Potato', 'Mustard', 'Cumin / Jeera', 'Fennel / Saunf'],
    tariffPerQtlPerMonth: 42,
    rating: 4.8,
    contactPhone: '+91 98250 11234',
    powerBackup: true,
    solarPowered: true,
    wdraRegistered: true,
    subsidyEligible: true,
    sourceBadge: 'WDRA Registered Warehouse & APMC Kadi Partner',
  },
  {
    id: 'cs-fac-02',
    name: 'Mehsana District Multi-Commodity Cold Vault',
    location: 'Near APMC Market Yard, Mehsana Town',
    taluka: 'Mehsana Sadar',
    district: 'Mehsana',
    distanceKm: 12.0,
    totalCapacityMT: 8000,
    availableCapacityMT: 2400,
    occupancyPercent: 70,
    temperatureRange: '0°C to 10°C (Dual-Zone)',
    humidityRange: '75% - 90% RH',
    supportedCommodities: ['Potato', 'Onion', 'Garlic', 'Castor Seed', 'Wheat Grain'],
    tariffPerQtlPerMonth: 38,
    rating: 4.6,
    contactPhone: '+91 94270 54321',
    powerBackup: true,
    solarPowered: false,
    wdraRegistered: true,
    subsidyEligible: true,
    sourceBadge: 'State Warehousing Corporation (GSWC) Certified',
  },
  {
    id: 'cs-fac-03',
    name: 'Deesa Golden Tuber Cold Storage Ltd.',
    location: 'Highway Corridor, Deesa',
    taluka: 'Deesa',
    district: 'Banaskantha',
    distanceKm: 32.5,
    totalCapacityMT: 12000,
    availableCapacityMT: 1800,
    occupancyPercent: 85,
    temperatureRange: '2°C to 4°C (CIPC Anti-Sprout Enabled)',
    humidityRange: '92% RH High Moisture',
    supportedCommodities: ['Potato (Processing & Table)', 'Carrot'],
    tariffPerQtlPerMonth: 45,
    rating: 4.9,
    contactPhone: '+91 97129 88776',
    powerBackup: true,
    solarPowered: true,
    wdraRegistered: true,
    subsidyEligible: true,
    sourceBadge: 'National Horticulture Board (NHB) Recognized',
  },
  {
    id: 'cs-fac-04',
    name: 'Sabarmati Agri-Logistics Fresh Hub',
    location: 'Kalol GIDC Industrial Area',
    taluka: 'Kalol',
    district: 'Gandhinagar',
    distanceKm: 21.0,
    totalCapacityMT: 4500,
    availableCapacityMT: 1650,
    occupancyPercent: 63,
    temperatureRange: '-2°C to 15°C (Refrigerated & Frozen)',
    humidityRange: '65% - 85% RH',
    supportedCommodities: ['Vegetables', 'Fruits', 'Ginger', 'Turmeric', 'Onion'],
    tariffPerQtlPerMonth: 50,
    rating: 4.7,
    contactPhone: '+91 98980 33445',
    powerBackup: true,
    solarPowered: true,
    wdraRegistered: true,
    subsidyEligible: true,
    sourceBadge: 'MoFPI Pradhan Mantri Kisan SAMPADA Yojana Hub',
  },
  {
    id: 'cs-fac-05',
    name: 'Unjha Spice Vault & Controlled Storage',
    location: 'Mandi Road, Unjha',
    taluka: 'Unjha',
    district: 'Mehsana',
    distanceKm: 26.0,
    totalCapacityMT: 6000,
    availableCapacityMT: 950,
    occupancyPercent: 84,
    temperatureRange: '10°C to 15°C (Dehumidified Cold Store)',
    humidityRange: '55% - 60% RH Low-Moisture',
    supportedCommodities: ['Cumin / Jeera', 'Fennel / Saunf', 'Coriander / Dhaniya', 'Mustard'],
    tariffPerQtlPerMonth: 48,
    rating: 4.8,
    contactPhone: '+91 99241 66554',
    powerBackup: true,
    solarPowered: false,
    wdraRegistered: true,
    subsidyEligible: false,
    sourceBadge: 'Unjha APMC Mandi Regulated Cold Store',
  },
];

const INITIAL_MOCK_BOOKINGS: ColdStorageBookingRequest[] = [
  {
    id: 'cs-bk-001',
    tokenNumber: 'HG-CS-2026-8941',
    facilityId: 'cs-fac-01',
    facilityName: 'Kadi Kisan Agro Cold Chain & CA Vault',
    facilityLocation: 'SH-41, Kadi Bypass, Mehsana',
    farmerName: 'Ramesh Patel',
    contactPhone: '+91 98765 43210',
    commodity: 'Potato (Kufri Pukhraj)',
    quantityQuintals: 40,
    durationMonths: 3,
    inboundDate: '2026-10-25',
    transportNeeded: true,
    estimatedDeposit: 5040,
    status: 'confirmed',
    createdAt: '2026-10-16 11:20 AM',
  },
];

export function getColdStorageFacilities(filters?: {
  commodity?: string;
  maxDistanceKm?: number;
}): ColdStorageFacility[] {
  let list = [...COLD_STORAGE_FACILITIES];

  if (filters?.commodity && filters.commodity !== 'All') {
    list = list.filter((f) =>
      f.supportedCommodities.some((c) =>
        c.toLowerCase().includes(filters.commodity!.toLowerCase())
      )
    );
  }

  if (filters?.maxDistanceKm) {
    list = list.filter((f) => f.distanceKm <= filters.maxDistanceKm!);
  }

  return list;
}

export function getUserColdStorageBookings(): ColdStorageBookingRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(INITIAL_MOCK_BOOKINGS));
      return INITIAL_MOCK_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_BOOKINGS;
  }
}

export function createColdStorageBooking(input: {
  facilityId: string;
  farmerName: string;
  contactPhone: string;
  commodity: string;
  quantityQuintals: number;
  durationMonths: number;
  inboundDate: string;
  transportNeeded: boolean;
}): ColdStorageBookingRequest {
  const facility = COLD_STORAGE_FACILITIES.find((f) => f.id === input.facilityId) || COLD_STORAGE_FACILITIES[0];

  const monthlyRate = facility.tariffPerQtlPerMonth;
  const estimatedDeposit = Math.round(input.quantityQuintals * monthlyRate * input.durationMonths);

  const tokenRandom = Math.floor(1000 + Math.random() * 9000);
  const tokenNumber = `HG-CS-2026-${tokenRandom}`;

  const newBooking: ColdStorageBookingRequest = {
    id: `cs-bk-${Date.now()}`,
    tokenNumber,
    facilityId: facility.id,
    facilityName: facility.name,
    facilityLocation: facility.location,
    farmerName: input.farmerName || 'Ramesh Patel',
    contactPhone: input.contactPhone || '+91 98765 43210',
    commodity: input.commodity,
    quantityQuintals: Number(input.quantityQuintals),
    durationMonths: Number(input.durationMonths),
    inboundDate: input.inboundDate,
    transportNeeded: input.transportNeeded,
    estimatedDeposit,
    status: 'confirmed',
    createdAt: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  const existing = getUserColdStorageBookings();
  const updated = [newBooking, ...existing];

  try {
    localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to store cold storage booking', err);
  }

  return newBooking;
}
