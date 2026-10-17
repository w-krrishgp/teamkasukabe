/**
 * Farm Intelligence Feature Module
 * Handles meteorological forecasting, NDVI satellite imagery, irrigation scheduling, and AI advisory.
 */

export interface WeatherForecastDay {
  day: string;
  date: string;
  tempMaxC: number;
  tempMinC: number;
  rainProbabilityPercent: number;
  condition: string;
  icon: string;
}

export const FEATURE_INFO = {
  name: 'Farm Intelligence',
  version: '1.0.0',
  description: 'Hyperlocal weather forecasting, satellite vegetation tracking, and automated agronomist advice',
};
