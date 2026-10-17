import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CloudSun,
  Droplets,
  TrendingUp,
  Coins,
  Camera,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  BrainCircuit,
  Store,
  Gauge,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  X,
  Info,
  Building2,
  Scale,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
} from '@/components/common';
import {
  MOCK_FARMER_PROFILE,
  MOCK_WEATHER,
} from '@/services/supabase';
import { useLanguage } from '@/context/LanguageContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isKhetScoreOpen, setIsKhetScoreOpen] = useState(false);
  const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Demonstration Data Banner */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">{t('demoBadge')}</span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center space-x-1 text-harvest-primary font-semibold hover:underline shrink-0 ml-2"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{t('refresh')}</span>
        </button>
      </div>

      {/* 1. Greeting & Compact Farm Overview Card */}
      <section
        aria-label="Farm Overview"
        className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm relative overflow-hidden"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-harvest-primary bg-harvest-pale px-2 py-0.5 rounded-md border border-harvest-sage/30">
                {t('seasonStatus')}
              </span>
              <span className="text-[11px] text-stone-500">• {t('kisanId')}: {MOCK_FARMER_PROFILE.kisanId}</span>
            </div>
            <h1 className="text-xl font-extrabold text-harvest-deep mt-1 tracking-tight">
              {t('greetingMorning')}, {MOCK_FARMER_PROFILE.fullName}
            </h1>
            <p className="text-xs text-stone-600 mt-0.5">
              {MOCK_FARMER_PROFILE.village}, {MOCK_FARMER_PROFILE.district} ({MOCK_FARMER_PROFILE.state})
            </p>
          </div>

          {/* Khet Score mini circle */}
          <button
            onClick={() => setIsKhetScoreOpen(true)}
            className="flex flex-col items-center bg-[#F8FAF6] p-2 rounded-2xl border border-stone-200 hover:border-harvest-primary/50 transition-all text-center group active:scale-95"
            title="View Khet Score Breakdown"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-100/80 border-2 border-emerald-600 flex items-center justify-center text-emerald-900 font-extrabold text-sm shadow-xs group-hover:scale-105 transition-transform">
              88
            </div>
            <span className="text-[10px] font-bold text-harvest-deep mt-1 flex items-center">
              <span>{t('actionKhetScore')}</span>
            </span>
          </button>
        </div>

        {/* Compact Key Farm Metrics Grid */}
        <div className="mt-3.5 pt-3 border-t border-stone-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-200/60">
            <span className="text-[10px] text-stone-500 block font-medium">{t('totalArea')}</span>
            <p className="text-sm font-extrabold text-harvest-deep mt-0.5">5.5 {t('acres')}</p>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Sown</span>
          </div>

          <div className="bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-200/60">
            <span className="text-[10px] text-stone-500 block font-medium">{t('activeCrops')}</span>
            <p className="text-sm font-extrabold text-harvest-deep mt-0.5">3 Crops</p>
            <span className="text-[10px] text-stone-600 truncate block">Wheat, Mustard</span>
          </div>

          <div className="bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-200/60">
            <span className="text-[10px] text-stone-500 block font-medium">{t('soilHealth')}</span>
            <p className="text-sm font-extrabold text-emerald-800 mt-0.5">68%</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
          </div>
        </div>
      </section>

      {/* 2. Quick Field Actions (Large touch targets, clear icons + labels) */}
      <section aria-label="Quick Actions" className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {t('quickActionsTitle')}
          </h2>
          <span className="text-[10px] text-stone-500">Android Optimized</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Action 1: Scan Leaf */}
          <button
            onClick={() => navigate('/disease-scanner')}
            className="flex items-center space-x-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-xs text-left hover:border-harvest-primary active:scale-[0.98] transition-all group min-h-[64px]"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-harvest-deep truncate">{t('actionScanLeaf')}</p>
              <p className="text-[10px] text-stone-500 mt-0.5">{t('actionScanLeafDesc')}</p>
            </div>
          </button>

          {/* Action 2: Check Weather */}
          <button
            onClick={() => navigate('/weather')}
            className="flex items-center space-x-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-xs text-left hover:border-harvest-primary active:scale-[0.98] transition-all group min-h-[64px]"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CloudSun className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-harvest-deep truncate">{t('actionCheckWeather')}</p>
              <p className="text-[10px] text-stone-500 mt-0.5">{t('actionCheckWeatherDesc')}</p>
            </div>
          </button>

          {/* Action 3: Check Market Prices */}
          <button
            onClick={() => navigate('/mandi-rates')}
            className="flex items-center space-x-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-xs text-left hover:border-harvest-primary active:scale-[0.98] transition-all group min-h-[64px]"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-harvest-deep truncate">{t('actionCheckMarket')}</p>
              <p className="text-[10px] text-stone-500 mt-0.5">{t('actionCheckMarketDesc')}</p>
            </div>
          </button>

          {/* Action 4: Khet Score */}
          <button
            onClick={() => navigate('/khet-score')}
            className="flex items-center space-x-3 p-3 bg-white border border-stone-200 rounded-2xl shadow-xs text-left hover:border-harvest-primary active:scale-[0.98] transition-all group min-h-[64px]"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-harvest-deep truncate">{t('actionKhetScore')}</p>
              <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">{t('actionKhetScoreDesc')}</p>
            </div>
          </button>
        </div>
      </section>

      {/* 3. Weather Summary & Nearby Disease Alerts */}
      <section aria-label="Weather & Disease Warnings" className="space-y-2.5">
        {/* Weather Card */}
        <Card variant="default" className="border-stone-200">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
                <CloudSun className="w-4 h-4 text-amber-600" />
                <span>{t('weatherSummaryTitle')}</span>
              </CardTitle>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                {t('weatherCondition')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-1">
            <div className="grid grid-cols-3 gap-2 bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-200/60 text-center">
              <div>
                <span className="text-[10px] text-stone-500">Temperature</span>
                <p className="text-base font-extrabold text-harvest-deep mt-0.5">{MOCK_WEATHER.temperatureC}°C</p>
              </div>
              <div className="border-x border-stone-200">
                <span className="text-[10px] text-stone-500">Humidity</span>
                <p className="text-base font-extrabold text-harvest-deep mt-0.5">{MOCK_WEATHER.humidityPercent}%</p>
              </div>
              <div>
                <span className="text-[10px] text-stone-500">Wind</span>
                <p className="text-base font-extrabold text-harvest-deep mt-0.5">{MOCK_WEATHER.windSpeedKmh} km/h</p>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <p className="leading-snug">{t('weatherSprayWindow')}</p>
            </div>
          </CardContent>
        </Card>

        {/* Nearby Disease Alert Card */}
        <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3.5 shadow-xs flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5 text-amber-700" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-950">
                {t('diseaseAlertTitle')}
              </h3>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {t('diseaseAlertBadge')}
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              {t('diseaseAlertText')}
            </p>
            <button
              onClick={() => navigate('/disease-scanner')}
              className="text-xs font-bold text-amber-950 underline hover:text-black inline-flex items-center space-x-1 pt-1"
            >
              <span>{t('diseaseAlertAction')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Signature Feature Spotlight: No Distress Selling Decision Engine */}
      <section aria-label="No Distress Selling Feature">
        <div
          onClick={() => navigate('/no-distress-selling')}
          className="bg-gradient-to-br from-harvest-deep via-[#1a3826] to-[#12281a] text-white p-4 rounded-3xl shadow-md border-2 border-harvest-primary/40 relative overflow-hidden cursor-pointer hover:border-harvest-primary transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider uppercase bg-harvest-pale text-harvest-deep px-2.5 py-1 rounded-full shadow-xs">
              ★ Signature Decision Engine
            </span>
            <span className="text-xs font-black text-emerald-300 flex items-center space-x-1">
              <span>Prevent Glut Losses</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>

          <div className="mt-3 flex items-start space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 text-emerald-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white leading-snug">
                No Distress Selling Calculator
              </h3>
              <p className="text-xs text-emerald-100/90 mt-0.5 leading-relaxed">
                Compare Immediate Cash vs Cold Storage vs Direct Food Processors vs Village Crop Pooling before you sell.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-[11px] text-emerald-200">
              <span className="bg-white/10 px-2 py-0.5 rounded-md">Transparent Waterfall</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">Break-Even Math</span>
            </div>
            <span className="font-extrabold text-white text-xs underline group-hover:text-emerald-300 transition-colors">
              Open Engine →
            </span>
          </div>
        </div>
      </section>

      {/* 4. Prominent Market Opportunity Section */}
      <section aria-label="Market Opportunity">
        <div className="bg-gradient-to-br from-[#1b3b2b] via-[#142318] to-[#163524] text-white p-4 rounded-3xl shadow-md border border-emerald-900/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-1 rounded-full">
              {t('marketOppBadge')}
            </span>
            <span className="text-xs font-bold text-emerald-200 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>+₹ 70 / Qtl</span>
            </span>
          </div>

          <div className="mt-2.5 space-y-1">
            <h3 className="text-sm font-extrabold text-white leading-snug">
              {t('marketOppHeadline')}
            </h3>
            <p className="text-xs text-emerald-100/90 font-medium">
              {t('marketOppOffer')}
            </p>
            <p className="text-[11px] text-emerald-200/70 pt-0.5">
              Grade A Sharbati • Immediate payment via e-NAM direct bank transfer
            </p>
          </div>

          <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-harvest-deep font-bold hover:bg-stone-100 text-xs h-9 px-3"
              iconRight={<ArrowUpRight className="w-3.5 h-3.5" />}
              onClick={() => setIsOpportunityModalOpen(true)}
            >
              {t('marketOppAction')}
            </Button>
            <button
              onClick={() => navigate('/mandi-rates')}
              className="text-xs text-emerald-300 hover:text-white font-semibold underline"
            >
              All Mandi Rates →
            </button>
          </div>
        </div>
      </section>

      {/* 5. Four Clearly Distinguishable Pillar Cards */}
      <section aria-label="Four Pillars of Empowerment" className="space-y-2.5">
        <div className="px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {t('pillarsTitle')}
          </h2>
          <p className="text-[11px] text-stone-500">
            Core modules driving rural farm productivity and income
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Pillar 1: Crop Care & Health */}
          <div
            onClick={() => navigate('/farm-care')}
            className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-harvest-primary transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-harvest-deep group-hover:text-harvest-primary transition-colors">
                    {t('pillar1Title')}
                  </h3>
                  <p className="text-[11px] text-stone-500">{t('pillar1Sub')}</p>
                </div>
              </div>
              <StatusBadge variant="success" size="sm" showDot>
                {t('pillar1Metric')}
              </StatusBadge>
            </div>
            <div className="p-2.5 bg-[#F8FAF6] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600">{t('pillar1Detail')}</span>
              <span className="font-bold text-harvest-primary text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>{t('pillar1Action')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Pillar 2: Farm Intelligence */}
          <div
            onClick={() => navigate('/intelligence')}
            className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-harvest-primary transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-harvest-deep group-hover:text-harvest-primary transition-colors">
                    {t('pillar2Title')}
                  </h3>
                  <p className="text-[11px] text-stone-500">{t('pillar2Sub')}</p>
                </div>
              </div>
              <StatusBadge variant="info" size="sm">
                {t('pillar2Metric')}
              </StatusBadge>
            </div>
            <div className="p-2.5 bg-[#F8FAF6] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600">{t('pillar2Detail')}</span>
              <span className="font-bold text-harvest-primary text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>{t('pillar2Action')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Pillar 3: Money & Schemes */}
          <div
            onClick={() => navigate('/finance')}
            className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-harvest-primary transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-harvest-deep group-hover:text-harvest-primary transition-colors">
                    {t('pillar3Title')}
                  </h3>
                  <p className="text-[11px] text-stone-500">{t('pillar3Sub')}</p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                {t('pillar3Metric')}
              </span>
            </div>
            <div className="p-2.5 bg-[#F8FAF6] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600">{t('pillar3Detail')}</span>
              <span className="font-bold text-harvest-primary text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>{t('pillar3Action')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>

          {/* Pillar 4: Market Access */}
          <div
            onClick={() => navigate('/market')}
            className="p-4 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-harvest-primary transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-harvest-deep group-hover:text-harvest-primary transition-colors">
                    {t('pillar4Title')}
                  </h3>
                  <p className="text-[11px] text-stone-500">{t('pillar4Sub')}</p>
                </div>
              </div>
              <StatusBadge variant="earth" size="sm">
                {t('pillar4Metric')}
              </StatusBadge>
            </div>
            <div className="p-2.5 bg-[#F8FAF6] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-600">{t('pillar4Detail')}</span>
              <span className="font-bold text-harvest-primary text-xs flex items-center group-hover:translate-x-0.5 transition-transform">
                <span>{t('pillar4Action')}</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Recent Activity Section */}
      <section aria-label="Recent Activity" className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
          {t('recentActivityTitle')}
        </h2>

        <Card variant="warm">
          <div className="divide-y divide-stone-200/60 text-xs">
            <div className="p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-harvest-deep truncate">{t('activity1Title')}</p>
                <p className="text-[10px] text-stone-500 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{t('activity1Time')}</span>
                </p>
              </div>
            </div>

            <div className="p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Coins className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-harvest-deep truncate">{t('activity2Title')}</p>
                <p className="text-[10px] text-stone-500 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{t('activity2Time')}</span>
                </p>
              </div>
            </div>

            <div className="p-3 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-harvest-deep truncate">{t('activity3Title')}</p>
                <p className="text-[10px] text-stone-500 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-stone-400" />
                  <span>{t('activity3Time')}</span>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Khet Score Detail Modal */}
      {isKhetScoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-extrabold text-harvest-deep">
                  {language === 'hi' ? 'खेत स्कोर विश्लेषण (Khet Score)' : 'Khet Score Breakdown'}
                </h3>
              </div>
              <button
                onClick={() => setIsKhetScoreOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 border-4 border-emerald-600 flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-emerald-900 leading-none">88</span>
                <span className="text-[10px] font-bold text-emerald-700">/ 100</span>
              </div>
              <p className="text-xs font-bold text-emerald-900">
                {language === 'hi' ? 'मजबूत पैदावार व अनुकूल स्थिति' : 'Strong Season Potential'}
              </p>
              <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                {language === 'hi'
                  ? 'यह स्कोर उपग्रह वनस्पति घनत्व, मिट्टी की नमी, मौसम जोखिम और बाजार समय का समग्र सूचकांक है।'
                  : 'Computed from Sentinel NDVI canopy, soil moisture, micro-weather volatility and harvest price timing.'}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span>Crop Biomass & NDVI</span>
                <span className="font-extrabold text-emerald-800">92 / 100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span>Soil Moisture Stability</span>
                <span className="font-extrabold text-emerald-800">85 / 100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span>Micro-Climate Risk Buffer</span>
                <span className="font-extrabold text-emerald-800">88 / 100</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 flex justify-between items-center">
                <span>Market Timing Advantage</span>
                <span className="font-extrabold text-emerald-800">87 / 100</span>
              </div>
            </div>

            <Button
              size="md"
              variant="primary"
              fullWidth
              onClick={() => setIsKhetScoreOpen(false)}
            >
              {t('close')}
            </Button>
          </div>
        </div>
      )}

      {/* Market Opportunity Contract Sheet */}
      {isOpportunityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-harvest-primary" />
                <h3 className="text-sm font-extrabold text-harvest-deep">
                  {language === 'hi' ? 'खरीदार अनुबंध विवरण' : 'Verified Buyer Contract'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpportunityModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="font-extrabold text-emerald-950 text-sm">Shree Ram Flour Mills</p>
                <p className="text-[11px] text-emerald-800">APMC Registered Miller • License: GJ-MEH-4921</p>
                <p className="text-[11px] text-stone-600 mt-1">Location: Unjha Industrial Area (14 km from your farm)</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Required Quantity</span>
                  <p className="font-extrabold text-harvest-deep text-xs">50 Quintals</p>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 block">Offered Rate</span>
                  <p className="font-extrabold text-emerald-800 text-xs">₹ 2,750 / Qtl</p>
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <p className="font-semibold text-stone-800">Delivery Terms</p>
                <p className="text-[11px] text-stone-600">
                  Buyer provides farmgate pickup or ₹40/Qtl transport reimbursement if delivered to Unjha Mandi. Payment released within 24 hours of moisture testing.
                </p>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                size="md"
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setIsOpportunityModalOpen(false)}
              >
                {t('close')}
              </Button>
              <Button
                size="md"
                variant="primary"
                className="flex-1 text-xs"
                onClick={() => {
                  alert(language === 'hi' ? 'खरीदार से संपर्क अनुरोध भेजा गया!' : 'Direct buyer inquiry submitted!');
                  setIsOpportunityModalOpen(false);
                }}
              >
                {language === 'hi' ? 'अनुबंध स्वीकार करें' : 'Accept Opportunity'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
