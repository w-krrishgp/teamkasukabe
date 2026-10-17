import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Sprout,
  ShieldCheck,
  FileText,
  Share2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';

export const KhetScorePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const pillars = [
    {
      title: language === 'hi' ? 'मृदा स्वास्थ्य व NPK पोषक तत्व' : 'Soil Health & NPK Balance',
      score: '32 / 35',
      percentage: 91,
      status: language === 'hi' ? 'उत्तम' : 'Optimal',
      details: language === 'hi' ? 'pH 7.2 (तटस्थ), जैविक कार्बन 0.68%, पोटाश पर्याप्त' : 'pH 7.2 (Neutral), Organic Carbon 0.68%, Adequate Potash',
    },
    {
      title: language === 'hi' ? 'जल प्रबंधन व ड्रिप सिंचाई' : 'Water Security & Irrigation',
      score: '23 / 25',
      percentage: 92,
      status: language === 'hi' ? 'सटीक' : 'High Efficiency',
      details: language === 'hi' ? 'ड्रिप सिंचाई से 35% पानी की बचत, उपसतह नमी स्थिर' : 'Micro-drip saves 35% groundwater, optimal moisture',
    },
    {
      title: language === 'hi' ? 'उपग्रह NDVI बायोमास घनत्व' : 'Satellite NDVI Canopy Vigor',
      score: '18 / 20',
      percentage: 90,
      status: language === 'hi' ? 'सघन' : 'Dense Vigor',
      details: language === 'hi' ? 'सेंटिनल-2 उपग्रह सूचकांक 0.74, टिलरिंग वृद्धि तीव्र' : 'Sentinel-2 L2A index 0.74, vigorous vegetative tillering',
    },
    {
      title: language === 'hi' ? 'फसल विविधीकरण व बाजार जोखिम' : 'Crop Diversity & Resilience',
      score: '15 / 20',
      percentage: 75,
      status: language === 'hi' ? 'मध्यम' : 'Good Buffer',
      details: language === 'hi' ? 'गेहूं + सरसों सह-फसल से बाजार मूल्य सुरक्षा' : 'Wheat + Mustard companion cropping risk buffer',
    },
  ];

  const handleShare = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
          Khet Score Audit v2.4
        </span>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-[#122b1c] via-[#142318] to-[#1f3d2b] text-white p-5 rounded-3xl shadow-lg border border-emerald-900/40 text-center space-y-3 relative overflow-hidden">
        <div className="w-24 h-24 rounded-full border-4 border-emerald-400/40 bg-emerald-500/10 flex flex-col items-center justify-center mx-auto shadow-inner">
          <span className="text-3xl font-black text-white">88</span>
          <span className="text-[10px] uppercase font-bold text-emerald-300">/ 100</span>
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 border border-emerald-400/30 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'ग्रेड A+ • उत्कृष्ट कृषि स्वास्थ्य' : 'Grade A+ • Excellent Farm Health'}</span>
          </div>
          <h1 className="text-base font-extrabold text-white pt-1">
            {language === 'hi' ? 'खेड़ा फार्म #1, मेहसाणा' : 'Kheda Farm #1, Mehsana Plot #4'}
          </h1>
          <p className="text-xs text-emerald-100/80 max-w-xs mx-auto">
            {language === 'hi'
              ? 'मृदा पोषक तत्व, उपग्रह सूचकांक और जल संरक्षण के आधार पर प्रमाणित स्कोर।'
              : 'Certified agronomic composite derived from soil testing, satellite telemetry & water audit.'}
          </p>
        </div>

        {/* Banking Readiness Pill */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/90">
          <span className="flex items-center space-x-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'KCC बैंक ऋण पात्रता:' : 'KCC Bank Credit Grade:'}</span>
          </span>
          <span className="font-extrabold text-white bg-white/10 px-2 py-0.5 rounded-md">
            {language === 'hi' ? 'स्वीकृत (₹1.75 लाख)' : 'Pre-Approved (₹1.75L)'}
          </span>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
          {language === 'hi' ? 'स्कोर के 4 मुख्य घटक' : 'Score Component Breakdown'}
        </h3>

        <div className="space-y-2">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-harvest-deep">{p.title}</span>
                <span className="text-xs font-extrabold text-harvest-primary bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {p.score}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-harvest-primary to-emerald-400 rounded-full"
                  style={{ width: `${p.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>{p.details}</span>
                <span className="font-semibold text-emerald-700">{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Agronomic Actions */}
      <Card variant="warm" className="border-emerald-200 bg-[#F4F9F2]">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-harvest-deep flex items-center space-x-1.5">
            <Sprout className="w-4 h-4 text-harvest-primary" />
            <span>{language === 'hi' ? 'स्कोर सुधार के लिए सुझाव' : 'Agronomic Action Plan (+5 Pts)'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 space-y-2 text-xs text-stone-700">
          <div className="flex items-start space-x-2 p-2.5 bg-white rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {language === 'hi'
                ? 'टिलर विकास में तेजी लाने के लिए 15 किग्रा/एकड़ जिंक सल्फेट (21%) डालें।'
                : 'Apply 15 kg/acre Zinc Sulphate (21%) during the first irrigation to accelerate tillering.'}
            </p>
          </div>
          <div className="flex items-start space-x-2 p-2.5 bg-white rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {language === 'hi'
                ? 'गेहूं की मेड़ों पर गेंदे के फूल लगाएं, जिससे प्राकृतिक कीट नियंत्रण होगा।'
                : 'Plant border marigold rows on wheat ridges as a natural biological trap crop.'}
            </p>
          </div>
        </CardContent>
      </Card>

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
              ? (language === 'hi' ? 'लिंक कॉपी हुआ!' : 'Copied to Clipboard!')
              : (language === 'hi' ? 'सर्टिफिकेट शेयर करें' : 'Share Khet Certificate')}
          </span>
        </Button>
        <Button
          variant="primary"
          className="flex-1 h-11 text-xs font-bold bg-harvest-primary text-white"
          onClick={() => navigate('/finance')}
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          <span>{language === 'hi' ? 'KCC ऋण लागू करें' : 'Apply for KCC Loan'}</span>
        </Button>
      </div>
    </div>
  );
};
