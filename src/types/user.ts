export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'pa';

export interface FarmerProfile {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  totalLandAcres: number;
  primaryCrops: string[];
  kisanId: string;
  preferredLanguage: SupportedLanguage;
  isKycVerified: boolean;
  avatarUrl?: string;
  offlineSyncPending: number;
}
