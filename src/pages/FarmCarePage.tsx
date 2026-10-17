import { useState } from 'react';
import {
  Camera,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormSelect,
  StatusBadge,
  SearchInput,
  EmptyState,
} from '@/components/common';
import { MOCK_CROPS } from '@/services/supabase';
import { useLanguage } from '@/context/LanguageContext';

export const FarmCarePage = () => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(MOCK_CROPS[0].id);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    disease: string;
    severity: 'Mild' | 'Moderate' | 'Critical';
    treatment: string;
    dosage: string;
    confidence: number;
  } | null>(null);

  const sampleDiseases = [
    {
      id: 'd1',
      crop: 'Wheat (गेहूं)',
      disease: 'Yellow Rust (पीला रतुआ)',
      severity: 'Moderate',
      symptoms: 'Yellow pustules in linear rows on leaves',
      remedy: 'Propiconazole 25% EC foliar spray',
      dosage: '1 ml per litre of water',
    },
    {
      id: 'd2',
      crop: 'Mustard (सरसों)',
      disease: 'Mustard Aphid (माहू / चेपा)',
      severity: 'Critical',
      symptoms: 'Curling leaves and honeydew secretion',
      remedy: 'Dimethoate 30% EC or Neem seed extract',
      dosage: '1.7 ml per litre water in early morning',
    },
    {
      id: 'd3',
      crop: 'Cotton (कपास)',
      disease: 'Bacterial Leaf Blight (जीवाणु झुलसा)',
      severity: 'Mild',
      symptoms: 'Angular water-soaked leaf spots',
      remedy: 'Copper Oxychloride 50% WP + Streptocycline',
      dosage: '2.5g Copper + 1g Streptocycline per 10L',
    },
  ];

  const filteredDiseases = sampleDiseases.filter(
    (d) =>
      d.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        disease: 'Yellow Rust (Puccinia striiformis)',
        severity: 'Mild',
        treatment: 'Foliar fungicide spray recommended within 48 hours to prevent spread to tillers.',
        dosage: 'Propiconazole 25% EC @ 1 ml/L or Tebuconazole 25.9% EC @ 1.25 ml/L',
        confidence: 96.4,
      });
    }, 1100);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Demo Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            {language === 'hi' ? 'स्मार्ट फसल सुरक्षा • AI रोग निदान मॉडल' : 'Smart Farm Care • AI Diagnostics (Demonstration Mode)'}
          </span>
        </div>
        <StatusBadge variant="success" size="sm">
          Model v2.4
        </StatusBadge>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-extrabold text-harvest-deep">
            {language === 'hi' ? 'स्मार्ट फसल सुरक्षा व स्वास्थ्य' : 'Smart Farm Care & Crop Doctor'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'कैमरे से पत्ता स्कैन करें, बीमारी पहचानें और तुरंत सटीक उपचार सलाह पाएं'
            : 'AI leaf disease diagnosis, localized pest monitoring & calibrated treatment prescriptions'}
        </p>
      </div>

      {/* AI Camera Scan Action Card */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? 'AI फसल डॉक्टर कैमरा' : 'AI Crop Doctor Camera'}</span>
            </CardTitle>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
              Capacitor Ready
            </span>
          </div>
          <CardDescription className="text-xs">
            {language === 'hi'
              ? 'प्रभावित पत्ते, तने या कीट की साफ तस्वीर लें'
              : 'Capture a clear photo of leaf margins, lesions, or pests for automated prescription.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <FormSelect
            label={language === 'hi' ? 'खेत की फसल चुनें' : 'Select Target Crop'}
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            options={MOCK_CROPS.map((c) => ({
              label: `${c.name} (${c.variety}) • Plot #${c.id}`,
              value: c.id,
            }))}
          />

          <div
            onClick={handleSimulateScan}
            className="border-2 border-dashed border-stone-300 rounded-2xl p-5 text-center bg-[#F8FAF6] hover:bg-emerald-50/40 transition-all cursor-pointer flex flex-col items-center justify-center space-y-2 group active:scale-[0.99]"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-harvest-deep">
                {isScanning
                  ? (language === 'hi' ? 'पत्ते के लक्षणों का विश्लेषण जारी...' : 'Analyzing leaf biomarkers with AI...')
                  : (language === 'hi' ? 'पत्ते की फोटो खींचें या गैलरी से चुनें' : 'Tap to Launch Camera or Upload Leaf Photo')}
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {language === 'hi' ? 'ऑटो-फोकस और धूप में स्पष्ट जांच' : 'High-contrast mobile inspection'}
              </p>
            </div>
          </div>

          {scanResult && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs space-y-2 animate-fadeIn text-emerald-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>{scanResult.disease}</span>
                </div>
                <StatusBadge variant="warning" size="sm">
                  {scanResult.severity}
                </StatusBadge>
              </div>

              <div className="space-y-1 text-stone-700 pt-1 border-t border-emerald-200/80">
                <p className="font-semibold text-emerald-950">
                  {language === 'hi' ? 'उपचार सलाह:' : 'Recommended Treatment:'}
                </p>
                <p className="text-xs leading-relaxed">{scanResult.treatment}</p>
                <div className="mt-1.5 p-2 bg-white rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-harvest-deep">
                    {language === 'hi' ? 'दवा व मात्रा:' : 'Dosage Prescription:'}
                  </span>{' '}
                  <span className="text-stone-700">{scanResult.dosage}</span>
                </div>
                <p className="text-[10px] text-stone-500 text-right pt-0.5">
                  AI Confidence: {scanResult.confidence}% • Validated for Mehsana Agro-Climatic Zone
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            size="md"
            variant="primary"
            fullWidth
            isLoading={isScanning}
            iconLeft={<Sparkles className="w-4 h-4" />}
            onClick={handleSimulateScan}
          >
            {isScanning
              ? (language === 'hi' ? 'जांच हो रही है...' : 'Diagnosing...')
              : (language === 'hi' ? 'तुरंत पत्ता जांचें (AI Scan)' : 'Start AI Leaf Scan')}
          </Button>
        </CardFooter>
      </Card>

      {/* Disease Directory & Symptom Search */}
      <div className="space-y-2.5">
        <div className="px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {language === 'hi' ? 'रोग व कीट निर्देशिका' : 'Field Disease & Symptom Database'}
          </h2>
          <p className="text-[11px] text-stone-500">
            {language === 'hi' ? 'लक्षणों द्वारा रोग खोजें और उपचार जानें' : 'Search common regional crop ailments and remedies'}
          </p>
        </div>

        <SearchInput
          placeholder={language === 'hi' ? 'रोग या लक्षण खोजें (जैसे: पीलापन, माहू, रतुआ)...' : 'Search by disease, crop, or symptoms...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {filteredDiseases.length === 0 ? (
          <EmptyState
            title={language === 'hi' ? 'कोई रोग नहीं मिला' : 'No Matching Symptoms Found'}
            description={language === 'hi' ? 'कृपया अलग शब्द खोजें या AI कैमरे से जांच करें।' : 'Try searching for different keywords or run an AI camera scan.'}
            actionLabel={language === 'hi' ? 'खोज साफ़ करें' : 'Clear Search'}
            onAction={() => setSearchQuery('')}
          />
        ) : (
          <div className="space-y-2">
            {filteredDiseases.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-harvest-primary bg-harvest-pale px-2 py-0.5 rounded-md">
                    {item.crop}
                  </span>
                  <StatusBadge
                    variant={item.severity === 'Critical' ? 'error' : item.severity === 'Moderate' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {item.severity}
                  </StatusBadge>
                </div>
                <h3 className="text-xs font-bold text-harvest-deep">{item.disease}</h3>
                <p className="text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-700">Symptoms:</span> {item.symptoms}
                </p>
                <div className="p-2 bg-[#F8FAF6] rounded-xl border border-stone-100 text-[11px] text-harvest-deep">
                  <span className="font-bold text-harvest-primary">Remedy:</span> {item.remedy} ({item.dosage})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
