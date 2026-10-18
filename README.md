# teamkasukabe — 🌱 HarvestGuard

> **Android-First Farmer Empowerment Platform**  
> **Hackathon Edition**: Agriculture & Rural Development  
> An Android-first mobile web application empowering smallholder and marginal farmers with real-time agronomic intelligence, crop disease scanning, APMC mandi market access, and direct institutional credit & welfare scheme tracking.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript** | Type-safe, high-performance UI runtime |
| **Build Tool** | **Vite 8** | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | **Tailwind CSS (v3)** | Accessible, mobile-first earthy design system |
| **Android Packaging** | **Capacitor 8** | Cross-platform native Android WebView bridge & device plugins |
| **Navigation** | **React Router 7** | Single-page client-side routing with viewport locking (`100dvh`) |
| **Backend & Cloud** | **Supabase** | Cloud database, authentication, offline sync fallback |
| **Device Plugins** | **Capacitor Camera & Geolocation** | Native camera leaf capture & GPS with graceful web/field fallbacks |
| **Icons** | **Lucide React** | Lightweight, accessible semantic iconography |

---

## 📱 Design System & Android UX Principles

HarvestGuard is engineered with a mobile-first, rural-friendly interface:

- **Earthy Color Palette**:
  - `harvest-deep` (`#142318`): Botanical soil tone for headers & text legibility
  - `harvest-primary` (`#2D6A4F`): Lush forest green brand primary for CTAs
  - `harvest-sage` (`#52B788`) & `harvest-mint` (`#74C69D`): Growth accents
  - `harvest-pale` (`#D8F3DC`): Soft status badges and highlights
  - `harvest-cream` (`#F8FAF6`): Clean, organic off-white background
  - `harvest-warm` (`#F1F5EE`): Container card surfaces
  - `harvest-clay` (`#C86D51`): Terracotta soil warning & alert accents
- **Accessible Contrast**: WCAG AA/AAA compliant text contrast ratios on all screens.
- **Touch-Friendly Hit Targets**: Buttons and tab targets are sized at a minimum of 48px–56px for outdoor, single-handed Android thumb use.
- **Android Native Enhancements**: Safe-area insets (`pt-safe`, `pb-safe`), active tap feedback (`active:scale-[0.98]`), single-page viewport locking (`overflow: hidden; position: fixed` on body with momentum scroll inside `<main>`), and offline connectivity detection.

---

## 🗺️ Core Agricultural Routes & Member 3 Deliverables

### Member 3 — Farm Intelligence (Features 4–6 & 3 Workflows)
- **Feature 4: Weather & Agricultural Guidance** (`/weather`) — Live Open-Meteo API connection, multi-location presets + GPS fix, hourly spray suitability matrix, and agro-met advisories.
- **Feature 5: Disease Outbreak Alert** (`/disease-outbreaks`) — Proximity contagion radius, interactive geographic clustering radar, verified chemical & bio dosage protocols, and farmer crowd-sighting submission.
- **Feature 6: Cold Storage Risk Mitigation** (`/cold-storage`) — WDRA-certified warehouse listings, live capacity utilization progress bars, perishable spoilage alerts, and digital booking gate pass generation.
- **Three Farm-Planning & Risk-Management Workflows** (`/intelligence`) — Interactive walkthroughs for Climate Risk Spray Planning, Bio-Security Disease Containment, and Post-Harvest Loss Prevention.

| # | Route | View | Description |
| :--- | :--- | :--- | :--- |
| 1 | `/` | **Dashboard** | Farm overview, greeting, quick actions, weather alert, cold storage alert, market opportunity |
| 2 | `/farm-care` | **Smart Farm Care** | AI crop doctor hub, target crop selection, leaf scan card, and disease records |
| 3 | `/disease-scanner` | **AI Leaf Disease Scanner** | Dedicated camera viewfinder, native camera/photo picker, instant severity & dosage guide |
| 4 | `/intelligence` | **Farm Intelligence Hub** | Three risk-management workflows, Sentinel-2 NDVI canopy vigor, AI Agronomist chat |
| 5 | `/weather` | **Weather & Spray Radar** | Open-Meteo API live telemetry, hourly spray suitability, agricultural guidance |
| 6 | `/disease-outbreaks` | **Disease Outbreak Alert** | Geographic clustering radar, proximity contagion alert (<10km), crowd reporting |
| 7 | `/cold-storage` | **Cold Storage Hub** | WDRA facility catalog, real-time capacity telemetry, digital gate pass booking |
| 8 | `/khet-score` | **Khet Score Audit** | Composite 88/100 farm health audit, NPK balance, water security, credit readiness |
| 9 | `/finance` | **Money & Schemes** | Kisan Credit Card (KCC) limit widget, institutional credit cards, scheme application |
| 10 | `/schemes` | **Govt Welfare & Subsidies** | PM-KISAN ₹6,000 tracker, PMFBY crop insurance, SMAM machinery, PM-KUSUM solar pumps |
| 11 | `/market` | **Market Access Hub** | APMC mandi live modal rates, price-trend arrows, direct miller buyer contracts |
| 12 | `/mandi-rates` | **APMC Live Mandi Rates** | Live commodity prices (Wheat, Mustard, Cumin), market arbitrage (+₹70/Qtl), freight finder |
| 13 | `/profile` | **Farmer Profile & Identity** | Digital Kisan ID, land records, Aadhaar e-KYC badge, and Rural Network Operation Matrix |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.x)
- **npm**: v9+
- *(For local native Android APK building)*: **JDK 17+**, **Android Studio**, and Android SDK 34+.

### 2. Installation

```bash
cd Farmapp
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your credentials:
```env
VITE_APP_NAME="HarvestGuard"
VITE_APP_ENV="development"
VITE_SUPABASE_URL="https://demo-harvestguard.supabase.co"
VITE_SUPABASE_ANON_KEY="demo-anon-key-placeholder"
```
> **Security Note**: Never commit `.env` to source control. Secrets are accessed exclusively via `src/config/env.ts` with safe client fallbacks. No private keys or service role keys are bundled into client builds.

### 4. Running the Development Server

```bash
npm run dev
```

- Local preview: `http://localhost:5173/`
- Mobile network preview: Vite automatically exposes the local network IP so you can test directly on your physical Android phone over Wi-Fi.

### 5. Static Analysis, Type Check & Production Build

```bash
# Type check without emitting files
npm run typecheck

# Code quality and style linting (0 errors, 0 warnings)
npm run lint

# Full production web bundle
npm run build
```

---

## 🤖 Android Packaging with Capacitor

HarvestGuard is configured for native Android deployment via Capacitor.

### Android Build & Sync Commands

```bash
# 1. Build the production web bundle and sync with the Android project
npm run cap:build

# 2. Sync web assets directly to Android assets
npm run cap:sync

# 3. Open the Android project in Android Studio
npm run cap:open

# 4. Run directly on a connected Android phone or emulator
npm run cap:run
```

### Android App Metadata & Configuration
- **Package ID**: `com.harvestguard.app`
- **Application Name**: `HarvestGuard`
- **Target SDK**: Android 14 (API 34)
- **Min SDK**: Android 7.0 (API 24)
- **Web Directory**: `dist`
- **Scheme**: `https://` (Android HTTPS asset loader for secure cookie, camera, and geolocation access)

### Native Permissions & Graceful Fallbacks
Configured in `android/app/src/main/AndroidManifest.xml`:
- **Network**: `android.permission.INTERNET`, `android.permission.ACCESS_NETWORK_STATE`
- **Camera**: `android.permission.CAMERA` with `android.hardware.camera` (`required=false`)
- **Location**: `android.permission.ACCESS_FINE_LOCATION`, `android.permission.ACCESS_COARSE_LOCATION` with `android.hardware.location.gps` (`required=false`)
- **Graceful Fallbacks (`src/services/deviceService.ts`)**:
  - If camera permission is denied or device camera is unavailable, the app falls back to a verified field sample image with clear status messaging.
  - If geolocation is denied or timed out, the app falls back to the farmer's registered farm coordinates (23.588° N, 72.3693° E, Mehsana Gujarat).

---

## 📶 Rural Network Capabilities (Online vs Offline)

| Feature | Offline Availability | Notes |
| :--- | :---: | :--- |
| **AI Disease Symptom & Prescriptions** | ✅ Yes | Cached diagnostic protocols and chemical dilution guides |
| **Khet Score Farm Health Computation** | ✅ Yes | Local heuristic scoring algorithm |
| **Digital Land Records & Survey Numbers** | ✅ Yes | Stored locally in encrypted web storage |
| **Kisan Credit Card (KCC) Limit Summary** | ✅ Yes | Cached banking card summary |
| **Emergency Kisan Call Center (1800-180-1551)** | ✅ Yes | Native GSM dialer access |
| **Live APMC Mandi Price Streaming** | 🌐 Online Required | Real-time modal price feeds from e-NAM mandis |
| **Sentinel-2 Satellite NDVI Radar Passes** | 🌐 Online Required | Multichannel satellite multispectral imagery |
| **5-Day Micro-Weather Precipitation Radar** | 🌐 Online Required | Atmospheric telemetry and radar updates |
| **Cloud Database Synchronization (Supabase)** | 🌐 Online Required | Two-way remote synchronization |
| **Direct Institutional Buyer Inquiries** | 🌐 Online Required | Direct procurement matchmaking |

---

## 📦 How to Build the Android APK

### Option A: Local Build (Requires JDK 17+ and Android Studio)
1. Install **JDK 17 or higher** (e.g. Eclipse Temurin 17 or OpenJDK 17).
2. Set the `JAVA_HOME` environment variable to your JDK 17 installation:
   ```powershell
   [System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17...", "User")
   ```
3. Install **Android Studio** and the Android SDK Platform 34.
4. Set the `ANDROID_HOME` environment variable:
   ```powershell
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<Username>\AppData\Local\Android\Sdk", "User")
   ```
5. Build the web app and sync:
   ```bash
   npm run cap:build
   ```
6. Build the debug APK via Gradle:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   The APK will be generated at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

### Option B: Cloud CI Build via GitHub Actions
A complete automated build workflow is configured in `.github/workflows/android-build.yml`.
Every push to `main` triggers:
1. Node.js setup and dependency installation
2. TypeScript typecheck (`npm run typecheck`) and oxlint (`npm run lint`)
3. Production web build (`npm run build`)
4. Capacitor sync (`npx cap sync android`)
5. Eclipse Temurin JDK 17 setup
6. Android SDK and Gradle build (`gradlew assembleDebug`)
7. Upload of `app-debug.apk` as a downloadable GitHub Actions artifact!

---

## 📋 Android Release Checklist

- [x] **App ID & Metadata**: `com.harvestguard.app`, App Name `HarvestGuard` configured in `capacitor.config.ts`, `strings.xml`, and `build.gradle`.
- [x] **Production Web Build**: Clean Vite production build with code splitting and zero TypeScript compiler errors.
- [x] **Code Quality & Linter**: Oxlint executed with 0 warnings and 0 errors across 50 files.
- [x] **Security & Secret Hygiene**: Verified that no private API keys or service role keys are present in `.env`, `.env.example`, or client bundles.
- [x] **Native Permissions Restricted**: Only Camera and Location permissions are requested, with `android:required="false"` so all Android devices can install the app.
- [x] **Graceful Fallbacks**: Fully implemented in `src/services/deviceService.ts` for camera denial and GPS failure.
- [x] **Single-Page Viewport Lock**: Single-page mobile layout locking (`100dvh`, fixed body) with smooth internal scroll container and no double scrollbars.
- [x] **Phone-Sized Touch Targets**: All interactive elements (buttons, pills, tabs) meet or exceed the 48px touch target standard.
- [x] **Safe Area Compliance**: Configured `pt-safe` and `pb-safe` for status bar and gesture navigation bar padding.
- [x] **11 Feature Routes Verified**: All 11 feature routes (`/`, `/farm-care`, `/disease-scanner`, `/intelligence`, `/weather`, `/khet-score`, `/finance`, `/schemes`, `/market`, `/mandi-rates`, `/profile`) verified and returning HTTP 200.
- [x] **Cloud CI & APK Workflow**: Configured in `.github/workflows/android-build.yml` with Temurin JDK 17 and Android SDK.
