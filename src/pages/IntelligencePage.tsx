import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  BrainCircuit,
  CloudRain,
  Sun,
  Droplets,
  MapPin,
  Send,
  Satellite,
  Info,
  CheckCircle2,
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

export const IntelligencePage = () => {
  const { language } = useLanguage();
  const [question, setQuestion] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text:
        language === 'hi'
          ? 'नमस्ते रमेश जी! मैं आपका हार्वेस्ट गार्ड AI कृषि वैज्ञानिक हूं। गेहूं की सिंचाई, खाद की मात्रा या मौसम से संबंधित कोई भी सवाल पूछें।'
          : 'Namaste Ramesh ji! I am your HarvestGuard AI Agronomist. Ask me any question regarding your wheat tillering, fertilizer schedule, or weather alerts.',
      time: 'Just now',
    },
  ]);
  const [isAsking, setIsAsking] = useState(false);

  const handleAsk = (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQ = question;
    setChatLog((prev) => [...prev, { sender: 'user', text: userQ, time: 'Now' }]);
    setQuestion('');
    setIsAsking(true);

    setTimeout(() => {
      setIsAsking(false);
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            language === 'hi'
              ? 'मेहसाणा क्षेत्र में अगले 48 घंटों में 65% बारिश की संभावना है। यूरिया का छिड़काव बारिश के बाद ही करें, ताकि पोषक तत्व धुल न जाएं।'
              : 'In Mehsana district, 65% precipitation is expected within 48 hours. Hold off on broadcasting urea until after the rain to avoid fertilizer runoff.',
          time: 'Just now',
        },
      ]);
    }, 900);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Demo Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            {language === 'hi'
              ? 'कृषि ज्ञान • उपग्रह और मौसम रडार (डेमो डेटा)'
              : 'Farm Intelligence • Sentinel NDVI & Micro-Radar (Demonstration Data)'}
          </span>
        </div>
        <StatusBadge variant="info" size="sm">
          Sentinel-2 L2A
        </StatusBadge>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-sky-100 text-sky-800">
            <BrainCircuit className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-extrabold text-harvest-deep">
            {language === 'hi' ? 'कृषि बुद्धिमत्ता व मौसम ज्ञान' : 'Farm Intelligence & Weather Radar'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'उपग्रह वनस्पति घनत्व, 5-दिवसीय मौसम रडार व व्यक्तिगत AI कृषि सलाह'
            : 'Satellite NDVI canopy vigor, micro-weather telemetry & agronomic advisory'}
        </p>
      </div>

      {/* 5-Day Weather & Irrigation Telemetry */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-harvest-primary" />
              <span>{language === 'hi' ? 'मेहसाणा ग्रामीण • 5 दिवसीय पूर्वानुमान' : 'Mehsana Rural • 5-Day Micro-Forecast'}</span>
            </CardTitle>
            <StatusBadge variant="warning" size="sm">
              {language === 'hi' ? '48 घंटे में बारिश (65%)' : 'Rain in 48h (65%)'}
            </StatusBadge>
          </div>
        </CardHeader>

        <CardContent className="pt-1">
          <div className="grid grid-cols-5 gap-1.5 text-center pt-1">
            {[
              { day: language === 'hi' ? 'आज' : 'Today', temp: '28°', rain: '10%', icon: Sun, spray: true },
              { day: language === 'hi' ? 'रवि' : 'Sun', temp: '29°', rain: '15%', icon: Sun, spray: true },
              { day: language === 'hi' ? 'सोम' : 'Mon', temp: '25°', rain: '65%', icon: CloudRain, alert: true },
              { day: language === 'hi' ? 'मंगल' : 'Tue', temp: '24°', rain: '40%', icon: CloudRain },
              { day: language === 'hi' ? 'बुध' : 'Wed', temp: '27°', rain: '5%', icon: Sun, spray: true },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between min-h-[96px] ${
                    item.alert
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                      : 'bg-[#F8FAF6] border-stone-200/80 text-harvest-deep'
                  }`}
                >
                  <span className="text-[10px] font-bold">{item.day}</span>
                  <Icon className={`w-4 h-4 my-1 ${item.alert ? 'text-amber-600' : 'text-amber-500'}`} />
                  <span className="text-xs font-extrabold">{item.temp}</span>
                  <span className="text-[9px] text-stone-500 flex items-center space-x-0.5 mt-0.5">
                    <Droplets className="w-2.5 h-2.5 text-sky-500 inline" />
                    <span>{item.rain}</span>
                  </span>
                  {item.spray && (
                    <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded mt-1">
                      Spray OK
                    </span>
                  )}
                  {item.alert && (
                    <span className="text-[8px] bg-amber-200 text-amber-900 font-bold px-1 rounded mt-1">
                      Rain Risk
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <p className="leading-snug">
              {language === 'hi'
                ? 'कृषि सलाह: अगले 24 घंटे कीटनाशक छिड़काव के लिए अनुकूल हैं। सोमवार की बारिश से पहले कार्य पूरा करें।'
                : 'Foliar spray window open for next 24 hours. Complete weed & nutrient application prior to Monday shower.'}
            </p>
          </div>
        </CardContent>
      </Card>

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
              ? 'हिंदी या अंग्रेजी में अपनी फसल के बारे में सवाल पूछें'
              : 'Ask questions about fertilizer dosages, spray schedules, or soil condition.'}
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
              <span className="ml-1 text-[11px]">Analyzing field telemetry...</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-2">
          <form onSubmit={handleAsk} className="flex items-center space-x-2 w-full">
            <FormInput
              placeholder={language === 'hi' ? 'जैसे: गेहूं में दूसरी सिंचाई कब करें?' : 'e.g. When is the second irrigation due?'}
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
