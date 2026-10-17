import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Upload,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Volume2,
  Droplets,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Leaf,
  Info,
  ShieldCheck,
  FlaskConical,
  XCircle,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
} from '@/components/common';
import { captureLeafPhoto, PhotoCaptureResult } from '@/services/deviceService';
import {
  getCropDoctorService,
  validateImageFile,
  validateImageDataUrl,
  CropDiseaseDiagnostic,
  ImageValidationResult,
  InferenceMode,
} from '@/services/cropDoctor';
import { env, isConfigured } from '@/config/env';
import { useLanguage } from '@/context/LanguageContext';

export const DiseaseScannerPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // State management
  const [isCapturing, setIsCapturing] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoCaptureResult | null>(null);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCropHint, setSelectedCropHint] = useState<string>('auto');
  const [validationError, setValidationError] = useState<ImageValidationResult | null>(null);

  // Analysis and Diagnostic states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<CropDiseaseDiagnostic | null>(null);

  // Testing & Inference Mode Controls
  const [testMode, setTestMode] = useState<'auto' | 'demo' | 'simulate_failure'>('auto');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Multi-stage analysis text
  const stages = [
    {
      en: 'Validating image resolution and lighting conditions...',
      hi: 'फोटो गुणवत्ता और रोशनी की जांच हो रही है...',
    },
    {
      en: 'Segmenting foliar lesions and chlorotic cell patterns...',
      hi: 'पत्तियों पर रोगग्रस्त धब्बों और फफूंद पैटर्न की पहचान...',
    },
    {
      en: testMode === 'simulate_failure'
        ? 'Contacting vision model endpoint...'
        : isConfigured.supabase && env.geminiApiKey
        ? 'Querying Gemini Vision pathology classifier...'
        : 'Consulting ICAR extension pathology database...',
      hi: 'रोग पहचान मॉडल से विश्लेषण जारी है...',
    },
    {
      en: 'Synthesizing cautious agronomic prescriptions and PPE warnings...',
      hi: 'सुरक्षित कीटनाशक खुराक व जैविक उपचार तैयार हो रहा है...',
    },
  ];

  // Run image validation and analysis
  const executeAnalysis = async (
    _sourceType: 'camera' | 'upload' | 'sample',
    imageDataUrl: string,
    file?: File,
    cropHint?: string
  ) => {
    setAnalysisError(null);
    setDiagnosticResult(null);

    // 1. Validate image format and size
    let validation: ImageValidationResult;
    if (file) {
      validation = validateImageFile(file);
    } else {
      validation = validateImageDataUrl(imageDataUrl);
    }

    if (!validation.isValid) {
      setValidationError(validation);
      return;
    }

    setValidationError(null);
    setIsAnalyzing(true);
    setAnalysisStage(0);

    // Animate multi-stage progress
    const stageInterval = setInterval(() => {
      setAnalysisStage((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      const service = getCropDoctorService(testMode);
      const result = await service.analyzeLeaf({
        imageFile: file,
        imageDataUrl,
        cropHint,
        preferredLanguage: language,
        forceMode: testMode,
      });

      clearInterval(stageInterval);
      setAnalysisStage(3);
      setTimeout(() => {
        setIsAnalyzing(false);
        setDiagnosticResult(result);
        setTimeout(() => {
          reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }, 400);
    } catch (err: unknown) {
      clearInterval(stageInterval);
      setIsAnalyzing(false);
      const message = err instanceof Error ? err.message : 'Unknown diagnostic analysis failure';
      setAnalysisError(message);
    }
  };

  // Handler for Native Camera
  const handleCameraCapture = async () => {
    setIsCapturing(true);
    setValidationError(null);
    try {
      const result = await captureLeafPhoto();
      setPhotoData(result);
      setSelectedFile(null);
      setIsCapturing(false);

      if (result.imageUrl) {
        await executeAnalysis('camera', result.imageUrl, undefined, 'wheat');
      }
    } catch {
      setIsCapturing(false);
      setValidationError({
        isValid: false,
        errorMessage: 'Camera access was denied or cancelled.',
        errorMessageHi: 'कैमरा अनुमति अस्वीकृत या रद्द कर दी गई।',
      });
    }
  };

  // Handler for File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPhotoData({
      imageUrl: objectUrl,
      source: 'file_picker',
      note: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
    });

    executeAnalysis('upload', objectUrl, file, selectedCropHint === 'auto' ? undefined : selectedCropHint);
  };

  // Handler for Sample Leaves
  const handleSelectSample = (sampleType: 'wheat' | 'tomato' | 'healthy') => {
    setValidationError(null);
    const sampleUrls: Record<string, string> = {
      wheat: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      tomato: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80',
      healthy: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80',
    };

    const url = sampleUrls[sampleType];
    setPhotoData({
      imageUrl: url,
      source: 'sample_fallback',
      note: `Verified Sample Leaf: ${sampleType.toUpperCase()}`,
    });
    setSelectedFile(null);

    executeAnalysis('sample', url, undefined, sampleType);
  };

  // Reset Scanner
  const handleReset = () => {
    setPhotoData(null);
    setSelectedFile(null);
    setValidationError(null);
    setAnalysisError(null);
    setDiagnosticResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Voice advisory using Web Speech API synthesis
  const playVoiceAdvisory = () => {
    if (!diagnosticResult) return;
    setIsPlayingAudio(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak =
        language === 'hi'
          ? `रोग निदान: ${diagnosticResult.condition.nameHi}। गंभीरता: ${diagnosticResult.severity}। सावधानी: ${diagnosticResult.guidance.chemicalRemedies[0]?.name || diagnosticResult.guidance.organicRemedies[0]}। रासायनिक प्रयोग से पहले कृषि विशेषज्ञ से सलाह अवश्य लें।`
          : `Diagnosed condition: ${diagnosticResult.condition.nameEn}. Severity: ${diagnosticResult.severity}. Recommended remedy: ${diagnosticResult.guidance.chemicalRemedies[0]?.name || diagnosticResult.guidance.organicRemedies[0]}. Consult your local agricultural officer before spraying.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const getInferenceBadge = (mode: InferenceMode, isConnected: boolean) => {
    if (mode === 'live_ai' && isConnected) {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
          <span>Gemini 1.5 Vision (Live Model)</span>
        </span>
      );
    }
    if (mode === 'demo_reference') {
      return (
        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
          <Info className="w-3 h-3 text-amber-600" />
          <span>Demo / Reference Mode (No Vision API Configured)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-300">
        <AlertCircle className="w-3 h-3 text-red-600" />
        <span>Service Unavailable</span>
      </span>
    );
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

        <div>
          {diagnosticResult
            ? getInferenceBadge(diagnosticResult.inferenceMode, diagnosticResult.isModelConnected)
            : env.geminiApiKey && !env.geminiApiKey.includes('your-gemini')
            ? getInferenceBadge('live_ai', true)
            : getInferenceBadge('demo_reference', false)}
        </div>
      </div>

      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-xl font-extrabold text-harvest-deep flex items-center space-x-2">
          <Camera className="w-5 h-5 text-harvest-primary" />
          <span>{language === 'hi' ? 'AI फसल डॉक्टर व पत्ता स्कैनर' : 'AI Crop Doctor & Leaf Scanner'}</span>
        </h1>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'कैमरे से फोटो लें या पत्ती अपलोड करें। रोग पहचान, जैविक विकल्प और सुरक्षित रासायनिक खुराक पाएं।'
            : 'Capture leaf photo or upload image for cellular pathology detection and cautious agronomic guidance.'}
        </p>
      </div>

      {/* Testing & Service Mode Bar */}
      <div className="p-2.5 bg-stone-100 border border-stone-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1.5 text-stone-700 font-semibold">
          <Cpu className="w-3.5 h-3.5 text-harvest-primary" />
          <span>{language === 'hi' ? 'परीक्षण मोड:' : 'Inference Mode:'}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setTestMode('auto')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              testMode === 'auto'
                ? 'bg-harvest-primary text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Auto (Vision API)
          </button>
          <button
            onClick={() => setTestMode('demo')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              testMode === 'demo'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Force Demo Reference
          </button>
          <button
            onClick={() => setTestMode('simulate_failure')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              testMode === 'simulate_failure'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            Simulate 503 Error
          </button>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Camera Viewfinder / Capture Card */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-4">
        <div className="relative aspect-4/3 w-full rounded-2xl bg-stone-900 overflow-hidden flex items-center justify-center border border-stone-800">
          {photoData?.imageUrl ? (
            <img
              src={photoData.imageUrl}
              alt="Scanned crop leaf"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <Leaf className="w-8 h-8" />
              </div>
              <p className="text-xs text-stone-300 font-medium max-w-xs">
                {language === 'hi'
                  ? 'रोगग्रस्त पत्ते को सूर्य की रोशनी में फ्रेम के केंद्र में रखें'
                  : 'Place infected leaf under natural daylight in the center'}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                  JPEG / PNG / WebP
                </span>
                <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full">
                  Max 10 MB
                </span>
              </div>
            </div>
          )}

          {/* Scanner Overlay Crosshairs */}
          <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            </div>

            {isAnalyzing && (
              <div className="text-center px-4 py-3 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-emerald-500/40 shadow-xl space-y-2 pointer-events-auto">
                <div className="flex items-center justify-center space-x-2 text-emerald-400 font-bold text-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{stages[analysisStage]?.[language === 'hi' ? 'hi' : 'en']}</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-harvest-primary transition-all duration-300"
                    style={{ width: `${((analysisStage + 1) / stages.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-2.5 text-xs text-red-900">
            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <p className="font-bold">
                {language === 'hi' ? 'फोटो सत्यापन त्रुटि:' : 'Image Validation Error:'}
              </p>
              <p className="text-[11px] text-red-700">
                {language === 'hi' ? validationError.errorMessageHi : validationError.errorMessage}
              </p>
              {validationError.fileDetails && (
                <p className="text-[10px] text-red-600/80">
                  {validationError.fileDetails.name} • {validationError.fileDetails.sizeFormatted} • {validationError.fileDetails.mimeType}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Inference / Service Error State */}
        {analysisError && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-950">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold">
                {language === 'hi' ? 'निदान सेवा अनुपलब्ध' : 'Diagnostic Service Error'}
              </p>
              <p className="text-[11px] text-amber-800 leading-relaxed">{analysisError}</p>
              <p className="text-[10px] text-amber-700 italic">
                {language === 'hi'
                  ? 'टिप: "Force Demo Reference" चुनकर ऑफलाइन डेटाबेस से जांच करें।'
                  : 'Tip: Switch to "Force Demo Reference" above to run verification via offline agronomic database.'}
              </p>
            </div>
          </div>
        )}

        {/* Capture / Upload Button Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button
            variant="primary"
            className="h-12 text-xs font-extrabold flex items-center justify-center space-x-2 bg-harvest-primary text-white hover:bg-harvest-primary/95 shadow-md"
            onClick={handleCameraCapture}
            disabled={isCapturing || isAnalyzing}
          >
            <Camera className="w-4 h-4" />
            <span>
              {isCapturing
                ? (language === 'hi' ? 'कैमरा खुल रहा है...' : 'Opening Camera...')
                : (language === 'hi' ? 'कैमरा से स्कैन करें' : 'Take Leaf Photo (Camera)')}
            </span>
          </Button>

          <Button
            variant="outline"
            className="h-12 text-xs font-bold flex items-center justify-center space-x-2 border-stone-300 text-stone-800 hover:bg-stone-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Upload className="w-4 h-4 text-harvest-primary" />
            <span>{language === 'hi' ? 'गैलरी / फाइल अपलोड' : 'Upload Image (JPEG/PNG)'}</span>
          </Button>
        </div>

        {/* Sample Photos for Testing */}
        <div className="pt-1 border-t border-stone-100 flex flex-wrap items-center justify-between gap-1.5 text-[11px] text-stone-600">
          <span className="font-semibold text-stone-700">
            {language === 'hi' ? 'परीक्षण हेतु नमूने:' : 'Test with verified samples:'}
          </span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => handleSelectSample('wheat')}
              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium text-[10px]"
            >
              Wheat (Rust)
            </button>
            <button
              onClick={() => handleSelectSample('tomato')}
              className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium text-[10px]"
            >
              Tomato (Blight)
            </button>
            <button
              onClick={() => handleSelectSample('healthy')}
              className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-medium text-[10px]"
            >
              Healthy Leaf
            </button>
          </div>
        </div>

        {/* Crop Type Selector */}
        <div className="space-y-1.5 px-1 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-stone-700">
              {language === 'hi' ? 'निदान श्रेणी (फसल / रोग प्रकार):' : 'Diagnosis Pathology Focus:'}
            </span>
            <span className="text-[10px] text-stone-500 italic">
              {selectedCropHint === 'auto' ? 'Auto-detected from image pixels' : 'Custom category'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => {
                setSelectedCropHint('auto');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, undefined);
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'auto'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Auto Detect (Pixels)
            </button>
            <button
              onClick={() => {
                setSelectedCropHint('tomato_early_blight');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, 'tomato_early_blight');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'tomato_early_blight'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Tomato (Early Blight)
            </button>
            <button
              onClick={() => {
                setSelectedCropHint('groundnut_tikka');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, 'groundnut_tikka');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'groundnut_tikka'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Groundnut (Tikka)
            </button>
            <button
              onClick={() => {
                setSelectedCropHint('cotton_leaf_curl');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, 'cotton_leaf_curl');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'cotton_leaf_curl'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Cotton (Leaf Curl)
            </button>
            <button
              onClick={() => {
                setSelectedCropHint('wheat_yellow_rust');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, 'wheat_yellow_rust');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'wheat_yellow_rust'
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`}
            >
              Wheat (Yellow Rust)
            </button>
            <button
              onClick={() => {
                setSelectedCropHint('healthy_wheat');
                if (photoData) executeAnalysis('sample', photoData.imageUrl, undefined, 'healthy_wheat');
              }}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                selectedCropHint === 'healthy_wheat'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Healthy Canopy
            </button>
          </div>
        </div>

        {/* File and Capture Meta */}
        {photoData && (
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 truncate mr-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{photoData.note || photoData.source}</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 text-stone-500 hover:text-stone-800 font-bold text-[10px] shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>

            {diagnosticResult && (
              <button
                onClick={() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition-all animate-bounce"
              >
                <span>👇 {language === 'hi' ? 'निदान रिपोर्ट देखें (नीचे स्क्रॉल करें)' : 'Diagnosis Ready! Tap to View Full Report 👇'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI Diagnostic Report / Detailed Result Screen */}
      {diagnosticResult && (
        <div ref={reportRef} id="diagnostic-report-section" className="scroll-mt-4">
        <Card
          variant={diagnosticResult.condition.isHealthy ? 'default' : 'warm'}
          className={
            diagnosticResult.condition.isHealthy
              ? 'border-emerald-300 bg-emerald-50/40 shadow-md space-y-4'
              : 'border-amber-300 bg-amber-50/30 shadow-md space-y-4'
          }
        >
          <CardHeader className="pb-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                  {language === 'hi' ? diagnosticResult.crop.nameHi : diagnosticResult.crop.nameEn}
                  {diagnosticResult.crop.scientificName && ` • ${diagnosticResult.crop.scientificName}`}
                </span>
                <CardTitle className="text-lg font-extrabold text-stone-900 mt-0.5 flex items-center space-x-2">
                  {diagnosticResult.condition.isHealthy ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                  <span>
                    {language === 'hi' ? diagnosticResult.condition.nameHi : diagnosticResult.condition.nameEn}
                  </span>
                </CardTitle>
                {diagnosticResult.condition.scientificName && (
                  <p className="text-[11px] text-stone-500 italic mt-0.5">
                    Pathogen: {diagnosticResult.condition.scientificName} ({diagnosticResult.condition.pathogenType})
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end space-y-1">
                <StatusBadge
                  variant={
                    diagnosticResult.severity === 'Critical'
                      ? 'error'
                      : diagnosticResult.severity === 'Moderate'
                      ? 'warning'
                      : 'success'
                  }
                  size="sm"
                  showDot
                >
                  Severity: {diagnosticResult.severity}
                </StatusBadge>

                {/* Model Confidence Tag */}
                {diagnosticResult.confidenceGenuine && typeof diagnosticResult.confidence === 'number' ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                    Confidence: {diagnosticResult.confidence}% (Model Verified)
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                    Reference Heuristic (Demo)
                  </span>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-1 text-xs text-stone-900">
            {/* Model Provenance Banner */}
            <div className="p-2.5 rounded-xl bg-white/90 border border-stone-200 flex items-center justify-between text-[11px]">
              <div className="flex items-center space-x-1.5 text-stone-700">
                <Cpu className="w-3.5 h-3.5 text-harvest-primary" />
                <span className="font-semibold">{diagnosticResult.modelDetails.provider}</span>
                {diagnosticResult.modelDetails.latencyMs && (
                  <span className="text-stone-400">({diagnosticResult.modelDetails.latencyMs}ms)</span>
                )}
              </div>
              <span className="text-[10px] text-stone-500 italic">
                {diagnosticResult.confidenceNote || 'Diagnostic completed'}
              </span>
            </div>

            {/* Voice Audio Advisory Button */}
            <div className="flex items-center justify-between bg-white/90 p-3 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-harvest-pale text-harvest-primary flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-harvest-deep">
                    {language === 'hi' ? 'डॉक्टर सलाह सुनें (ऑडियो)' : 'Listen to Agronomist Advisory'}
                  </p>
                  <p className="text-[10px] text-stone-500">
                    {language === 'hi'
                      ? 'हिंदी / गुजराती में डॉक्टर की बोली सुनें'
                      : 'Voice read-aloud of cautious treatment guidance'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                className="h-8 text-xs font-bold bg-harvest-primary text-white"
                onClick={playVoiceAdvisory}
                disabled={isPlayingAudio}
              >
                {isPlayingAudio
                  ? (language === 'hi' ? 'बोल रहा है...' : 'Speaking...')
                  : (language === 'hi' ? 'सुनें ▶' : 'Listen ▶')}
              </Button>
            </div>

            {/* Symptoms Breakdown */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-800 text-xs flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-harvest-primary" />
                <span>{language === 'hi' ? 'लक्षण व रोग प्रभाव' : 'Identified Foliar Symptoms'}</span>
              </h4>
              <div className="space-y-1.5">
                {diagnosticResult.symptoms.map((symptom, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white rounded-xl border border-stone-200 space-y-0.5"
                  >
                    <p className="font-bold text-stone-900 text-[11px]">
                      {language === 'hi' ? symptom.titleHi : symptom.titleEn}
                    </p>
                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {language === 'hi' ? symptom.descriptionHi : symptom.descriptionEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Chemical & Organic Remedies */}
            {diagnosticResult.guidance.organicRemedies.length > 0 && (
              <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'hi' ? 'जैविक व पारंपरिक उपचार (प्राथमिक)' : 'Organic & Biological Remedies (First Choice)'}</span>
                </div>
                <ul className="space-y-1 text-[11px] text-emerald-950">
                  {diagnosticResult.guidance.organicRemedies.map((remedy, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <span className="text-emerald-700 font-bold">•</span>
                      <span>{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Chemical Treatment Options with Cautious Warnings */}
            {diagnosticResult.guidance.chemicalRemedies.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-800 text-xs flex items-center space-x-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'सावधानीपूर्वक रासायनिक विकल्प' : 'Cautious Chemical Prescriptions'}</span>
                  </h4>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-bold">
                    Controlled Dosage
                  </span>
                </div>

                <div className="space-y-2">
                  {diagnosticResult.guidance.chemicalRemedies.map((chem, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-extrabold text-stone-900 text-xs">{chem.name}</p>
                          <p className="text-[10px] text-stone-500">
                            Active: {chem.activeIngredient} • PHI: {chem.preHarvestIntervalDays} days
                          </p>
                        </div>
                        <span className="text-[10px] text-stone-700 font-bold bg-stone-100 px-2 py-0.5 rounded">
                          {chem.dosage}
                        </span>
                      </div>
                      <div className="flex items-start space-x-1.5 text-[11px] text-amber-900 bg-amber-50/60 p-2 rounded-lg">
                        <Droplets className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <span>{chem.safetyCaution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Spray Window & Field Safety PPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-800 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-harvest-primary" />
                  <span>{language === 'hi' ? 'अनुकूल छिड़काव समय' : 'Weather Spray Window'}</span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {diagnosticResult.guidance.sprayWindow}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-stone-800 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>{language === 'hi' ? 'सुरक्षा किट व PPE' : 'Protective PPE Protocol'}</span>
                </div>
                <ul className="text-[11px] text-stone-600 space-y-0.5">
                  {diagnosticResult.guidance.fieldSafetyPPE.map((ppe, idx) => (
                    <li key={idx}>• {ppe}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Local KVK / Agronomist Verification Notice */}
            <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-stone-700 text-xs space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-harvest-deep">
                <Info className="w-4 h-4 text-harvest-primary" />
                <span>{language === 'hi' ? 'कृषि वैज्ञानिक परामर्श' : 'KVK Agronomist Notice'}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {diagnosticResult.guidance.agronomistConsultNotice}
              </p>
              <p className="text-[10px] text-stone-500 font-medium pt-1 border-t border-stone-200/80">
                {language === 'hi' ? diagnosticResult.disclaimerHi : diagnosticResult.disclaimerEn}
              </p>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  );
};
