/**
 * HarvestGuard — No Distress Selling Service
 * Bridges decision engine with Supabase cloud persistence & offline local caching
 */

import { supabase, isSupabaseLive } from '@/services/supabase';
import type { BookingEnquiry, DistressSellingInputs } from './types';
import { SAMPLE_SCENARIOS } from './sampleScenarios';

const STORAGE_KEY_ENQUIRIES = 'harvestguard_distress_enquiries';
const STORAGE_KEY_CUSTOM_INPUTS = 'harvestguard_distress_last_input';

export interface ServiceDataSourceStatus {
  isCloudConnected: boolean;
  sourceLabel: string;
  lastUpdated: string;
  syncPendingCount: number;
}

export const distressSellingService = {
  /**
   * Retrieves data source connectivity and provenance metadata.
   */
  getDataSourceStatus(): ServiceDataSourceStatus {
    return {
      isCloudConnected: isSupabaseLive,
      sourceLabel: isSupabaseLive
        ? 'Live Connected: Supabase Cloud Database'
        : 'Demonstration Mode: Verified e-NAM APMC Gujarat & Maharashtra Benchmarks',
      lastUpdated: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      syncPendingCount: this.getOfflinePendingEnquiries().length,
    };
  },

  /**
   * Loads cached custom inputs or returns default sample.
   */
  loadSavedInputs(): DistressSellingInputs {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_INPUTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved distress inputs from localStorage', e);
    }
    return SAMPLE_SCENARIOS[0].inputs;
  },

  /**
   * Saves user custom inputs to localStorage.
   */
  saveInputs(inputs: DistressSellingInputs): void {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_INPUTS, JSON.stringify(inputs));
    } catch (e) {
      console.warn('Failed to save distress inputs to localStorage', e);
    }
  },

  /**
   * Submits a booking enquiry (e.g. reserving cold store space, contacting buyer, or joining pool).
   * Tries Supabase cloud write first; gracefully falls back to local storage.
   */
  async submitEnquiry(enquiry: Omit<BookingEnquiry, 'id' | 'createdAt' | 'status'>): Promise<BookingEnquiry> {
    const newEnquiry: BookingEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'pending_confirmation',
    };

    if (isSupabaseLive) {
      try {
        const { data, error } = await supabase
          .from('harvest_enquiries')
          .insert({
            farmer_name: newEnquiry.farmerName,
            farmer_phone: newEnquiry.farmerPhone,
            crop_name: newEnquiry.cropName,
            quantity_quintals: newEnquiry.quantityQuintals,
            option_selected: newEnquiry.optionSelected,
            target_entity_name: newEnquiry.targetEntityName,
            expected_net_proceeds: newEnquiry.expectedNetProceeds,
            notes: newEnquiry.notes || '',
            status: 'pending_confirmation',
          })
          .select()
          .single();

        if (!error && data) {
          return {
            ...newEnquiry,
            id: data.id || newEnquiry.id,
          };
        }
      } catch (err) {
        console.warn('Supabase enquiry insertion error, falling back to local storage', err);
      }
    }

    // Offline / Demo Local Persistence
    this.saveEnquiryLocally(newEnquiry);
    return newEnquiry;
  },

  /**
   * Saves enquiry locally into browser localStorage.
   */
  saveEnquiryLocally(enquiry: BookingEnquiry): void {
    try {
      const existing = this.getOfflinePendingEnquiries();
      const updated = [enquiry, ...existing];
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not store enquiry in localStorage', e);
    }
  },

  /**
   * Fetches locally persisted enquiries.
   */
  getOfflinePendingEnquiries(): BookingEnquiry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read enquiries from localStorage', e);
    }
    return [];
  },
};
