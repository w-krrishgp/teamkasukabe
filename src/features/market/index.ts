/**
 * Market Access Feature Module
 * Connects farmers to real-time APMC mandi prices, direct buyer leads, and produce listings.
 */

export interface ProduceListing {
  id: string;
  cropName: string;
  quantityAvailableQuintals: number;
  expectedPricePerQuintal: number;
  qualityGrade: 'A+' | 'A' | 'B';
  harvestDate: string;
  villageLocation: string;
}

export const FEATURE_INFO = {
  name: 'Market Access',
  version: '1.0.0',
  description: 'Live APMC mandi pricing, price-trend analytics, and direct-to-buyer farm produce marketplace',
};
