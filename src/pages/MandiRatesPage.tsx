import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Store,
} from 'lucide-react';
import {
  SearchInput,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';

export const MandiRatesPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [search, setSearch] = useState('');

  const mandiData: Record<
    string,
    Array<{
      mandi: string;
      district: string;
      modalRate: number;
      minRate: number;
      maxRate: number;
      change: string;
      distance: string;
      arrival: string;
      isBestPrice?: boolean;
    }>
  > = {
    wheat: [
      {
        mandi: 'Unjha APMC',
        district: 'Mehsana',
        modalRate: 2750,
        minRate: 2620,
        maxRate: 2840,
        change: '+₹70 (2.6%)',
        distance: '18 km',
        arrival: '1,450 Qtl',
        isBestPrice: true,
      },
      {
        mandi: 'Mehsana Main APMC',
        district: 'Mehsana',
        modalRate: 2680,
        minRate: 2550,
        maxRate: 2720,
        change: '+₹40 (1.5%)',
        distance: '6 km',
        arrival: '2,100 Qtl',
      },
      {
        mandi: 'Kadi Yard',
        district: 'Mehsana',
        modalRate: 2660,
        minRate: 2540,
        maxRate: 2700,
        change: '+₹25 (0.9%)',
        distance: '24 km',
        arrival: '980 Qtl',
      },
      {
        mandi: 'Patan APMC',
        district: 'Patan',
        modalRate: 2710,
        minRate: 2600,
        maxRate: 2760,
        change: '+₹50 (1.8%)',
        distance: '38 km',
        arrival: '1,120 Qtl',
      },
    ],
    mustard: [
      {
        mandi: 'Unjha APMC',
        district: 'Mehsana',
        modalRate: 5450,
        minRate: 5200,
        maxRate: 5620,
        change: '+₹110 (2.1%)',
        distance: '18 km',
        arrival: '850 Qtl',
        isBestPrice: true,
      },
      {
        mandi: 'Mehsana Main APMC',
        district: 'Mehsana',
        modalRate: 5380,
        minRate: 5150,
        maxRate: 5500,
        change: '+₹60 (1.1%)',
        distance: '6 km',
        arrival: '1,300 Qtl',
      },
    ],
    cumin: [
      {
        mandi: 'Unjha APMC (Asia Largest)',
        district: 'Mehsana',
        modalRate: 28400,
        minRate: 26500,
        maxRate: 30200,
        change: '+₹650 (2.3%)',
        distance: '18 km',
        arrival: '3,800 Qtl',
        isBestPrice: true,
      },
      {
        mandi: 'Rajkot APMC',
        district: 'Rajkot',
        modalRate: 27900,
        minRate: 26000,
        maxRate: 29500,
        change: '+₹400 (1.4%)',
        distance: '185 km',
        arrival: '2,200 Qtl',
      },
    ],
  };

  const currentRates = mandiData[selectedCrop] || mandiData.wheat;
  const filtered = currentRates.filter(
    (m) =>
      m.mandi.toLowerCase().includes(search.toLowerCase()) ||
      m.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-harvest-deep transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
          e-NAM Live APMC Feed
        </span>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-extrabold text-harvest-deep flex items-center space-x-2">
          <Store className="w-5 h-5 text-harvest-primary" />
          <span>{language === 'hi' ? 'लाइव मंडी भाव व व्यापार अवसर' : 'Live APMC Mandi Rates & Trends'}</span>
        </h1>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'सत्यापित न्यूनतम, मॉडल और अधिकतम भाव। सबसे लाभकारी मंडी में बेचें।'
            : 'Live modal prices across regional APMCs with automated net profit arbitrage.'}
        </p>
      </div>

      {/* Commodity Selector Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'wheat', label: language === 'hi' ? 'गेहूं (Wheat)' : 'Wheat (Sharbati)' },
          { id: 'mustard', label: language === 'hi' ? 'सरसों (Mustard)' : 'Mustard (Rayda)' },
          { id: 'cumin', label: language === 'hi' ? 'जीरा (Cumin)' : 'Cumin (Jeera)' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCrop(c.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCrop === c.id
                ? 'bg-harvest-primary text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Arbitrage Opportunity Callout */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1b3b2b] to-[#122b1c] text-white shadow-md space-y-2 border border-emerald-900/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
            {language === 'hi' ? 'मुनाफा अवसर (+₹70/क्विंटल)' : 'Mandi Arbitrage Opportunity'}
          </span>
          <span className="text-xs font-bold text-emerald-300 flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            <span>Unjha APMC</span>
          </span>
        </div>

        <p className="text-xs text-emerald-100 font-medium leading-relaxed">
          {language === 'hi'
            ? 'स्थानीय मेहसाणा मंडी के मुकाबले ऊंझा मंडी में बेचने पर 50 क्विंटल गेहूं पर ₹ 3,500 अतिरिक्त लाभ (भाड़ा काटकर)।'
            : 'Selling 50 Quintals in Unjha over Mehsana yields +₹ 3,500 net additional margin, accounting for ₹ 40/Qtl tractor transport.'}
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
          <span className="text-emerald-200/80 text-[11px]">Freight: 18 km (~₹ 450 total)</span>
          <button
            onClick={() => alert('e-NAM Digital Gate Pass Booking initiated')}
            className="text-xs font-bold text-white underline hover:text-emerald-200"
          >
            Book Gate Pass →
          </button>
        </div>
      </div>

      {/* Search Input */}
      <SearchInput
        placeholder={language === 'hi' ? 'मंडी या जिले का नाम खोजें...' : 'Filter mandis (e.g. Unjha, Patan)...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-white"
      />

      {/* Mandi Rate Cards */}
      <div className="space-y-2.5">
        {filtered.map((m, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border bg-white shadow-xs space-y-2.5 ${
              m.isBestPrice
                ? 'border-emerald-500/80 ring-1 ring-emerald-500/40 bg-emerald-50/20'
                : 'border-stone-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-extrabold text-harvest-deep">{m.mandi}</h3>
                  {m.isBestPrice && (
                    <span className="text-[10px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                      Best Price
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-500 flex items-center space-x-2 mt-0.5">
                  <span>{m.district} District</span>
                  <span>•</span>
                  <span>{m.distance} away</span>
                  <span>•</span>
                  <span>{m.arrival}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-harvest-deep">
                  ₹ {m.modalRate.toLocaleString()}
                </span>
                <span className="block text-[10px] font-bold text-emerald-700">
                  {m.change}
                </span>
              </div>
            </div>

            {/* Min / Max Range Bar */}
            <div className="p-2 bg-[#F9FAF8] rounded-xl border border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>
                <strong className="text-stone-500 font-normal">Min:</strong> ₹ {m.minRate.toLocaleString()}
              </span>
              <span className="font-bold text-harvest-primary">
                Modal: ₹ {m.modalRate.toLocaleString()}
              </span>
              <span>
                <strong className="text-stone-500 font-normal">Max:</strong> ₹ {m.maxRate.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
