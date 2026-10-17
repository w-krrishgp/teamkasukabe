/**
 * Money & Schemes Feature Module
 * Handles DBT verification, Kisan Credit Card tracking, crop insurance (PMFBY), and state subsidies.
 */

export interface SchemeApplication {
  schemeId: string;
  applicationNumber: string;
  status: 'submitted' | 'under_review' | 'sanctioned' | 'disbursed';
  disbursementAmount: number;
  lastUpdated: string;
}

export const FEATURE_INFO = {
  name: 'Money & Schemes',
  version: '1.0.0',
  description: 'Direct institutional credit access, DBT payment tracking, and government agricultural welfare schemes',
};
