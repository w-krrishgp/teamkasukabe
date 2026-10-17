import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Scale,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
  Database,
  LayoutGrid,
  TableProperties,
} from 'lucide-react';
import {
  calculateDistressSellingOptions,
  type DistressSellingInputs,
  type OptionAnalysis,
} from '@/features/distressSelling';
import { SAMPLE_SCENARIOS, type SampleScenario } from '@/features/distressSelling/sampleScenarios';
import { distressSellingService } from '@/features/distressSelling/distressSellingService';
import { ComparisonCard } from '@/features/distressSelling/components/ComparisonCard';
import { NetProceedsBreakdownModal } from '@/features/distressSelling/components/NetProceedsBreakdownModal';
import { EnquiryBookingModal } from '@/features/distressSelling/components/EnquiryBookingModal';
import { FormulaDocumentationModal } from '@/features/distressSelling/components/FormulaDocumentationModal';
import { ScenarioSelector } from '@/features/distressSelling/components/ScenarioSelector';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

export const NoDistressSellingPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const isHi = language === 'hi';

  // Scenario & Input State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SAMPLE_SCENARIOS[0].id);
  const [inputs, setInputs] = useState<DistressSellingInputs>(SAMPLE_SCENARIOS[0].inputs);
  const [isInputAccordionOpen, setIsInputAccordionOpen] = useState(false);

  // Toggle States
  const [viewMetric, setViewMetric] = useState<'total' | 'rate'>('total');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');

  // Active Modals
  const [selectedBreakdownOption, setSelectedBreakdownOption] = useState<OptionAnalysis | null>(null);
  const [selectedEnquiryOption, setSelectedEnquiryOption] = useState<OptionAnalysis | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  // Data Freshness & Source metadata
  const dataSourceStatus = useMemo(() => distressSellingService.getDataSourceStatus(), []);

  // Compute Engine Result
  const engineResult = useMemo(() => {
    return calculateDistressSellingOptions(inputs);
  }, [inputs]);

  // Handle Scenario Switch
  const handleSelectScenario = (scenario: SampleScenario) => {
    setSelectedScenarioId(scenario.id);
    setInputs(scenario.inputs);
  };

  // Update specific input fields
  const handleInputChange = <K extends keyof DistressSellingInputs>(
    key: K,
    val: DistressSellingInputs[K]
  ) => {
    setInputs((prev) => {
      const updated = { ...prev, [key]: val };
      distressSellingService.saveInputs(updated);
      return updated;
    });
  };

  const currentScenario = SAMPLE_SCENARIOS.find((s) => s.id === selectedScenarioId);

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-150">
      {/* 1. Header Banner & Data Freshness Indicator */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-primary/20 rounded-xl text-[11px] text-harvest-deep">
          <div className="flex items-center space-x-1.5 truncate">
            <Database className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
            <span className="font-medium truncate">
              {isHi
                ? 'डेमो मोड: सत्यापित e-NAM APMC गुजरात व महाराष्ट्र मानक डेटा'
                : dataSourceStatus.sourceLabel}
            </span>
          </div>
          <span className="font-bold text-[10px] text-harvest-primary shrink-0">
            {dataSourceStatus.lastUpdated}
          </span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Scale className="w-5 h-5 text-harvest-primary" />
              </span>
              <div>
                <h1 className="text-lg font-black text-harvest-deep tracking-tight">
                  {isHi ? 'मजबूरी में बिक्री रोकथाम इंजन' : 'No Distress Selling Engine'}
                </h1>
                <p className="text-xs text-stone-600 font-medium">
                  {isHi
                    ? 'तुरंत नकद, भंडारण, सीधे मिल खरीदार व किसान पूलिंग का शुद्ध आय तुलनात्मक विश्लेषण'
                    : 'Real net returns comparison across immediate cash, storage, direct buyers & pooling'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Bilingual Quick Toggle Button */}
            <div className="inline-flex p-0.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  language === 'en'
                    ? 'bg-harvest-primary text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  language === 'hi'
                    ? 'bg-harvest-primary text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Formula Inspection Button */}
            <button
              onClick={() => setIsFormulaModalOpen(true)}
              className="p-1.5 px-2.5 rounded-xl bg-white border border-stone-200 hover:border-harvest-primary/50 text-harvest-deep text-xs font-bold flex items-center space-x-1 shadow-xs transition-all active:scale-95"
              title={isHi ? 'गणितीय सूत्र देखें' : 'Inspect Mathematical Formulas'}
            >
              <BookOpen className="w-3.5 h-3.5 text-harvest-primary" />
              <span className="hidden sm:inline">{isHi ? 'सूत्र' : 'Formula'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Pre-Configured Sample Scenarios */}
      <ScenarioSelector
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
      />

      {/* Current Scenario Context Callout */}
      {currentScenario && (
        <div className="bg-stone-50 border border-stone-200/80 rounded-2xl p-3 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-harvest-primary shrink-0 mt-0.5" />
          <div className="text-xs text-stone-700">
            <span className="font-bold text-harvest-deep">
              {isHi
                ? currentScenario.id === 'wheat-mehsana'
                  ? 'ऊंझा APMC में भारी आवक के कारण मंदी बनाम 90-दिन वेयरहाउस होल्डिंग'
                  : currentScenario.id === 'tomato-nashik'
                  ? 'नाशवान टमाटर ₹650 की मजबूरी बिक्री बनाम फ़ूड प्रोसेसिंग ₹1,250'
                  : currentScenario.id === 'potato-agra'
                  ? 'आलू खुदाई पीक ₹780 बनाम 120-दिन कोल्ड स्टोरेज ₹1,420'
                  : 'मंडी दर ₹5,150 बनाम सीधे तेल मिलर ₹5,480'
                : currentScenario.tagline}
            </span>
            <p className="text-stone-600 mt-0.5 leading-relaxed text-[11px]">
              {isHi
                ? currentScenario.id === 'wheat-mehsana'
                  ? 'स्थानीय आढ़ती भारी आवक के चलते ₹2,450 का भाव दे रहे हैं।'
                  : currentScenario.id === 'tomato-nashik'
                  ? 'गांव के बिचौलिए खेत पर ₹650/क्विंटल का मजबूरी भाव थोप रहे हैं।'
                  : currentScenario.id === 'potato-agra'
                  ? 'कोल्ड स्टोर भर रहे हैं और बिचौलिए खेत पर ₹780 की कम बोली लगा रहे हैं।'
                  : 'स्थानीय APMC में मामूली नमी कटौती के कारण मॉडल भाव से ₹200 कम मिल रहे हैं।'
                : currentScenario.distressContext}
            </p>
          </div>
        </div>
      )}

      {/* 3. Top Recommendation Verdict Banner */}
      <div className="bg-gradient-to-br from-[#1b3b2b] via-[#142318] to-[#1e4532] text-white p-4 rounded-3xl shadow-md border border-emerald-900/60 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-harvest-pale text-harvest-deep">
              <Sparkles className="w-3 h-3 text-harvest-primary inline" />
              <span>
                {isHi
                  ? `अनुशंसित रणनीति: ${
                      engineResult.recommendedOption.id === 'store_and_sell_later'
                        ? 'भंडारण करें व बाद में बेचें'
                        : engineResult.recommendedOption.id === 'crop_pooling'
                        ? 'किसान पूलिंग में जुड़ें'
                        : engineResult.recommendedOption.id === 'alternative_buyer'
                        ? 'वैकल्पिक खरीदार को बेचें'
                        : 'तुरंत बेचें'
                    }`
                  : `Recommended Strategy: ${engineResult.recommendedOption.title}`}
              </span>
            </span>
            <div className="text-2xl font-black tracking-tight text-white mt-1">
              {formatCurrency(engineResult.recommendedOption.netProceeds)}
            </div>
            <p className="text-xs text-emerald-100/90 font-medium">
              {isHi ? 'शुद्ध प्राप्त दर: ' : 'Net Realized Rate: '}₹
              {engineResult.recommendedOption.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl
            </p>
          </div>

          <div className="text-right">
            {engineResult.maxNetGainVsDistress > 0 ? (
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20">
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">
                  {isHi ? 'अतिरिक्त शुद्ध मुनाफा' : 'Net Gain vs Distress'}
                </span>
                <span className="text-base font-black text-emerald-300">
                  +₹{engineResult.maxNetGainVsDistress.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] block text-emerald-200 font-semibold">
                  (+{engineResult.recommendedOption.netGainPercentageVsImmediate}%)
                </span>
              </div>
            ) : (
              <div className="bg-white/10 px-3 py-1.5 rounded-2xl">
                <span className="text-[10px] text-stone-300 block">
                  {isHi ? 'नकद लाभ' : 'Immediate Advantage'}
                </span>
                <span className="text-xs font-bold text-white">
                  {isHi ? 'सुरक्षित नकद' : 'Safe Cash Choice'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Why this option is recommended */}
        <div className="mt-3 pt-3 border-t border-emerald-800/60 text-xs text-emerald-100 leading-relaxed">
          <span className="font-bold text-white mr-1">
            {isHi ? 'सिफारिश का आधार:' : 'Why Recommended:'}
          </span>
          {engineResult.recommendedOption.whyRecommended}
        </div>

        {/* Storage Break-Even Threshold Callout */}
        <div className="mt-3 p-2.5 bg-black/25 rounded-xl border border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] text-stone-200">
              {isHi
                ? 'भंडारण ब्रेक-ईवन न्यूनतम लक्ष्य भाव:'
                : 'Storage Break-Even Target Price:'}
            </span>
          </div>
          <span className="font-extrabold text-white text-[12px]">
            ₹{engineResult.breakEvenFuturePriceForStorage.toLocaleString('en-IN')} / Qtl
          </span>
        </div>
      </div>

      {/* Warning Alert if Shelf-Life Exceeded */}
      {engineResult.storageFeasibility.isShelfLifeExceeded && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold block">
              {isHi ? 'उच्च सड़न जोखिम चेतावनी!' : 'High Spoilage Risk Warning'}
            </span>
            <p className="mt-0.5 text-red-800 leading-relaxed text-[11px]">
              {isHi
                ? `नियोजित भंडारण अवधि (${inputs.storageOptions.plannedHoldingDays} दिन) फसल की शेल्फ लाइफ (${inputs.shelfLifeDays} दिन) से ${engineResult.storageFeasibility.excessDays} दिन अधिक है। माल बिकने से पहले खराब हो जाएगा। भंडारण अनुशंसित नहीं है।`
                : `Planned holding duration of ${inputs.storageOptions.plannedHoldingDays} days exceeds crop shelf life of ${inputs.shelfLifeDays} days by ${engineResult.storageFeasibility.excessDays} days. Produce will spoil before planned sale. Storage is not recommended.`}
            </p>
          </div>
        </div>
      )}

      {/* 4. Farmer Inputs Accordion with Modern Toggle Switch */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <button
          onClick={() => setIsInputAccordionOpen(!isInputAccordionOpen)}
          className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-harvest-primary" />
            <div className="text-left">
              <span className="text-xs font-black text-harvest-deep block">
                {isHi ? 'किसान इनपुट व लागत पैरामीटर' : 'Farmer Custom Inputs & Parameters'}
              </span>
              <span className="text-[10px] text-stone-500 font-medium">
                {inputs.quantityQuintals} Qtl {inputs.cropName} • {isHi ? 'तुरंत भाव: ' : 'Immediate Offer: '}₹
                {inputs.immediateOffer.pricePerQuintal}/Qtl
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-harvest-primary">
              {isInputAccordionOpen ? (isHi ? 'छिपाएं' : 'Hide') : (isHi ? 'संपादित करें' : 'Edit Inputs')}
            </span>
            {isInputAccordionOpen ? (
              <ChevronUp className="w-4 h-4 text-stone-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-500" />
            )}
          </div>
        </button>

        {isInputAccordionOpen && (
          <div className="p-4 pt-1 border-t border-stone-100 space-y-4 text-xs">
            {/* Row 1: Crop and Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'फसल का नाम' : 'Crop Name'}
                </label>
                <input
                  type="text"
                  value={inputs.cropName}
                  onChange={(e) => handleInputChange('cropName', e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'मात्रा (क्विंटल)' : 'Quantity (Quintals)'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={inputs.quantityQuintals}
                  onChange={(e) =>
                    handleInputChange('quantityQuintals', Math.max(1, Number(e.target.value)))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'शेल्फ लाइफ (दिन)' : 'Shelf Life (Days)'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={inputs.shelfLifeDays}
                  onChange={(e) =>
                    handleInputChange('shelfLifeDays', Math.max(1, Number(e.target.value)))
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30"
                />
              </div>
            </div>

            {/* Row 2: Immediate Local Offer */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-extrabold text-stone-800 text-[11px] uppercase tracking-wide block">
                {isHi ? 'विकल्प 1: तुरंत नकद भाव पैरामीटर' : 'Option 1: Immediate Cash Offer Parameters'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'प्रस्तावित भाव (₹/क्विंटल)' : 'Offered Price (₹ / Qtl)'}
                  </label>
                  <input
                    type="number"
                    value={inputs.immediateOffer.pricePerQuintal}
                    onChange={(e) =>
                      handleInputChange('immediateOffer', {
                        ...inputs.immediateOffer,
                        pricePerQuintal: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'खरीदार की दूरी (किमी)' : 'Buyer Distance (km)'}
                  </label>
                  <input
                    type="number"
                    value={inputs.immediateOffer.distanceKm}
                    onChange={(e) =>
                      handleInputChange('immediateOffer', {
                        ...inputs.immediateOffer,
                        distanceKm: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'मंडी सेस / टैक्स (%)' : 'Mandi Cess (% fee)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.immediateOffer.mandiCommissionPercent}
                    onChange={(e) =>
                      handleInputChange('immediateOffer', {
                        ...inputs.immediateOffer,
                        mandiCommissionPercent: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Storage Options */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-extrabold text-stone-800 text-[11px] uppercase tracking-wide block">
                {isHi ? 'विकल्प 2: भंडारण पैरामीटर' : 'Option 2: Storage Holding Parameters'}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'होल्डिंग अवधि (दिन)' : 'Holding Duration (Days)'}
                  </label>
                  <input
                    type="number"
                    value={inputs.storageOptions.plannedHoldingDays}
                    onChange={(e) =>
                      handleInputChange('storageOptions', {
                        ...inputs.storageOptions,
                        plannedHoldingDays: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'मासिक किराया (₹/क्विंटल)' : 'Monthly Rent (₹/Qtl/mo)'}
                  </label>
                  <input
                    type="number"
                    value={inputs.storageOptions.monthlyRentPerQuintal}
                    onChange={(e) =>
                      handleInputChange('storageOptions', {
                        ...inputs.storageOptions,
                        monthlyRentPerQuintal: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'अपेक्षित भविष्य भाव' : 'Projected Future Price'}
                  </label>
                  <input
                    type="number"
                    value={inputs.storageOptions.expectedFuturePricePerQuintal}
                    onChange={(e) =>
                      handleInputChange('storageOptions', {
                        ...inputs.storageOptions,
                        expectedFuturePricePerQuintal: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white font-bold text-harvest-primary"
                  />
                </div>

                <div>
                  <label className="font-medium text-stone-600 block mb-1">
                    {isHi ? 'मासिक वजन कमी (%)' : 'Monthly Shrinkage (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.storageOptions.spoilageRatePercentPerMonth}
                    onChange={(e) =>
                      handleInputChange('storageOptions', {
                        ...inputs.storageOptions,
                        spoilageRatePercentPerMonth: Number(e.target.value),
                      })
                    }
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Row 4: Modern Tactile Toggle Switch for KCC 4% Finance Opportunity Cost */}
            <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 transition-colors">
              <div className="pr-4">
                <span className="font-extrabold text-emerald-950 block text-xs">
                  {isHi
                    ? 'किसान क्रेडिट कार्ड (KCC) 4% वार्षिक पूंजी रुकावट ब्याज जोड़ें'
                    : 'Include Kisan Credit Card (KCC) 4% p.a. Holding Opportunity Cost'}
                </span>
                <span className="text-[11px] text-emerald-800">
                  {isHi
                    ? 'भंडारण के दौरान रोके गए माल के मूल्य पर रियायती ब्याज की वास्तविक गणना करता है'
                    : 'Accounts for interest on blocked harvest capital during storage duration'}
                </span>
              </div>

              {/* Styled iOS/Android Toggle Switch Button */}
              <button
                type="button"
                role="switch"
                aria-checked={inputs.isKccFinanceEnabled}
                onClick={() =>
                  handleInputChange('isKccFinanceEnabled', !inputs.isKccFinanceEnabled)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-harvest-primary focus:ring-offset-2 ${
                  inputs.isKccFinanceEnabled ? 'bg-harvest-primary' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    inputs.isKccFinanceEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Four Pathways Controls: Metric Toggle & View Mode Toggle */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-extrabold text-harvest-deep uppercase tracking-wide">
              {isHi ? 'चार निर्णय मार्ग' : 'Four Decision Pathways'}
            </h2>
            <span className="text-[11px] text-stone-500 font-medium">
              {isHi ? 'किसान के शुद्ध मुनाफे के आधार पर क्रमबद्ध' : 'Sorted by Highest Farmer Net Return'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Metric Display Toggle: Total vs Rate */}
            <div className="inline-flex p-0.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMetric('total')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  viewMetric === 'total'
                    ? 'bg-harvest-primary text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isHi ? '₹ कुल शुद्ध' : '₹ Total Net'}
              </button>
              <button
                type="button"
                onClick={() => setViewMetric('rate')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  viewMetric === 'rate'
                    ? 'bg-harvest-primary text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {isHi ? '₹ / क्विंटल दर' : '₹ / Qtl Rate'}
              </button>
            </div>

            {/* View Mode Toggle: Cards vs Matrix Table */}
            <div className="inline-flex p-0.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`p-1 px-2 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  viewMode === 'cards'
                    ? 'bg-white text-harvest-deep shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title={isHi ? 'कार्ड दृश्य' : 'Cards View'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHi ? 'कार्ड्स' : 'Cards'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`p-1 px-2 rounded-lg font-bold transition-all flex items-center space-x-1 ${
                  viewMode === 'matrix'
                    ? 'bg-white text-harvest-deep shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title={isHi ? 'तुलनात्मक तालिका दृश्य' : 'Comparison Matrix Table'}
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isHi ? 'मैट्रिक्स' : 'Matrix'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Cards View */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {engineResult.rankedOptions.map((option) => (
              <ComparisonCard
                key={option.id}
                option={option}
                viewMetric={viewMetric}
                onOpenBreakdown={(opt) => setSelectedBreakdownOption(opt)}
                onOpenEnquiry={(opt) => setSelectedEnquiryOption(opt)}
              />
            ))}
          </div>
        ) : (
          /* View Mode 2: Transparent Comparison Matrix Table */
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-[11px] uppercase tracking-wider">
                    <th className="p-3">{isHi ? 'विकल्प मार्ग' : 'Option Pathway'}</th>
                    <th className="p-3 text-right">{isHi ? 'सकल राजस्व' : 'Gross Revenue'}</th>
                    <th className="p-3 text-right">{isHi ? 'कुल कटौतियां' : 'Total Deductions'}</th>
                    <th className="p-3 text-right">{isHi ? 'शुद्ध प्राप्त दर' : 'Net Rate'}</th>
                    <th className="p-3 text-right">{isHi ? 'खाते में शुद्ध' : 'Net In Pocket'}</th>
                    <th className="p-3 text-center">{isHi ? 'कार्रवाई' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {engineResult.rankedOptions.map((opt) => (
                    <tr
                      key={opt.id}
                      className={opt.isRecommended ? 'bg-emerald-50/50 font-semibold' : 'hover:bg-stone-50'}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-1.5">
                          {opt.isRecommended && (
                            <span className="w-2 h-2 rounded-full bg-harvest-primary" />
                          )}
                          <span className="font-extrabold text-harvest-deep">{opt.title}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 block truncate max-w-[150px]">
                          {opt.subtitle}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatCurrency(opt.grossRevenue)}
                      </td>
                      <td className="p-3 text-right font-medium text-red-600">
                        -₹{opt.costs.totalCosts.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-right font-bold text-harvest-primary">
                        ₹{opt.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl
                      </td>
                      <td className="p-3 text-right font-black text-harvest-deep text-sm">
                        {formatCurrency(opt.netProceeds)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedBreakdownOption(opt)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 font-bold text-[11px] text-harvest-deep transition-colors"
                        >
                          {isHi ? 'विवरण' : 'Details'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 6. Statutory Disclaimer & Transparency Footer */}
      <div className="p-4 bg-stone-100 rounded-2xl border border-stone-200/80 text-[11px] text-stone-600 space-y-2">
        <div className="flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-extrabold text-stone-800 block">
              {isHi
                ? 'हार्वेस्टगार्ड संकटकालीन बिक्री रोकथाम सलाहकारी घोषणा'
                : 'HarvestGuard No Distress Selling Advisory Disclaimer'}
            </span>
            <p className="mt-0.5 text-stone-600">
              {isHi
                ? 'यह गणना गणितीय लागत मॉडल, APMC मंडी मूल्य संकेतकों और अधिकृत वेयरहाउस शुल्कों पर आधारित निर्णय समर्थन उपकरण है। भविष्य की कीमतें मौसम व बाजार आवक के अधीन हैं तथा मंच द्वारा गारंटीकृत नहीं हैं।'
                : 'Calculations are strictly decision support guidance based on mathematical cost models, prevailing APMC price indicators, and accredited warehouse tariffs. Future prices are subject to seasonal market dynamics and are neither guaranteed nor insured by the platform. Buyer acceptance is contingent upon physical moisture, dockage, and quality verification at weighbridge.'}
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <NetProceedsBreakdownModal
        option={selectedBreakdownOption}
        onClose={() => setSelectedBreakdownOption(null)}
      />

      <EnquiryBookingModal
        option={selectedEnquiryOption}
        cropName={inputs.cropName}
        quantityQuintals={inputs.quantityQuintals}
        onClose={() => setSelectedEnquiryOption(null)}
      />

      {isFormulaModalOpen && (
        <FormulaDocumentationModal onClose={() => setIsFormulaModalOpen(false)} />
      )}
    </div>
  );
};

export default NoDistressSellingPage;
