import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  Share2,
  AlertTriangle,
  FileCheck,
  FileQuestion,
  CloudSun,
  TrendingUp,
  Info,
  SlidersHorizontal,
  RefreshCw,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import {
  calculateKhetAssessment,
  validateFarmAssessmentInput,
  FarmAssessmentInput,
  KhetAssessmentResult,
  KhetValidationResult,
  VERIFIED_HIGH_RESILIENCE_PROFILE,
  MISSING_DATA_PROFILE,
  CLIMATE_EXPOSED_PROFILE,
  UNVERIFIED_SELF_REPORTED_PROFILE,
  INVALID_TEST_PROFILE,
} from '@/features/khetScore';

export const KhetScorePage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Selected Profile state
  const [selectedProfileKey, setSelectedProfileKey] = useState<
    'verified' | 'missing_data' | 'climate' | 'unverified' | 'invalid'
  >('verified');

  // Working profile input (allows customization)
  const [currentInput, setCurrentInput] = useState<FarmAssessmentInput>(
    VERIFIED_HIGH_RESILIENCE_PROFILE
  );

  // Failure simulation trigger
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'all' | 'verified' | 'farmer_entered'>('all');
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  // Compute assessment with validation
  const validation: KhetValidationResult = validateFarmAssessmentInput(currentInput);
  const assessment: KhetAssessmentResult | null =
    validation.isValid && !simulateFailure
      ? calculateKhetAssessment(currentInput)
      : null;

  // Profile switcher handler
  const handleSelectProfile = (
    key: 'verified' | 'missing_data' | 'climate' | 'unverified' | 'invalid'
  ) => {
    setSelectedProfileKey(key);
    setSimulateFailure(false);

    switch (key) {
      case 'verified':
        setCurrentInput(VERIFIED_HIGH_RESILIENCE_PROFILE);
        break;
      case 'missing_data':
        setCurrentInput(MISSING_DATA_PROFILE);
        break;
      case 'climate':
        setCurrentInput(CLIMATE_EXPOSED_PROFILE);
        break;
      case 'unverified':
        setCurrentInput(UNVERIFIED_SELF_REPORTED_PROFILE);
        break;
      case 'invalid':
        setCurrentInput(INVALID_TEST_PROFILE);
        break;
    }
  };

  const handleShare = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-8 max-w-2xl mx-auto">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-harvest-deep transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>

        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center space-x-1">
          <Info className="w-3 h-3 text-emerald-700" />
          <span>{language === 'hi' ? 'कृषि परिचालन मूल्यांकन v2.5' : 'Farm Operational Index v2.5'}</span>
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-harvest-deep flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-harvest-primary" />
          <span>{language === 'hi' ? 'खेत स्कोर: कृषि स्थिरता आकलन' : 'Khet Score: Farm Operational Assessment'}</span>
        </h1>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'उत्पादन निरंतरता, मंडी बिक्री प्रमाण और मौसम जोखिम का पारदर्शी व व्याख्यात्मक विश्लेषण।'
            : 'Explainable agricultural resilience & operational discipline. Not an official credit bureau score.'}
        </p>
      </div>

      {/* Interactive Profile Testing Suite */}
      <div className="p-3 bg-stone-100 border border-stone-200 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-harvest-primary" />
            <span>{language === 'hi' ? 'परीक्षण प्रोफ़ाइल चुनें:' : 'Test Farm Profiles & Workflows:'}</span>
          </span>
          <button
            onClick={() => setShowCustomEditor(!showCustomEditor)}
            className="text-[11px] text-harvest-primary hover:underline font-semibold"
          >
            {showCustomEditor
              ? (language === 'hi' ? 'संपादक बंद करें' : 'Hide Custom Editor')
              : (language === 'hi' ? 'कस्टम डेटा बदलें' : 'Edit Input Values')}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => handleSelectProfile('verified')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedProfileKey === 'verified' && !simulateFailure
                ? 'bg-harvest-primary text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Verified Multi-Season
          </button>

          <button
            onClick={() => handleSelectProfile('missing_data')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedProfileKey === 'missing_data' && !simulateFailure
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Missing Data (New Farmer)
          </button>

          <button
            onClick={() => handleSelectProfile('climate')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedProfileKey === 'climate' && !simulateFailure
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Climate Shock (Drip Saved)
          </button>

          <button
            onClick={() => handleSelectProfile('unverified')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedProfileKey === 'unverified' && !simulateFailure
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Unverified (Self-Reported)
          </button>

          <button
            onClick={() => handleSelectProfile('invalid')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              selectedProfileKey === 'invalid'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
            }`}
          >
            Invalid Inputs (Error Test)
          </button>

          <button
            onClick={() => setSimulateFailure(!simulateFailure)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              simulateFailure
                ? 'bg-stone-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Simulate Engine Failure
          </button>
        </div>
      </div>

      {/* Custom Input Editor Drawer (Collapsible) */}
      {showCustomEditor && (
        <Card className="border-harvest-primary/30 bg-harvest-pale/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-harvest-deep">
              {language === 'hi' ? 'खेत इनपुट त्वरित समायोजन' : 'Live Farm Parameter Customizer'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  {language === 'hi' ? 'खेत का नाम' : 'Farm Name'}
                </label>
                <input
                  type="text"
                  value={currentInput.farmName}
                  onChange={(e) => setCurrentInput({ ...currentInput, farmName: e.target.value })}
                  className="w-full h-8 px-2.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  {language === 'hi' ? 'कुल रकबा (एकड़)' : 'Total Acreage (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={currentInput.totalAcreage}
                  onChange={(e) =>
                    setCurrentInput({ ...currentInput, totalAcreage: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full h-8 px-2.5 bg-white border border-stone-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-stone-700 block mb-1">
                  {language === 'hi' ? 'सिंचाई विधि' : 'Irrigation Method'}
                </label>
                <select
                  value={currentInput.weather.irrigationMethod}
                  onChange={(e) =>
                    setCurrentInput({
                      ...currentInput,
                      weather: {
                        ...currentInput.weather,
                        irrigationMethod: e.target.value as FarmAssessmentInput['weather']['irrigationMethod'],
                      },
                    })
                  }
                  className="w-full h-8 px-2 bg-white border border-stone-300 rounded-lg text-xs"
                >
                  <option value="Micro_Drip_Sprinkler">Micro Drip / Sprinkler</option>
                  <option value="Canal_Borewell_Flood">Canal / Borewell Flood</option>
                  <option value="Rainfed_Only">Rainfed Only</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-5">
                <input
                  type="checkbox"
                  id="shc-check"
                  checked={currentInput.soilHealthCardIssued}
                  onChange={(e) =>
                    setCurrentInput({ ...currentInput, soilHealthCardIssued: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-harvest-primary"
                />
                <label htmlFor="shc-check" className="text-xs font-semibold text-stone-800">
                  {language === 'hi' ? 'मृदा स्वास्थ्य कार्ड उपलब्ध है' : 'Soil Health Card Available'}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Errors State */}
      {!validation.isValid && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-3xl space-y-2 text-xs text-red-950">
          <div className="flex items-center space-x-2 text-red-800 font-extrabold text-sm">
            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{language === 'hi' ? 'इनपुट डेटा अमान्य है' : 'Input Validation Errors Detected'}</span>
          </div>
          <p className="text-[11px] text-red-700">
            {language === 'hi'
              ? 'खेत स्कोर की गणना से पहले निम्नलिखित त्रुटियों को ठीक करें:'
              : 'Please resolve the following input issues before calculation:'}
          </p>
          <ul className="space-y-1 pt-1">
            {validation.errors.map((err, idx) => (
              <li
                key={idx}
                className="flex items-start space-x-1.5 text-[11px] bg-white/80 p-2 rounded-lg border border-red-200"
              >
                <span className="font-bold text-red-700">[{err.field}]:</span>
                <span>{err.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Simulated Service Failure State */}
      {simulateFailure && (
        <div className="p-4 bg-stone-900 text-white rounded-3xl space-y-2 text-xs border border-stone-800">
          <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Calculation Service Unavailable (Simulated 503)</span>
          </div>
          <p className="text-[11px] text-stone-300">
            Telemetry service or scoring worker failed to respond. Showing test fallback view.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="bg-stone-800 border-stone-700 text-white hover:bg-stone-700 mt-2"
            onClick={() => setSimulateFailure(false)}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Retry Calculation</span>
          </Button>
        </div>
      )}

      {/* Main Score & Dual Index Hero Card */}
      {assessment && (
        <div className="bg-gradient-to-br from-[#122b1c] via-[#142318] to-[#1f3d2b] text-white p-5 rounded-3xl shadow-lg border border-emerald-900/40 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Score Radial */}
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full border-4 border-emerald-400/40 bg-emerald-500/10 flex flex-col items-center justify-center shrink-0 shadow-inner">
                <span className="text-3xl font-black text-white">{assessment.overallScore}</span>
                <span className="text-[10px] uppercase font-bold text-emerald-300">/ 100</span>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 px-2.5 py-0.5 rounded-full text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{assessment.scoreBand}</span>
                </div>
                <h2 className="text-base font-extrabold text-white">
                  {currentInput.farmName || 'Registered Farm'}
                </h2>
                <p className="text-[11px] text-emerald-200/80">
                  {currentInput.district} • {currentInput.totalAcreage} {language === 'hi' ? 'एकड़' : 'Acres'}
                </p>
              </div>
            </div>

            {/* Data Completeness Badge */}
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center sm:text-right space-y-1 w-full sm:w-auto">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                {language === 'hi' ? 'डेटा पूर्णता सूचकांक' : 'Data Completeness'}
              </span>
              <span className="text-xl font-black text-white block">
                {assessment.dataCompletenessPercentage}%
              </span>
              <span className="text-[10px] text-emerald-100/70 block">
                {assessment.dataReliabilityBand}
              </span>
            </div>
          </div>

          {/* Uncertainty Range & Non-Punitive Clarification */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <div className="flex flex-wrap items-center justify-between text-xs text-emerald-200/90 gap-1">
              <span className="flex items-center space-x-1.5 text-[11px]">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {language === 'hi'
                    ? `अनुमानित सीमा: ${assessment.scoreRange.minimum} – ${assessment.scoreRange.maximum} अंक (±${assessment.scoreRange.uncertaintyMargin} अनिश्चितता)`
                    : `Estimated Range: ${assessment.scoreRange.minimum} – ${assessment.scoreRange.maximum} pts (±${assessment.scoreRange.uncertaintyMargin} pts uncertainty)`}
                </span>
              </span>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-emerald-200">
                {language === 'hi' ? 'गैर-दंडात्मक मॉडल' : 'Non-Punitive Model'}
              </span>
            </div>

            <p className="text-[10px] text-emerald-200/75 leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/5">
              {language === 'hi'
                ? 'नोट: अप्रमाणित या अनुपलब्ध डेटा केवल अनिश्चितता बढ़ाता है, इसे कभी भी किसान की साख में कमी या डिफॉल्ट नहीं माना जाता है।'
                : 'Notice: Missing records widen the uncertainty margin without penalizing the farmer as creditworthy or uncreditworthy.'}
            </p>
          </div>
        </div>
      )}

      {/* Evidence Separation Section: Verified vs Farmer-Entered */}
      {assessment && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
              {language === 'hi' ? 'साक्ष्य पृथक्करण: सत्यापित बनाम स्व-घोषित' : 'Evidence Segregation: Verified vs Farmer-Entered'}
            </h3>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-stone-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setActiveEvidenceTab('all')}
                className={`px-2 py-0.5 rounded ${
                  activeEvidenceTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                All ({assessment.verifiedEvidenceList.length + assessment.farmerEnteredList.length})
              </button>
              <button
                onClick={() => setActiveEvidenceTab('verified')}
                className={`px-2 py-0.5 rounded ${
                  activeEvidenceTab === 'verified' ? 'bg-emerald-700 text-white shadow-xs' : 'text-emerald-700'
                }`}
              >
                Verified ({assessment.verifiedEvidenceList.length})
              </button>
              <button
                onClick={() => setActiveEvidenceTab('farmer_entered')}
                className={`px-2 py-0.5 rounded ${
                  activeEvidenceTab === 'farmer_entered' ? 'bg-amber-700 text-white shadow-xs' : 'text-amber-700'
                }`}
              >
                Self-Reported ({assessment.farmerEnteredList.length})
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {/* Verified Third-Party Evidence */}
            {(activeEvidenceTab === 'all' || activeEvidenceTab === 'verified') &&
              assessment.verifiedEvidenceList.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-white border border-emerald-200 rounded-2xl shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-harvest-deep">
                          {language === 'hi' ? ev.labelHi : ev.labelEn}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Verified Document
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">{ev.valueDescription}</p>
                      {ev.referenceNumber && (
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                          Ref: {ev.referenceNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">{ev.date}</span>
                </div>
              ))}

            {/* Farmer-Entered (Self-Reported) Evidence */}
            {(activeEvidenceTab === 'all' || activeEvidenceTab === 'farmer_entered') &&
              assessment.farmerEnteredList.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 bg-white border border-amber-200 rounded-2xl shadow-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                      <FileQuestion className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-xs text-stone-900">
                          {language === 'hi' ? ev.labelHi : ev.labelEn}
                        </span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                          Farmer-Entered (Self-Reported)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">{ev.valueDescription}</p>
                      <p className="text-[10px] text-amber-800 italic mt-0.5">
                        Unverified by third-party receipt; subject to verification audit.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-medium">{ev.date}</span>
                </div>
              ))}

            {activeEvidenceTab === 'verified' && assessment.verifiedEvidenceList.length === 0 && (
              <div className="p-4 bg-stone-50 rounded-2xl text-center text-xs text-stone-500 border border-dashed border-stone-200">
                {language === 'hi'
                  ? 'कोई तृतीय-पक्ष सत्यापित दस्तावेज उपलब्ध नहीं है।'
                  : 'No verified third-party records attached to this profile yet.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5-Factor Explainable Breakdown */}
      {assessment && (
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
            {language === 'hi' ? 'स्कोर के 5 मुख्य घटक (विस्तृत विश्लेषण)' : '5 Explainable Assessment Factors'}
          </h3>

          <div className="space-y-2">
            {assessment.factors.map((factor) => (
              <div
                key={factor.id}
                className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-harvest-deep">
                      {language === 'hi' ? factor.nameHi : factor.nameEn}
                    </span>
                    {factor.isBasedOnVerifiedEvidence ? (
                      <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100 font-bold">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[9px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100 font-bold">
                        Self-Reported
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-harvest-primary bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    {factor.rawScore} / {factor.maxPoints} pts
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-harvest-primary to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${factor.normalizedPercentage}%` }}
                  />
                </div>

                {/* Explanation */}
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {language === 'hi' ? factor.explanationHi : factor.explanationEn}
                </p>

                <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                  <span>Data Completeness: {factor.dataCompletenessForFactor}%</span>
                  <span className="font-semibold text-emerald-700">{factor.statusLevel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Information & Non-Punitive Notice Card */}
      {assessment && assessment.missingInformation.length > 0 && (
        <Card variant="warm" className="border-amber-200 bg-amber-50/40">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-amber-600" />
              <span>{language === 'hi' ? 'अपूर्ण जानकारी व दस्तावेज़ीकरण' : 'Missing Information & Uncertainty Gaps'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 space-y-2.5 text-xs text-amber-950">
            <p className="text-[11px] text-amber-800 leading-relaxed">
              {language === 'hi'
                ? 'निम्नलिखित दस्तावेज अभी डिजिटल रूप में उपलब्ध नहीं हैं। कृपया ध्यान दें कि डेटा की कमी को खराब साख नहीं माना गया है:'
                : 'The following information is not yet digitized in this ledger. Missing items widen confidence intervals without lowering your base operational score:'}
            </p>

            <div className="space-y-2">
              {assessment.missingInformation.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 bg-white/90 rounded-xl border border-amber-200 shadow-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-950">
                      {language === 'hi' ? item.fieldHi : item.fieldEn}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Priority: {item.importance}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    {language === 'hi' ? item.descriptionHi : item.descriptionEn}
                  </p>
                  <p className="text-[10px] text-emerald-800 font-medium">
                    <span className="font-bold">{language === 'hi' ? 'कैसे जोड़ें: ' : 'How to provide: '}</span>
                    {language === 'hi' ? item.howToProvideHi : item.howToProvideEn}
                  </p>
                  <p className="text-[10px] text-stone-500 italic border-t border-stone-100 pt-1 mt-1">
                    {item.impactExplanation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agronomic Assumptions Card */}
      {assessment && (
        <Card className="border-stone-200 bg-white">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center space-x-1.5">
              <CloudSun className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? 'मूल्यांकन में की गई मान्यताएं' : 'Agronomic Model Assumptions'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 space-y-2 text-[11px] text-stone-600">
            {assessment.assumptions.map((assump) => (
              <div key={assump.id} className="p-2 bg-stone-50 rounded-xl border border-stone-200 space-y-0.5">
                <span className="font-bold text-stone-800">[{assump.factor}]: </span>
                <span>{language === 'hi' ? assump.assumptionTextHi : assump.assumptionTextEn}</span>
                <p className="text-[10px] text-stone-500 italic mt-0.5">{assump.rationaleEn}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recommended Agronomic Actions */}
      {assessment && (
        <Card variant="warm" className="border-emerald-200 bg-[#F4F9F2]">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-harvest-deep flex items-center space-x-1.5">
              <Sprout className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? 'खेत स्थिरता सुधार योजना' : 'Operational Resilience Action Plan'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-1 space-y-2 text-xs text-stone-700">
            {assessment.actionPlan.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-2.5 bg-white rounded-xl border border-emerald-100"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-harvest-deep">
                    {language === 'hi' ? act.titleHi : act.titleEn}
                  </p>
                  <p className="text-[11px] text-stone-600">
                    {language === 'hi' ? act.descriptionHi : act.descriptionEn}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {act.expectedResilienceGain}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Mandatory Statutory Disclaimer Card */}
      {assessment && (
        <div className="p-3.5 bg-stone-100 border border-stone-300 rounded-2xl text-[10px] text-stone-600 space-y-1.5">
          <div className="flex items-center space-x-1.5 font-bold text-stone-800">
            <ShieldCheck className="w-4 h-4 text-stone-700" />
            <span>{language === 'hi' ? 'वैधानिक अस्वीकरण व वित्तीय स्पष्टीकरण' : 'Statutory & Underwriting Disclaimer'}</span>
          </div>
          <p className="leading-relaxed">
            {language === 'hi' ? assessment.statutoryDisclaimerHi : assessment.statutoryDisclaimerEn}
          </p>
        </div>
      )}

      {/* Share / Certificate Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="secondary"
          className="flex-1 h-11 text-xs font-bold bg-white text-harvest-deep border border-stone-200 hover:bg-stone-50"
          onClick={handleShare}
        >
          <Share2 className="w-3.5 h-3.5 mr-1 text-harvest-primary" />
          <span>
            {isCopied
              ? (language === 'hi' ? 'रिपोर्ट लिंक कॉपी हुआ!' : 'Copied to Clipboard!')
              : (language === 'hi' ? 'मूल्यांकन रिपोर्ट शेयर करें' : 'Share Assessment Report')}
          </span>
        </Button>

        <Button
          variant="primary"
          className="flex-1 h-11 text-xs font-bold bg-harvest-primary text-white"
          onClick={() => navigate('/finance')}
        >
          <span>{language === 'hi' ? 'ऋण व योजनाएं देखें' : 'View Credit & Schemes'}</span>
        </Button>
      </div>
    </div>
  );
};
