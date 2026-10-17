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
| **Navigation** | **React Router 7** | Client-side routing with bottom thumb navigation |
| **Backend & Cloud** | **Supabase** | Cloud database, authentication, offline sync fallback |
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
- **Touch-Friendly Hit Targets**: Buttons and tab targets are sized at a minimum of 44px–52px for outdoor, single-handed Android thumb use.
- **Android Native Enhancements**: Safe-area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`), active tap feedback (`active:scale-[0.98]`), and offline connectivity detection.

---

## 🗂️ Project & Folder Architecture

```text
HarvestGuard/
├── android/                   # Native Android Studio project (Gradle, AndroidManifest)
├── public/                    # Static assets & icons
├── src/
│   ├── assets/                # App artwork and icons
│   ├── config/                # Environment variables & navigation definitions
│   │   ├── env.ts             # Validated environment configuration with fallback
│   │   └── navigation.ts      # Bottom navigation items & multilingual labels
│   ├── types/                 # Central TypeScript type definitions
│   │   ├── common.ts          # UI button variants, badges, status metrics
│   │   ├── farm.ts            # Crop telemetry, health score, advisory models
│   │   ├── market.ts          # APMC mandi prices and buyer inquiries
│   │   ├── finance.ts         # PM-KISAN, KCC credit, and insurance schemes
│   │   ├── user.ts            # Farmer identity, language, land holdings
│   │   └── index.ts           # Central barrel export
│   ├── services/              # Cloud and local storage services
│   │   └── supabase.ts        # Supabase client with offline demo seed fallback
│   ├── utils/                 # Utility functions
│   │   ├── cn.ts              # Class name merger
│   │   └── formatters.ts      # Currency (₹ INR), land area (Acres), date formats
│   ├── hooks/                 # Reusable custom React hooks
│   │   └── useNetworkStatus.ts# Rural network connectivity detector
│   ├── components/            # Reusable UI component library
│   │   ├── common/            # Atomic components
│   │   │   ├── Button.tsx     # Primary, secondary, outline, ghost, earth, loading states
│   │   │   ├── Card.tsx       # Rounded cards (Header, Title, Content, Footer)
│   │   │   ├── FormInput.tsx  # Input, SearchInput, FormSelect, FormTextarea
│   │   │   ├── StatusBadge.tsx# Success, warning, error, info, earth badges
│   │   │   ├── LoadingState.tsx# Spinners, skeleton loaders, and full page loaders
│   │   │   ├── ErrorState.tsx # Error cards, empty states, offline banner
│   │   │   └── index.ts       # Barrel export
│   │   └── layout/            # Layout shell components
│   │       ├── AppLayout.tsx  # Screen scaffold (TopHeader + Outlet + BottomNav)
│   │       ├── TopHeader.tsx  # Android top app bar with language toggle & sync badge
│   │       ├── BottomNav.tsx  # Thumb-friendly bottom navigation bar
│   │       ├── MobileShell.tsx# Android device frame / responsive layout container
│   │       └── index.ts       # Barrel export
│   ├── features/              # Modular feature domains
│   │   ├── farmCare/          # AI Crop doctor & pest detection
│   │   ├── intelligence/      # Weather telemetry & AI Agronomist chat
│   │   ├── finance/           # KCC & government welfare schemes
│   │   ├── market/            # Mandi live pricing & buyer match
│   │   └── profile/           # Land records & digital identity
│   ├── pages/                 # Route entry views
│   │   ├── DashboardPage.tsx  # Farm health overview, weather alert, quick actions
│   │   ├── FarmCarePage.tsx   # Crop doctor camera scanner & disease records
│   │   ├── IntelligencePage.tsx# 5-day weather forecast, NDVI, AI chat
│   │   ├── FinancePage.tsx    # KCC card limit, PM-KISAN DBT tracker, schemes
│   │   ├── MarketPage.tsx     # APMC live rates, price trend, buyer demand
│   │   ├── ProfilePage.tsx    # Farmer profile, KYC status, language selector
│   │   ├── NotFoundPage.tsx   # 404 handler
│   │   └── index.ts           # Barrel export
│   ├── App.tsx                # React Router routing setup
│   ├── main.tsx               # Application entry point
│   └── index.css              # Tailwind directives & Android touch styles
├── capacitor.config.ts        # Capacitor configuration for Android app
├── tailwind.config.js         # Earthy design system tokens & colors
├── vite.config.ts             # Vite bundler & path aliases
├── tsconfig.json              # TypeScript root configuration
├── .env.example               # Environment variables template
└── README.md                  # Documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24.x)
- **npm**: v9+
- *(Optional for native Android build)*: **Android Studio**, **JDK 17+**, and Android SDK 33+.

### 2. Installation
Clone the repository and install dependencies:

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
# Supabase Configuration (Leave default for offline demo fallback)
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

# Optional Agricultural APIs
VITE_WEATHER_API_KEY=""
VITE_AGRI_MARKET_API_KEY=""
VITE_GEMINI_API_KEY=""
```
> **Security Note**: Never commit `.env` to source control. Secrets are accessed exclusively via `src/config/env.ts` with safe client fallbacks.

### 4. Running the Development Server

```bash
npm run dev
```

- Local preview: `http://localhost:5173/`
- Mobile network preview: Vite automatically exposes the local network IP so you can test directly on your physical Android phone over Wi-Fi.

### 5. TypeScript Check & Production Build

```bash
# Type check without emitting files
npm run typecheck

# Full production build
npm run build
```

---

## 🤖 Android Packaging with Capacitor

HarvestGuard is configured for native Android deployment via Capacitor.

### Android Build Commands

```bash
# 1. Build the production web bundle and sync with Android
npm run cap:build

# 2. Sync web assets directly to Android assets
npm run cap:sync

# 3. Open the Android project in Android Studio
npm run cap:open

# 4. Run directly on a connected Android phone or emulator
npm run cap:run
```

### Android App Configuration Details
- **Package ID**: `com.harvestguard.app`
- **Application Name**: `HarvestGuard`
- **Target SDK**: Android 14 (API 34)
- **Web Directory**: `dist`
- **Scheme**: `https://` (Android HTTPS asset loader for secure cookie and camera access)
- **Permissions Configured**: Camera access (for leaf disease diagnosis), Geolocation (for micro-weather radar), Network State (for rural offline mode).

---

## 🗺️ Navigation Routes

| Route | View | Description |
| :--- | :--- | :--- |
| `/` | **Dashboard** | Farmer greeting, field weather telemetry, active crop health cards, quick actions |
| `/farm-care` | **Smart Farm Care** | AI crop doctor leaf scanner, symptom search, diagnostic logs |
| `/intelligence` | **Farm Intelligence** | 5-day weather forecast, Sentinel NDVI vegetation vigor, AI agronomist chat |
| `/finance` | **Money & Schemes** | Kisan Credit Card (KCC) limit widget, PM-KISAN DBT tracker, government subsidies |
| `/market` | **Market Access** | APMC mandi live modal rates, price-trend arrows, verified buyer leads |
| `/profile` | **Profile & Settings** | Land records, Aadhaar KYC badge, language selector, offline sync telemetry |

---

## 🏆 Hackathon Foundation Highlights

1. **Zero External CSS Bloat**: Pure Tailwind CSS tokens tailored to rural Indian agricultural context.
2. **Offline-Resilient**: Automatic network detection (`useNetworkStatus`), offline banners, and mock seed fallback for reliable live demo presentation.
3. **Android Safe Area Compliant**: Clean status bar padding and bottom navigation layout matching native Android guidelines.
4. **Strict TypeScript Standards**: 100% type-safe components, data contracts, and zero compiler warnings.
>>>>>>> b10300c (feat: initial commit of HarvestGuard Android-first farmer empowerment platform)
