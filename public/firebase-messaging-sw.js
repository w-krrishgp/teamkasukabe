// Scripts for Firebase App & Messaging in Service Worker context
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the options
// In production, these match your Firebase Console configuration
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message: ', payload);
    const notificationTitle = payload.notification?.title || 'HarvestGuard Outbreak Alert';
    const notificationOptions = {
      body: payload.notification?.body || 'New crop pathogen alert detected in your area.',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'harvestguard-disease-alert',
      data: payload.data,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch {
  console.log('[firebase-messaging-sw.js] Standby mode - waiting for Firebase credentials.');
}
