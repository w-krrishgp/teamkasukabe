import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  Volume2,
  Droplets,
  Calendar,
  CheckCircle2,
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
import { useLanguage } from '@/context/LanguageContext';

export const DiseaseScannerPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [isCapturing, setIsCapturing] = useState(false);
  const [photoData, setPhotoData] = useState<PhotoCaptureResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [diagnosticResult, setDiagnosticResult] = useState<{
    crop: string;
    disease: string;
    scientificName: string;
    severity: 'Mild' | 'Moderate' | 'Critical';
    confidence: number;
    description: string;
    chemicalRemedy: string;
    organicRemedy: string;
    dosage: string;
    sprayWindow: string;
    preventionSteps: string[];
  } | null>(null);

  const handleCapture = async () => {
    setIsCapturing(true);
    setDiagnosticResult(null);
    try {
      const result = await captureLeafPhoto();
      setPhotoData(result);
      setIsCapturing(false);

      // Trigger AI Diagnostic pipeline
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setDiagnosticResult({
          crop: language === 'hi' ? 'गेहूं (HD-2967)' : 'Wheat (HD-2967)',
          disease: language === 'hi' ? 'पीला रतुआ (Yellow Rust)' : 'Yellow Rust (Stripe Rust)',
          scientificName: 'Puccinia striiformis f. sp. tritici',
          severity: 'Moderate',
          confidence: 96.8,
          description:
            language === 'hi'
              ? 'पत्तियों पर पीले-नारंगी रंग की धारियां देखी गई हैं। यह कवक हवा द्वारा फैलता है और अनुकूल नम मौसम में टिलर उत्पादन को 30% तक घटा सकता है।'
              : 'Chlorotic yellow stripes visible on upper leaf blades. Fungal spores spread rapidly in cool, humid morning winds, risking up to 30% grain loss if untreated.',
          chemicalRemedy:
            language === 'hi'
              ? 'प्रोपिकोनाज़ोल 25% EC (टिल्ट) का पर्ण स्प्रे'
              : 'Propiconazole 25% EC (Tilt / Bumper) foliar application',
          organicRemedy:
            language === 'hi'
              ? 'खट्टी छाछ (5 लीटर) + 500 ग्राम हींग 150 लीटर पानी में'
              : 'Fermented sour buttermilk (5L) + 500g Asafoetida in 150L water',
          dosage:
            language === 'hi'
              ? '1 मिली प्रति 1 लीटर पानी (200 मिली प्रति एकड़)'
              : '1 ml per litre of water (200 ml / acre in 200L water)',
          sprayWindow:
            language === 'hi'
              ? 'अगले 24 घंटे उत्तम (हवा की गति < 10 किमी/घंटा, बारिश से पहले)'
              : 'Next 24 hours optimal (Wind < 10 km/h, clear morning sky)',
          preventionSteps: [
            language === 'hi'
              ? 'खेत में अतिरिक्त नाइट्रोजन (यूरिया) का छिड़काव तुरंत रोकें।'
              : 'Temporarily halt excess urea broadcasting to starve fungal spread.',
            language === 'hi'
              ? 'सुबह की ओस सूखने के बाद दोपहर 11 बजे से पहले छिड़काव करें।'
              : 'Apply spray between 08:30 AM and 11:00 AM once dew dries.',
            language === 'hi'
              ? 'पड़ोसी खेतों में किसान भाइयों को सतर्क करें।'
              : 'Inform adjacent plot farmers to check border tillers.',
          ],
        });
      }, 1200);
    } catch {
      setIsCapturing(false);
      setIsAnalyzing(false);
    }
  };

  const playVoiceAdvisory = () => {
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 3500);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Top Bar with back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-harvest-deep transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
          {language === 'hi' ? 'कैमरा डायग्नोस्टिक' : 'AI Vision Model'}
        </span>
      </div>

      {/* Header Banner */}
      <div className="space-y-1">
        <h1 className="text-lg font-extrabold text-harvest-deep flex items-center space-x-2">
          <Camera className="w-5 h-5 text-harvest-primary" />
          <span>{language === 'hi' ? 'AI फसल रोग स्कैनर' : 'AI Crop Disease Scanner'}</span>
        </h1>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'कैमरे से पत्ती की तस्वीर लें या नमूना जांचें। तुरंत उपचार व खुराक गाइड पाएं।'
            : 'Point your camera at affected leaves for instant plant pathology diagnosis.'}
        </p>
      </div>

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
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-stone-300 font-medium max-w-xs">
                {language === 'hi'
                  ? 'रोगग्रस्त पत्ते को फ्रेम के केंद्र में रखें'
                  : 'Place the infected leaf in good sunlight in the center'}
              </p>
            </div>
          )}

          {/* Scanner Overlay Crosshairs */}
          <div className="absolute inset-4 pointer-events-none border border-white/20 rounded-xl flex flex-col justify-between p-2">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
            </div>
            {isAnalyzing && (
              <div className="text-center">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-[11px] font-bold shadow-lg animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'AI विश्लेषण जारी...' : 'Analyzing Cellular Patterns...'}</span>
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
            </div>
          </div>
        </div>

        {/* Capture Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <Button
            variant="primary"
            className="w-full h-12 text-sm font-extrabold flex items-center justify-center space-x-2 bg-harvest-primary text-white hover:bg-harvest-primary/95 shadow-md"
            onClick={handleCapture}
            disabled={isCapturing || isAnalyzing}
          >
            <Camera className="w-4 h-4" />
            <span>
              {isCapturing
                ? (language === 'hi' ? 'कैमरा खुल रहा है...' : 'Opening Camera...')
                : photoData
                ? (language === 'hi' ? 'नई फोटो लें' : 'Retake Leaf Photo')
                : (language === 'hi' ? 'पत्ता स्कैन करें (कैमरा)' : 'Scan Leaf with Camera')}
            </span>
          </Button>

          {photoData && (
            <Button
              variant="outline"
              className="w-full sm:w-auto h-12 text-xs font-bold text-stone-700"
              onClick={() => {
                setPhotoData(null);
                setDiagnosticResult(null);
              }}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>{language === 'hi' ? 'रीसेट' : 'Reset'}</span>
            </Button>
          )}
        </div>

        {/* Permission and Fallback Notice */}
        {photoData && (
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 space-y-0.5">
            <div className="flex items-center justify-between font-bold text-stone-700">
              <span>{language === 'hi' ? 'कैप्चर स्रोत:' : 'Capture Source:'}</span>
              <span className="uppercase text-[10px] text-emerald-700 font-extrabold">
                {photoData.source}
              </span>
            </div>
            {photoData.note && <p className="text-[10px] text-stone-500 italic">{photoData.note}</p>}
          </div>
        )}
      </div>

      {/* AI Diagnostic Report */}
      {diagnosticResult && (
        <Card variant="warm" className="border-amber-200 bg-amber-50/40 shadow-md space-y-3">
          <CardHeader className="pb-1">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                  {diagnosticResult.crop} • {diagnosticResult.scientificName}
                </span>
                <CardTitle className="text-base font-extrabold text-amber-950 mt-0.5 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{diagnosticResult.disease}</span>
                </CardTitle>
              </div>
              <StatusBadge variant="warning" size="sm" showDot>
                {diagnosticResult.severity} ({diagnosticResult.confidence}%)
              </StatusBadge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 pt-1 text-xs text-amber-950">
            <p className="leading-relaxed bg-white/80 p-3 rounded-xl border border-amber-200/60">
              {diagnosticResult.description}
            </p>

            {/* Voice Audio Advisory Button */}
            <div className="flex items-center justify-between bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-xs">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-xs text-amber-950">
                    {language === 'hi' ? 'ऑडियो सलाह सुनें' : 'Audio Agronomist Voice Note'}
                  </p>
                  <p className="text-[10px] text-amber-800/80">
                    {language === 'hi' ? 'हिंदी व गुजराती में डॉक्टर सलाह' : 'Doctor voice advisory in Hindi/Gujarati'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700"
                onClick={playVoiceAdvisory}
                disabled={isPlayingAudio}
              >
                {isPlayingAudio
                  ? (language === 'hi' ? 'चल रहा है...' : 'Playing...')
                  : (language === 'hi' ? 'सुनें ▶' : 'Listen ▶')}
              </Button>
            </div>

            {/* Prescribed Remedy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                  <Droplets className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'रासायनिक उपचार' : 'Chemical Prescription'}</span>
                </div>
                <p className="font-bold text-harvest-deep text-xs">{diagnosticResult.chemicalRemedy}</p>
                <p className="text-[11px] text-stone-600">
                  <span className="font-bold text-stone-700">{language === 'hi' ? 'मात्रा:' : 'Dosage:'} </span>
                  {diagnosticResult.dosage}
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>{language === 'hi' ? 'स्प्रे समय व खिड़की' : 'Spray Window'}</span>
                </div>
                <p className="font-bold text-stone-900 text-xs">{diagnosticResult.sprayWindow}</p>
                <p className="text-[11px] text-stone-600">
                  <span className="font-bold text-stone-700">{language === 'hi' ? 'जैविक विकल्प:' : 'Bio-remedy:'} </span>
                  {diagnosticResult.organicRemedy}
                </p>
              </div>
            </div>

            {/* Preventive Steps */}
            <div className="space-y-1.5 pt-1">
              <h4 className="font-bold text-stone-800 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'hi' ? 'महत्वपूर्ण सावधानियां' : 'Essential Field Actions'}</span>
              </h4>
              <ul className="space-y-1">
                {diagnosticResult.preventionSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-[11px] text-stone-700 bg-white/70 p-2 rounded-lg border border-stone-200">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
