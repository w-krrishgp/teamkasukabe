/**
 * Crop Doctor & Plant Disease Inference Engine Types
 * Defines interfaces for computer vision models, diagnostic results,
 * validation, and safe agronomic advisory.
 */

export type ImageValidationErrorCode =
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'INVALID_FORMAT'
  | 'EMPTY_FILE'
  | 'CORRUPTED_IMAGE';

export interface ImageValidationResult {
  isValid: boolean;
  errorCode?: ImageValidationErrorCode;
  errorMessage?: string;
  errorMessageHi?: string;
  fileDetails?: {
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
    mimeType: string;
  };
}

export type InferenceMode =
  | 'live_ai'          // Real Vision API / ML Model successfully inferred
  | 'demo_reference'  // Offline verified reference pathology database (Clearly labelled)
  | 'service_error';  // Inference service failure / network timeout / quota

export type DiseaseSeverity = 'None' | 'Mild' | 'Moderate' | 'Critical';

export interface ChemicalPrescription {
  name: string;
  activeIngredient: string;
  dosage: string;
  preHarvestIntervalDays: number;
  safetyCaution: string;
}

export interface CautiousAgronomicGuidance {
  organicRemedies: string[];
  chemicalRemedies: ChemicalPrescription[];
  sprayWindow: string;
  fieldSafetyPPE: string[];
  agronomistConsultNotice: string;
}

export interface CropDiseaseDiagnostic {
  isModelConnected: boolean;
  inferenceMode: InferenceMode;
  modelDetails: {
    provider: 'Gemini Multimodal Vision API' | 'Gemini 1.5 Flash Vision' | 'Offline Agronomic Reference DB' | 'Custom PyTorch Model' | 'Simulated Error';
    modelIdentifier?: string;
    latencyMs?: number;
    apiConfigured: boolean;
  };
  crop: {
    nameEn: string;
    nameHi: string;
    scientificName?: string;
  };
  condition: {
    nameEn: string;
    nameHi: string;
    pathogenType: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest Infestation' | 'Nutritional Deficiency' | 'Healthy Crop';
    scientificName?: string;
    isHealthy: boolean;
  };
  severity: DiseaseSeverity;
  /**
   * Confidence is ONLY populated if genuinely produced by an inference engine.
   * If running in demo/reference mode, confidenceGenuine is false.
   */
  confidence?: number;
  confidenceGenuine: boolean;
  confidenceNote?: string;
  symptoms: Array<{
    titleEn: string;
    titleHi: string;
    descriptionEn: string;
    descriptionHi: string;
  }>;
  guidance: CautiousAgronomicGuidance;
  disclaimerEn: string;
  disclaimerHi: string;
  analyzedAt: string;
}

export interface DiseaseAnalysisRequest {
  imageFile?: File;
  imageDataUrl?: string;
  cropHint?: string;
  preferredLanguage?: 'en' | 'hi';
  forceMode?: 'auto' | 'demo' | 'simulate_failure';
}

export interface PlantDiseaseInferenceService {
  serviceId: string;
  serviceName: string;
  isApiConfigured: boolean;
  analyzeLeaf(request: DiseaseAnalysisRequest): Promise<CropDiseaseDiagnostic>;
}
