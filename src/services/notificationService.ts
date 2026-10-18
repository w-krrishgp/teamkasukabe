import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';
import { env, isConfigured } from '@/config/env';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'outbreak_alert' | 'weather_warning' | 'mandi_rate' | 'system';
  severity: 'critical' | 'high' | 'info';
  crop?: string;
  diseaseName?: string;
  distanceKm?: number;
  actionUrl?: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY_NOTIFS = 'harvestguard_notifications_history';
const STORAGE_KEY_FCM_TOKEN = 'harvestguard_fcm_token';

let messagingInstance: Messaging | null = null;
let isFcmInitialized = false;

/**
 * Initialize Firebase App and Cloud Messaging (FCM)
 */
export async function initFirebaseMessaging(): Promise<{
  supported: boolean;
  configured: boolean;
  messaging: Messaging | null;
}> {
  if (!isConfigured.firebase) {
    return { supported: false, configured: false, messaging: null };
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      return { supported: false, configured: true, messaging: null };
    }

    if (!isFcmInitialized) {
      const app = getApps().length === 0 ? initializeApp(env.firebase) : getApps()[0];
      messagingInstance = getMessaging(app);
      isFcmInitialized = true;

      // Handle foreground FCM messages
      onMessage(messagingInstance, (payload) => {
        const title = payload.notification?.title || 'Disease Outbreak Warning';
        const body = payload.notification?.body || 'New agricultural advisory received.';
        dispatchNotification({
          id: `fcm-${Date.now()}`,
          title,
          body,
          type: 'outbreak_alert',
          severity: 'high',
          timestamp: 'Just now',
          read: false,
        });
      });
    }

    return { supported: true, configured: true, messaging: messagingInstance };
  } catch (err) {
    console.warn('Firebase Messaging init error:', err);
    return { supported: false, configured: true, messaging: null };
  }
}

/**
 * Request Push Notification Permission & get FCM token
 */
export async function requestPushPermission(): Promise<{
  granted: boolean;
  token?: string;
  error?: string;
}> {
  if (!('Notification' in window)) {
    return { granted: false, error: 'Notifications not supported by this browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { granted: false, error: 'Notification permission was denied by user.' };
    }

    // Attempt to get FCM token if Firebase is configured
    if (isConfigured.firebase && env.firebase.vapidKey) {
      const { messaging } = await initFirebaseMessaging();
      if (messaging) {
        try {
          const token = await getToken(messaging, {
            vapidKey: env.firebase.vapidKey,
          });
          if (token) {
            localStorage.setItem(STORAGE_KEY_FCM_TOKEN, token);
            return { granted: true, token };
          }
        } catch (fcmErr) {
          console.warn('FCM token generation error (will use HTML5 Web Notifications fallback):', fcmErr);
        }
      }
    }

    return { granted: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown permission error';
    return { granted: false, error: errorMessage };
  }
}

/**
 * Synthesize a 2-tone audio chime using the Web Audio API (No external sound file required)
 */
export function playOutbreakAlertChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2: 880.00 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.15);
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.45);
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
}

/**
 * Save notification to persistent in-app storage
 */
export function saveNotificationToHistory(notification: AppNotification) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    const existing: AppNotification[] = raw ? JSON.parse(raw) : [];
    const updated = [notification, ...existing].slice(0, 30); // keep last 30
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(updated));
  } catch {
    // LocalStorage fallback
  }
}

export function getNotificationHistory(): AppNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (!raw) {
      const defaultNotifs: AppNotification[] = [
        {
          id: 'init-rust-alert',
          title: 'Nearby Disease Alert: Yellow Rust',
          body: 'Yellow Rust detected in Vadu village (3.8 km away). Prophylactic spray recommended for HD-2967 wheat tillers.',
          type: 'outbreak_alert',
          severity: 'critical',
          crop: 'Wheat (HD-2967)',
          diseaseName: 'Yellow Rust',
          distanceKm: 3.8,
          actionUrl: '/disease-outbreaks',
          timestamp: '1 hour ago',
          read: false,
        },
        {
          id: 'init-weather-alert',
          title: 'Precipitation Advisory: 65% Rain in 48h',
          body: 'Incoming depression over Mehsana. Hold nitrogen broadcasting and secure open furrows.',
          type: 'weather_warning',
          severity: 'high',
          actionUrl: '/weather',
          timestamp: '2 hours ago',
          read: true,
        },
      ];
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(defaultNotifs));
      return defaultNotifs;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Haversine formula to compute distance between two GPS coordinates in kilometers
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface OutbreakBroadcastPayload {
  id: string;
  diseaseName: string;
  crop: string;
  village: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  severity: 'critical' | 'high' | 'moderate' | 'watch';
  preventiveProtocol?: string;
  alertRadiusKm: number; // e.g. 10 km
}

// Inter-tab / cross-window broadcast channel
const broadcastChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('harvestguard_outbreak_telemetry')
    : null;

if (broadcastChannel) {
  broadcastChannel.onmessage = (event: MessageEvent<OutbreakBroadcastPayload>) => {
    const payload = event.data;
    if (!payload) return;

    // Default farmer location (Mehsana: 23.588, 72.3693)
    const myLat = 23.588;
    const myLon = 72.3693;

    const distance = calculateHaversineDistanceKm(
      myLat,
      myLon,
      payload.coordinates.latitude,
      payload.coordinates.longitude
    );

    // ONLY notify if the farmer is within the danger radius (e.g. <= 10 km)
    if (distance <= payload.alertRadiusKm) {
      const notif: AppNotification = {
        id: `incoming-${payload.id}`,
        title: `🚨 PROXIMITY ALERT: ${payload.diseaseName} (${payload.crop})`,
        body: `Detected in ${payload.village} (${distance.toFixed(1)} km from your farm). High contagion risk within your 10 km bio-security zone.`,
        type: 'outbreak_alert',
        severity: payload.severity === 'critical' ? 'critical' : 'high',
        crop: payload.crop,
        diseaseName: payload.diseaseName,
        distanceKm: distance,
        actionUrl: '/disease-outbreaks',
        timestamp: 'Just now',
        read: false,
      };
      dispatchNotification(notif);
    }
  };
}

/**
 * Internal dispatch helper for in-app toast event + browser push
 */
export function dispatchNotification(notif: AppNotification) {
  saveNotificationToHistory(notif);
  playOutbreakAlertChime();

  console.log('[HarvestGuard Notification] Dispatching alert:', notif.title);

  // 1. Dispatch custom DOM event for active in-app toast components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('harvestguard:notification', { detail: notif })
    );
  }

  // 2. If user granted browser notification permission, show real system push notification
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(notif.title, {
            body: notif.body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            tag: notif.id,
          });
        }).catch(() => {
          new Notification(notif.title, {
            body: notif.body,
            icon: '/favicon.svg',
            tag: notif.id,
          });
        });
      } else {
        new Notification(notif.title, {
          body: notif.body,
          icon: '/favicon.svg',
          tag: notif.id,
        });
      }
    } catch (pushErr) {
      console.warn('[HarvestGuard Notification] Native notification error:', pushErr);
    }
  }
}

/**
 * Broadcast an Outbreak Alert to Farmers & Local Community
 * Only farmers within the alert radius (default 10 km) receive emergency alerts
 */
export async function broadcastOutbreakAlert(params: {
  diseaseName: string;
  crop: string;
  village: string;
  distanceKm: number;
  severity: 'critical' | 'high' | 'moderate' | 'watch';
  coordinates?: { latitude: number; longitude: number };
  preventiveProtocol?: string;
  alertRadiusKm?: number;
}): Promise<AppNotification> {
  const isUrgent = params.severity === 'critical' || params.severity === 'high';
  const radius = params.alertRadiusKm || 10;
  const coords = params.coordinates || { latitude: 23.5612, longitude: 72.3941 }; // Vadu / Kadi

  const title = `🚨 OUTBREAK ALERT: ${params.diseaseName} (${params.crop})`;
  const body = `Detected in ${params.village} (${params.distanceKm.toFixed(1)} km away). Immediate foliar inspection and quarantine advised.`;

  const notification: AppNotification = {
    id: `alert-${Date.now()}`,
    title,
    body,
    type: 'outbreak_alert',
    severity: isUrgent ? 'critical' : 'high',
    crop: params.crop,
    diseaseName: params.diseaseName,
    distanceKm: params.distanceKm,
    actionUrl: '/disease-outbreaks',
    timestamp: 'Just now',
    read: false,
  };

  // Broadcast to other tabs / devices on network
  if (broadcastChannel) {
    broadcastChannel.postMessage({
      id: notification.id,
      diseaseName: params.diseaseName,
      crop: params.crop,
      village: params.village,
      coordinates: coords,
      severity: params.severity,
      preventiveProtocol: params.preventiveProtocol,
      alertRadiusKm: radius,
    });
  }

  // Dispatch on local device as well if in range
  if (params.distanceKm <= radius) {
    dispatchNotification(notification);
  }

  return notification;
}

