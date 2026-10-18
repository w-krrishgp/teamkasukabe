import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  CloudSun,
  ShieldAlert,
  Warehouse,
  Satellite,
  Info,
  ArrowRight,
  Send,
  Layers,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormInput,
  StatusBadge,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import { RISK_MANAGEMENT_WORKFLOWS } from '@/services/riskWorkflowService';

export const IntelligencePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [activeWorkflowIndex, setActiveWorkflowIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text:
        language === 'hi'
          ? 'नमस्ते रमेश जी! मैं आपका हार्वेस्ट गार्ड AI कृषि वैज्ञानिक हूं। गेहूं की सिंचाई, मौसम, रोग प्रकोप या कोल्ड स्टोरेज से संबंधित कोई भी सवाल पूछें।'
          : 'Namaste Ramesh ji! I am your HarvestGuard AI Agronomist. Ask me any question regarding your wheat tillering, weather radar, disease outbreaks, or cold storage availability.',
      time: 'Just now',
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const activeWorkflow = RISK_MANAGEMENT_WORKFLOWS[activeWorkflowIndex];

  const handleAsk = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setChatLog((prev) => [...prev, { sender: 'user', text: userQ, time: 'Now' }]);
    setQuestion('');
    setIsAsking(true);

    setTimeout(() => {
      setIsAsking(false);
      let responseText = '';
      const lower = userQ.toLowerCase();

      if (lower.includes('weather') || lower.includes('rain') || lower.includes('मौसम') || lower.includes('बारिश')) {
        responseText =
          language === 'hi'
            ? 'मेहसाणा में अगले 48 घंटों में 65% बारिश का अनुमान है। कीटनाशक छिड़काव आज दोपहर 12 बजे से पहले पूरा करें और नलकूप सिंचाई स्थगित रखें।'
            : '65% precipitation is forecast in Mehsana within 48 hours. Complete foliar sprays before noon today and hold off on canal irrigation.';
      } else if (lower.includes('disease') || lower.includes('rust') || lower.includes('रोग') || lower.includes('रतुआ')) {
        responseText =
          language === 'hi'
            ? 'वाडू गांव (3.8 किमी) में गेहूं में पीला रतुआ (Yellow Rust) देखा गया है। सुरक्षात्मक स्प्रे के लिए प्रोपिकोनाजोल 25% ईसी @ 1 मिली/लीटर पानी का प्रयोग करें।'
            : 'Yellow Rust cluster active in Vadu village (3.8 km away). Apply prophylactic Propiconazole 25% EC @ 1ml/L of water to shield your wheat canopy.';
      } else if (lower.includes('cold') || lower.includes('storage') || lower.includes('आलू') || lower.includes('स्टोरेज')) {
        responseText =
          language === 'hi'
            ? 'कड़ी किसान एग्रो कोल्ड चेन (4.5 किमी) में 1,150 MT क्षमता उपलब्ध है। किराया ₹42/क्विंटल/माह है। आप अभी टोकन आरक्षित कर सकते हैं।'
            : 'Kadi Kisan Agro Cold Chain (4.5 km away) has 1,150 MT available capacity at ₹42/Qtl/month. You can reserve a storage slot right now in the Cold Storage tab.';
      } else {
        responseText =
          language === 'hi'
            ? 'आपकी गेहूं की फसल में टिलरिंग (कल्ले) का चरण चल रहा है। नमी 68% इष्टतम है। सोमवार की बारिश के बाद ही यूरिया की दूसरी खुराक दें।'
            : 'Your wheat plot is currently in active tillering stage. Soil moisture is optimal at 68%. Apply the second urea top-dressing only after the upcoming rainfall.';
      }

      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: responseText,
          time: 'Just now',
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Tag & Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-stone-200 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            Member 3 • Farm Intelligence Hub (Features 4–6)
          </span>
        </div>
        <StatusBadge variant="info" size="sm">
          3 Workflows Active
        </StatusBadge>
      </div>

      {/* Main Page Title */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-900">
            <BrainCircuit className="w-5 h-5 text-harvest-primary" />
          </span>
          <h1 className="text-xl font-extrabold text-harvest-deep">
            {language === 'hi' ? 'कृषि बुद्धिमत्ता व जोखिम प्रबंधन' : 'Farm Intelligence & Risk Hub'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'मौसम रडार, रोग क्लस्टर प्रकोप व कोल्ड स्टोरेज संरक्षण वर्कफ़्लो'
            : 'Agro-weather telemetry, outbreak biosecurity clusters & cold chain preservation'}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* FINAL DELIVERABLE: THREE FARM-PLANNING & RISK-MANAGEMENT WORKFLOWS        */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#142318] via-[#1b3b2b] to-[#122b1c] text-white p-4 rounded-3xl shadow-lg border border-emerald-900/40 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-200">
              Final Deliverable • 3 Core Workflows
            </span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
            Interactive System
          </span>
        </div>

        {/* Workflow Selector Buttons */}
        <div className="grid grid-cols-3 gap-1.5">
          {RISK_MANAGEMENT_WORKFLOWS.map((wf, idx) => (
            <button
              key={wf.id}
              onClick={() => setActiveWorkflowIndex(idx)}
              className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between min-h-[58px] ${
                activeWorkflowIndex === idx
                  ? 'bg-white text-harvest-deep border-white shadow-md font-extrabold scale-[1.02]'
                  : 'bg-white/10 text-emerald-100 border-white/10 hover:bg-white/15'
              }`}
            >
              <span className="text-[9px] font-bold opacity-80 uppercase block">
                Deliverable {wf.deliverableNumber}
              </span>
              <span className="text-[11px] leading-tight line-clamp-2">
                {wf.deliverableNumber === 1
                  ? 'Weather & Spray'
                  : wf.deliverableNumber === 2
                  ? 'Outbreak Alert'
                  : 'Cold Storage'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Workflow Card Details */}
        <div className="p-3 bg-white/10 rounded-2xl border border-white/15 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                {activeWorkflow.badge}
              </span>
              <h2 className="text-sm font-extrabold text-white mt-0.5">
                {language === 'hi' ? activeWorkflow.titleHi : activeWorkflow.title}
              </h2>
              <p className="text-[11px] text-emerald-100/90 mt-0.5">
                {language === 'hi' ? activeWorkflow.subtitleHi : activeWorkflow.subtitle}
              </p>
            </div>
          </div>

          {/* 3 Step Interactive Workflow Progression */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            {activeWorkflow.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs space-x-2"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                      step.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : step.status === 'in_progress'
                        ? 'bg-amber-400 text-black'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {language === 'hi' ? step.titleHi : step.title}
                    </p>
                    <p className="text-[10px] text-emerald-200/80 line-clamp-1">
                      {language === 'hi' ? step.descriptionHi : step.description}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="text-[11px] font-bold h-7 px-2.5 bg-white text-harvest-deep hover:bg-emerald-100 shrink-0"
                  onClick={() => navigate(step.actionRoute)}
                >
                  {language === 'hi' ? step.actionLabelHi : step.actionLabel}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 CORE FEATURE LAUNCHERS (Features 4, 5, 6)                                */}
      {/* ========================================================================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Member 3 Core Agricultural Features
          </h2>
          <span className="text-[10px] text-stone-500">Instant Access</span>
        </div>

        {/* Feature 4: Weather & Spray Guidance Card */}
        <div
          onClick={() => navigate('/weather')}
          className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-harvest-primary cursor-pointer active:scale-[0.99] transition-all space-y-2 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-sky-800 bg-sky-50 px-2 py-0.2 rounded border border-sky-200">
                    Feature 4
                  </span>
                  <h3 className="text-xs font-extrabold text-harvest-deep">
                    Agro-Weather & Spray Radar
                  </h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Open-Meteo live API • Hourly spray suitability • Irrigation advisories
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-harvest-primary transition-colors shrink-0 mt-2" />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-100 text-stone-600">
            <span>Forecast: <strong>28°C • 15% Rain</strong></span>
            <span className="text-emerald-700 font-extrabold">Next Spray Window: 06:00 - 10:30 AM</span>
          </div>
        </div>

        {/* Feature 5: Disease Outbreak Alert Card */}
        <div
          onClick={() => navigate('/disease-outbreaks')}
          className="p-3.5 bg-white border border-rose-200 rounded-2xl shadow-xs hover:border-rose-500 cursor-pointer active:scale-[0.99] transition-all space-y-2 group bg-gradient-to-r from-white to-rose-50/40"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-rose-800 bg-rose-100 px-2 py-0.2 rounded border border-rose-200">
                    Feature 5
                  </span>
                  <h3 className="text-xs font-extrabold text-harvest-deep">
                    Disease Outbreak Alert & Clusters
                  </h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Geographic clusters • Neighbor contagion warning • Chemical dosage guide
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-600 transition-colors shrink-0 mt-2" />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-rose-100 text-rose-950">
            <span>Active Warning: <strong className="text-rose-700">Yellow Rust (3.8 km away)</strong></span>
            <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
              4 Clusters Active
            </span>
          </div>
        </div>

        {/* Feature 6: Cold Storage Card */}
        <div
          onClick={() => navigate('/cold-storage')}
          className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs hover:border-sky-600 cursor-pointer active:scale-[0.99] transition-all space-y-2 group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Warehouse className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-extrabold uppercase text-sky-800 bg-sky-50 px-2 py-0.2 rounded border border-sky-200">
                    Feature 6
                  </span>
                  <h3 className="text-xs font-extrabold text-harvest-deep">
                    Cold Storage & Post-Harvest Risk
                  </h3>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  WDRA warehouses • Live capacity tracking • Instant slot booking tokens
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-sky-700 transition-colors shrink-0 mt-2" />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-stone-100 text-stone-600">
            <span>Free Capacity: <strong>7,950 MT available</strong></span>
            <span className="text-sky-800 font-extrabold">Rates from ₹38/Qtl/mo</span>
          </div>
        </div>
      </div>

      {/* Satellite Crop Vigor (NDVI) Card */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center space-x-1.5">
              <Satellite className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? 'सेंटिनल उपग्रह फसल घनत्व (NDVI)' : 'Sentinel-2 Satellite Biomass Index'}</span>
            </CardTitle>
            <StatusBadge variant="success" size="sm">
              NDVI 0.74 (Healthy)
            </StatusBadge>
          </div>
          <CardDescription className="text-xs">
            {language === 'hi'
              ? 'खेत संख्या 1 (3.2 एकड़ गेहूं) का उपग्रह जैवभार विश्लेषण'
              : 'Multi-spectral satellite vegetation analysis for Plot #1 (3.2 Acres Wheat)'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="h-16 w-full rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-600 to-emerald-500 p-3 text-white flex items-end justify-between shadow-xs">
            <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              Canopy Coverage: 88%
            </span>
            <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
              Resolution: 10m Ground Pass
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-[11px] text-stone-600 bg-[#F8FAF6] p-2 rounded-xl border border-stone-200/60">
            <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
            <span>
              {language === 'hi'
                ? '94% क्षेत्र में वानस्पतिक कल्ले फूटने (tillering) की स्थिति उत्तम पाई गई है।'
                : 'Healthy vegetative growth observed across 94% of acreage with zero water stress pockets.'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* AI Agronomist Interactive Chat */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <CardTitle className="text-sm font-bold">
            {language === 'hi' ? 'AI कृषि वैज्ञानिक से बात करें' : 'Chat with AI Agronomist'}
          </CardTitle>
          <CardDescription className="text-xs">
            {language === 'hi'
              ? 'मौसम, कीटनाशक स्प्रे, रोग या कोल्ड स्टोरेज के बारे में प्रश्न पूछें'
              : 'Ask questions about weather windows, disease outbreaks, chemical dosage, or cold storage.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2.5 max-h-56 overflow-y-auto pt-1">
          {chatLog.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-harvest-primary text-white rounded-br-xs'
                    : 'bg-[#F8FAF6] text-harvest-deep border border-stone-200 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] text-stone-500 mt-0.5 px-1">{msg.time}</span>
            </div>
          ))}

          {isAsking && (
            <div className="flex items-center space-x-1 text-xs text-stone-500 p-2">
              <span className="w-2 h-2 rounded-full bg-harvest-primary animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-harvest-primary animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-harvest-primary animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">Analyzing Member 3 farm intelligence telemetry...</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2">
          <form onSubmit={handleAsk} className="flex items-center space-x-2 w-full">
            <FormInput
              placeholder={
                language === 'hi'
                  ? 'जैसे: क्या मुझे गेहूं में अभी स्प्रे करना चाहिए?'
                  : 'e.g. Is it safe to spray wheat today before rain?'
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="h-10 text-xs"
            />
            <Button
              type="submit"
              size="sm"
              variant="primary"
              className="h-10 px-3.5"
              disabled={isAsking || !question.trim()}
              iconLeft={<Send className="w-3.5 h-3.5" />}
            >
              {language === 'hi' ? 'पूछें' : 'Send'}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};
