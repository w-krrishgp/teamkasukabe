export interface MandiRate {
  id: string;
  cropName: string;
  marketName: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string; // e.g. "₹ / Quintal"
  priceTrend: 'up' | 'down' | 'stable';
  updatedAt: string;
}

export interface BuyerLead {
  id: string;
  buyerName: string;
  organization: string;
  cropRequired: string;
  quantityTons: number;
  offeredPrice: number;
  distanceKm: number;
  verified: boolean;
}
