export type CropHealthStatus = 'optimal' | 'attention' | 'critical' | 'harvest-ready';

export interface Crop {
  id: string;
  name: string;
  variety: string;
  fieldAreaAcres: number;
  sowingDate: string;
  expectedHarvestDate: string;
  status: CropHealthStatus;
  moisturePercent: number;
  healthScore: number; // 0-100
  imagePlaceholder?: string;
}

export interface FarmAdvisory {
  id: string;
  title: string;
  category: 'irrigation' | 'pest' | 'fertilizer' | 'weather';
  urgency: 'high' | 'medium' | 'low';
  message: string;
  recommendedAction: string;
  issuedAt: string;
}

export interface WeatherSummary {
  temperatureC: number;
  condition: string;
  humidityPercent: number;
  rainfallMm: number;
  windSpeedKmh: number;
  forecastNotice: string;
  location: string;
}
