import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App header
    appName: 'HarvestGuard',
    appSubname: 'Farmer Empowerment',
    selectFarm: 'Kheda Farm #1, Mehsana',
    switchFarm: 'Switch Farm',
    demoBadge: 'Demo Mode • Verified Schema',
    online: 'Online',
    offline: 'Offline',
    notifications: 'Notifications',

    // Nav
    navDashboard: 'Dashboard',
    navFarmCare: 'Farm Care',
    navIntelligence: 'Intelligence',
    navFinance: 'Money & Schemes',
    navMarket: 'Market Access',
    navProfile: 'Profile',

    // Greeting & Farm overview
    greetingMorning: 'Good morning',
    greetingFarmer: 'Ramesh Patel',
    kisanId: 'Kisan ID',
    activeCrops: 'Active Crops',
    totalArea: 'Total Area',
    soilHealth: 'Soil Moisture',
    seasonStatus: 'Rabi Season 2026',
    acres: 'Acres',

    // Quick Actions
    quickActionsTitle: 'Quick Field Actions',
    actionScanLeaf: 'Scan Leaf',
    actionScanLeafDesc: 'Instant Disease Check',
    actionCheckWeather: 'Check Weather',
    actionCheckWeatherDesc: 'Spray & Rain Radar',
    actionCheckMarket: 'Market Prices',
    actionCheckMarketDesc: 'Live APMC Rates',
    actionKhetScore: 'Khet Score',
    actionKhetScoreDesc: '88/100 • Strong Health',

    // Pillars
    pillarsTitle: 'Four Pillars of Farm Empowerment',
    pillar1Title: 'Crop Care & Health',
    pillar1Sub: 'AI-guided leaf diagnosis and pest prevention',
    pillar1Metric: '92% Optimal',
    pillar1Detail: 'Next foliar spray in 4 days',
    pillar1Action: 'Open Farm Care',

    pillar2Title: 'Farm Intelligence',
    pillar2Sub: 'Sentinel NDVI vigor & micro-weather forecasting',
    pillar2Metric: 'NDVI 0.74',
    pillar2Detail: 'Light rain in 48h (Hold urea)',
    pillar2Action: 'Open Intelligence',

    pillar3Title: 'Money & Schemes',
    pillar3Sub: 'KCC institutional credit limit & DBT welfare',
    pillar3Metric: '₹ 1,75,000',
    pillar3Detail: 'Available credit at 4% interest',
    pillar3Action: 'Check Schemes',

    pillar4Title: 'Market Access',
    pillar4Sub: 'Real-time APMC Mandi rates & direct miller sales',
    pillar4Metric: '₹ 2,680 / Qtl',
    pillar4Detail: 'Wheat rate up +₹80 this week',
    pillar4Action: 'Explore Market',

    // Market Opportunity
    marketOppTitle: 'High-Demand Market Opportunity',
    marketOppBadge: 'Verified Buyer In Unjha Mandi',
    marketOppHeadline: 'Shree Ram Flour Mills needs 50 Quintals Wheat',
    marketOppOffer: 'Offered Price: ₹ 2,750 / Quintal (+₹ 70 over modal)',
    marketOppAction: 'View Buyer Contract',

    // Weather & Disease
    weatherSummaryTitle: 'Weather & Spray Conditions',
    weatherTemp: '28°C',
    weatherCondition: 'Sunny & Favorable',
    weatherSprayWindow: 'Ideal spray window: Next 24 hours before Monday rain',
    diseaseAlertTitle: 'Nearby Disease Alert',
    diseaseAlertBadge: 'Within 4 km',
    diseaseAlertText: 'Yellow Rust detected on wheat in 3 neighboring fields. Inspect tillers today.',
    diseaseAlertAction: 'View Treatment Guide',

    // Recent Activity
    recentActivityTitle: 'Recent Farm Activity',
    activity1Title: 'Leaf health test passed: Wheat HD-2967',
    activity1Time: 'Today, 08:30 AM',
    activity2Title: 'PM-KISAN 16th installment (₹ 2,000) credited',
    activity2Time: 'Yesterday, 04:15 PM',
    activity3Title: 'Soil moisture telemetry synced: 68% (Optimal)',
    activity3Time: 'Yesterday, 10:00 AM',

    // Common
    viewDetails: 'View Details',
    close: 'Close',
    refresh: 'Refresh',
    allCrops: 'All Crops',
  },
  hi: {
    // App header
    appName: 'हार्वेस्ट गार्ड',
    appSubname: 'किसान सशक्तिकरण मंच',
    selectFarm: 'खेड़ा फार्म #1, मेहसाणा',
    switchFarm: 'खेत बदलें',
    demoBadge: 'डेमो मोड • सत्यापित डेटा',
    online: 'ऑनलाइन',
    offline: 'ऑफलाइन',
    notifications: 'सूचनाएं',

    // Nav
    navDashboard: 'डैशबोर्ड',
    navFarmCare: 'फसल सुरक्षा',
    navIntelligence: 'कृषि ज्ञान',
    navFinance: 'योजना व ऋण',
    navMarket: 'मंडी भाव',
    navProfile: 'प्रोफ़ाइल',

    // Greeting & Farm overview
    greetingMorning: 'राम राम / नमस्ते',
    greetingFarmer: 'रमेश पटेल',
    kisanId: 'किसान आईडी',
    activeCrops: 'सक्रिय फसलें',
    totalArea: 'कुल रकबा',
    soilHealth: 'मिट्टी की नमी',
    seasonStatus: 'रबी सीजन 2026',
    acres: 'एकड़',

    // Quick Actions
    quickActionsTitle: 'त्वरित खेत कार्य',
    actionScanLeaf: 'पत्ता स्कैन करें',
    actionScanLeafDesc: 'तुरंत रोग जांचें',
    actionCheckWeather: 'मौसम देखें',
    actionCheckWeatherDesc: 'बारिश व छिड़काव अलर्ट',
    actionCheckMarket: 'मंडी भाव',
    actionCheckMarketDesc: 'ताज़ा APMC दरें',
    actionKhetScore: 'खेत स्कोर',
    actionKhetScoreDesc: '88/100 • उत्तम स्वास्थ्य',

    // Pillars
    pillarsTitle: 'किसान सशक्तिकरण के 4 मुख्य स्तंभ',
    pillar1Title: 'फसल सुरक्षा व देखभाल',
    pillar1Sub: 'AI द्वारा रोग पहचान व कीटनाशक सलाह',
    pillar1Metric: '92% स्वस्थ',
    pillar1Detail: 'अगला पर्ण स्प्रे 4 दिनों में',
    pillar1Action: 'फसल सुरक्षा खोलें',

    pillar2Title: 'कृषि बुद्धिमत्ता (मौसम व उपग्रह)',
    pillar2Sub: 'उपग्रह NDVI घनत्व व 5-दिवसीय मौसम',
    pillar2Metric: 'NDVI 0.74',
    pillar2Detail: '48 घंटे में हल्की बारिश (यूरिया रोकें)',
    pillar2Action: 'कृषि ज्ञान खोलें',

    pillar3Title: 'सरकारी योजनाएं व KCC ऋण',
    pillar3Sub: 'किसान क्रेडिट कार्ड सीमा व DBT सहायता',
    pillar3Metric: '₹ 1,75,000',
    pillar3Detail: '4% ब्याज दर पर उपलब्ध ऋण सीमा',
    pillar3Action: 'योजनाएं देखें',

    pillar4Title: 'मंडी भाव व सीधा व्यापार',
    pillar4Sub: 'लाइव APMC दरें व सत्यापित मिल खरीदार',
    pillar4Metric: '₹ 2,680 / क्विंटल',
    pillar4Detail: 'गेहूं के भाव में इस सप्ताह ₹80 की बढ़त',
    pillar4Action: 'मंडी भाव देखें',

    // Market Opportunity
    marketOppTitle: 'मंडी में लाभकारी अवसर',
    marketOppBadge: 'ऊंझा मंडी में सत्यापित खरीदार',
    marketOppHeadline: 'श्री राम आटा मिल्स को 50 क्विंटल गेहूं की आवश्यकता',
    marketOppOffer: 'प्रस्तावित दर: ₹ 2,750 / क्विंटल (बाजार से +₹70 अधिक)',
    marketOppAction: 'खरीदार का अनुबंध देखें',

    // Weather & Disease
    weatherSummaryTitle: 'मौसम व छिड़काव अनुकूलता',
    weatherTemp: '28°C',
    weatherCondition: 'धूप व कृषि के लिए अनुकूल',
    weatherSprayWindow: 'छिड़काव का सही समय: अगले 24 घंटे (सोमवार की बारिश से पहले)',
    diseaseAlertTitle: 'नजदीकी गांव में रोग चेतावनी',
    diseaseAlertBadge: '4 किमी के भीतर',
    diseaseAlertText: 'पड़ोस के 3 खेतों में गेहूं का पीला रतुआ (Yellow Rust) देखा गया। आज ही पत्तों की जांच करें।',
    diseaseAlertAction: 'उपचार विधि देखें',

    // Recent Activity
    recentActivityTitle: 'खेत की हालिया गतिविधियां',
    activity1Title: 'पत्ता स्वास्थ्य जांच सफल: गेहूं HD-2967 स्वस्थ',
    activity1Time: 'आज, सुबह 08:30',
    activity2Title: 'PM-KISAN 16वीं किस्त (₹ 2,000) खाते में जमा',
    activity2Time: 'कल, शाम 04:15',
    activity3Title: 'मृदा नमी सेंसर अपडेट: 68% (अनुकूल)',
    activity3Time: 'कल, सुबह 10:00',

    // Common
    viewDetails: 'विवरण देखें',
    close: 'बंद करें',
    refresh: 'ताज़ा करें',
    allCrops: 'सभी फसलें',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('harvestguard_lang');
      return saved === 'hi' ? 'hi' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('harvestguard_lang', lang);
    } catch {
      // storage unavailable
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// oxlint-disable-next-line react/only-export-components
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
