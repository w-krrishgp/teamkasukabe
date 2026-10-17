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

// Safely access env vars in both Vite (import.meta.env) and Node/testing (process.env)
const metaEnv: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env as unknown as Record<string, string | undefined>)
    : typeof process !== 'undefined' && process.env
    ? process.env
    : {};

export const env: AppConfig = {
  appName: metaEnv.VITE_APP_NAME || 'HarvestGuard',
  appEnv: (metaEnv.VITE_APP_ENV as 'development' | 'staging' | 'production') || 'development',
  appVersion: metaEnv.VITE_APP_VERSION || '1.0.0',
  supabaseUrl: metaEnv.VITE_SUPABASE_URL || 'https://demo-harvestguard.supabase.co',
  supabaseAnonKey: metaEnv.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder',
  weatherApiKey: metaEnv.VITE_WEATHER_API_KEY || '',
  agriMarketApiKey: metaEnv.VITE_AGRI_MARKET_API_KEY || '',
  geminiApiKey: metaEnv.VITE_GEMINI_API_KEY || '',
  isMockFallbackEnabled: metaEnv.VITE_ENABLE_MOCK_FALLBACK !== 'false',
  isOfflineCacheEnabled: metaEnv.VITE_ENABLE_OFFLINE_CACHE !== 'false',
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
