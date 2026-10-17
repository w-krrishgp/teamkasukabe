/**
 * Farmer Profile Feature Module
 * Manages land ownership records, multilingual settings, offline sync queue, and KYC verification.
 */

export interface LandHoldingRecord {
  surveyNumber: string;
  subDivision: string;
  areaAcres: number;
  soilType: 'Alluvial' | 'Black Cotton' | 'Sandy Loam' | 'Red Soil';
  irrigationSource: 'Borewell' | 'Canal' | 'Rainfed';
}

export const FEATURE_INFO = {
  name: 'Farmer Profile & Holdings',
  version: '1.0.0',
  description: 'Digital land records, Aadhaar KYC verification, and local language preferences',
};
