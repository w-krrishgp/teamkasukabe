/**
 * Safe Environment Variable Accessor
 * Ensures secrets are never exposed on client-side and provides
 * robust fallbacks for local and hackathon demo environments.
 */

interface AppConfig {
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  appVersion: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  weatherApiKey?: string;
  agriMarketApiKey?: string;
  geminiApiKey?: string;
  isMockFallbackEnabled: boolean;
  isOfflineCacheEnabled: boolean;
}

export const env: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'HarvestGuard',
  appEnv: (import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://demo-harvestguard.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder',
  weatherApiKey: import.meta.env.VITE_WEATHER_API_KEY || '',
  agriMarketApiKey: import.meta.env.VITE_AGRI_MARKET_API_KEY || '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  isMockFallbackEnabled: import.meta.env.VITE_ENABLE_MOCK_FALLBACK !== 'false',
  isOfflineCacheEnabled: import.meta.env.VITE_ENABLE_OFFLINE_CACHE !== 'false',
};

export const isConfigured = {
  supabase: Boolean(
    env.supabaseUrl &&
    !env.supabaseUrl.includes('demo-harvestguard') &&
    env.supabaseAnonKey &&
    !env.supabaseAnonKey.includes('demo-anon-key-placeholder')
  ),
  weather: Boolean(env.weatherApiKey),
  market: Boolean(env.agriMarketApiKey),
};
