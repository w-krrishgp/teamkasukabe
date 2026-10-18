export interface LocationOption {
  id: string;
  name: string;
  taluka: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  isCurrent?: boolean;
}

export type SprayWindowStatus = 'optimal' | 'caution' | 'unsuitable';

export interface HourlyWeatherItem {
  time: string;
  hour: number;
  temperatureC: number;
  humidityPercent: number;
  precipitationProbability: number;
  windSpeedKmh: number;
  weatherCode: number;
  weatherDescription: string;
  spraySuitability: SprayWindowStatus;
  sprayReason: string;
}

export interface DailyWeatherItem {
  date: string;
  dayName: string;
  maxTempC: number;
  minTempC: number;
  precipitationProbability: number;
  weatherCode: number;
  weatherDescription: string;
  agriculturalGuidance: string;
  spraySuitable: boolean;
}

export interface AgriGuidanceItem {
  id: string;
  category: 'spray' | 'irrigation' | 'fertilizer' | 'harvest' | 'pest_risk';
  severity: 'optimal' | 'warning' | 'alert';
  title: string;
  description: string;
  recommendedAction: string;
  timeWindow: string;
  confidence: number;
  sourceBadge: string;
}

export interface WeatherReport {
  currentTempC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  precipitationMm: number;
  precipitationProbability: number;
  weatherDescription: string;
  weatherCode: number;
  hourly: HourlyWeatherItem[];
  daily: DailyWeatherItem[];
  guidance: AgriGuidanceItem[];
  location: LocationOption;
  dataSource: 'live_open_meteo' | 'benchmark_sample';
  lastUpdated: string;
}

export type DiseaseSeverity = 'critical' | 'high' | 'moderate' | 'watch';
export type OutbreakSpreadStatus = 'active' | 'spreading' | 'contained' | 'surveillance';

export interface DiseaseOutbreakReport {
  id: string;
  crop: string;
  diseaseName: string;
  scientificName: string;
  severity: DiseaseSeverity;
  spreadStatus: OutbreakSpreadStatus;
  distanceKm: number;
  village: string;
  taluka: string;
  district: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  reportedDate: string;
  affectedAcres: number;
  reportedCasesCount: number;
  sourceBadge: string; // e.g. 'ICAR-KVK Mehsana Field Surveillance'
  symptoms: string[];
  preventiveProtocol: string;
  chemicalDosage: string;
  organicRemedy: string;
}

export interface DiseaseCluster {
  id: string;
  clusterName: string;
  district: string;
  centerCoordinates: {
    latitude: number;
    longitude: number;
  };
  radiusKm: number;
  caseCount: number;
  primaryCrop: string;
  primaryDisease: string;
  riskLevel: 'high' | 'medium' | 'surveillance';
  trend: 'expanding' | 'stable' | 'declining';
  proximityToUserKm: number;
}

export interface OutbreakSightingInput {
  crop: string;
  diseaseName: string;
  severity: DiseaseSeverity;
  village: string;
  taluka: string;
  symptoms: string;
  photoUrl?: string;
  affectedAcres: number;
}

export interface ColdStorageFacility {
  id: string;
  name: string;
  location: string;
  taluka: string;
  district: string;
  distanceKm: number;
  totalCapacityMT: number;
  availableCapacityMT: number;
  occupancyPercent: number;
  temperatureRange: string;
  humidityRange: string;
  supportedCommodities: string[];
  tariffPerQtlPerMonth: number;
  rating: number;
  contactPhone: string;
  powerBackup: boolean;
  solarPowered: boolean;
  wdraRegistered: boolean;
  subsidyEligible: boolean;
  sourceBadge: string;
}

export interface ColdStorageBookingRequest {
  id: string;
  tokenNumber: string;
  facilityId: string;
  facilityName: string;
  facilityLocation: string;
  farmerName: string;
  contactPhone: string;
  commodity: string;
  quantityQuintals: number;
  durationMonths: number;
  inboundDate: string;
  transportNeeded: boolean;
  estimatedDeposit: number;
  status: 'confirmed' | 'pending_inspection' | 'waitlist';
  createdAt: string;
}

export interface RiskWorkflow {
  id: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  deliverableNumber: 1 | 2 | 3;
  icon: string;
  badge: string;
  steps: {
    stepNumber: number;
    title: string;
    titleHi: string;
    description: string;
    descriptionHi: string;
    status: 'pending' | 'in_progress' | 'completed';
    actionLabel: string;
    actionLabelHi: string;
    actionRoute: string;
  }[];
}
