/**
 * Smart Farm Care Feature Module
 * Handles crop health scanning, disease diagnostics, pest detection, and soil monitoring.
 */

export interface CropDiagnosticReport {
  id: string;
  cropName: string;
  detectedCondition: string;
  confidenceScore: number;
  treatmentRecommendation: string;
  severity: 'low' | 'moderate' | 'severe';
  imageUrl?: string;
  createdAt: string;
}

export const FEATURE_INFO = {
  name: 'Smart Farm Care',
  version: '1.0.0',
  description: 'AI-assisted crop disease diagnosis and soil sensor analytics for Android devices',
};
