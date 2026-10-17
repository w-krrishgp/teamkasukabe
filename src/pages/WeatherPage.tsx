import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CloudSun,
  Wind,
  AlertTriangle,
  Sun,
  ShieldCheck,
  MapPin,
  RefreshCw,
  Clock,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatusBadge,
} from '@/components/common';
import { getFarmLocation, LocationCoordinates } from '@/services/deviceService';
import { useLanguage } from '@/context/LanguageContext';

export const WeatherPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [location, setLocation] = useState<LocationCoordinates>({
    latitude: 23.588,
    longitude: 72.3693,
    source: 'fallback_registered_farm',
    locality: 'Kheda Farm #1, Mehsana, Gujarat',
  });
  const [isUpdatingGps, setIsUpdatingGps] = useState(false);

  const handleRefreshLocation = async () => {
    setIsUpdatingGps(true);
    try {
      const coords = await getFarmLocation();
      setLocation(coords);
    } finally {
      setIsUpdatingGps(false);
    }
  };

  const hourlyForecast = [
    { time: '08:00 AM', temp: '24°C', rain: '5%', wind: '8 km/h', spray: 'Optimal' },
    { time: '11:00 AM', temp: '28°C', rain: '10%', wind: '11 km/h', spray: 'Optimal' },
    { time: '02:00 PM', temp: '31°C', rain: '15%', wind: '14 km/h', spray: 'Caution' },
    { time: '05:00 PM', temp: '27°C', rain: '20%', wind: '10 km/h', spray: 'Optimal' },
    { time: '08:00 PM', temp: '22°C', rain: '45%', wind: '16 km/h', spray: 'Unsuitable' },
  ];

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
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
          IMD Agro-Met Telemetry
        </span>
      </div>

      {/* Header & GPS Locality */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-harvest-deep flex items-center space-x-2">
            <CloudSun className="w-5 h-5 text-sky-600" />
            <span>{language === 'hi' ? 'कृषि मौसम व छिड़काव रडार' : 'Weather & Spray Window Radar'}</span>
          </h1>
          <button
            onClick={handleRefreshLocation}
            disabled={isUpdatingGps}
            title="Refresh GPS"
            className="p-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingGps ? 'animate-spin text-harvest-primary' : ''}`} />
          </button>
        </div>
        <p className="text-xs text-stone-600 flex items-center space-x-1">
          <MapPin className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span>{location.locality}</span>
          <span className="text-[10px] text-stone-600">({location.latitude.toFixed(2)}°N, {location.longitude.toFixed(2)}°E)</span>
        </p>
      </div>

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-[#1b3b2b] via-[#142318] to-[#122b1c] text-white p-5 rounded-3xl shadow-lg border border-emerald-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              {language === 'hi' ? 'वर्तमान मौसम' : 'Live Observation'}
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span className="text-4xl font-extrabold tracking-tight">28°C</span>
              <span className="text-xs text-emerald-200 font-medium">Feels like 29°C</span>
            </div>
            <p className="text-xs font-semibold text-emerald-100 mt-1">
              {language === 'hi' ? 'स्वच्छ धूप • हवा 9 किमी/घंटा' : 'Clear Sunlight • Mild Northerly Breeze'}
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
            <Sun className="w-10 h-10 animate-spin-slow" />
          </div>
        </div>

        {/* 4 Micro-telemetry Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-200/80 block">{language === 'hi' ? 'आर्द्रता' : 'Humidity'}</span>
            <span className="text-sm font-extrabold text-white">48%</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-200/80 block">{language === 'hi' ? 'हवा की गति' : 'Wind Speed'}</span>
            <span className="text-sm font-extrabold text-white">9 km/h</span>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-200/80 block">{language === 'hi' ? 'बारिश जोखिम' : 'Rain Risk'}</span>
            <span className="text-sm font-extrabold text-amber-300">10%</span>
          </div>
        </div>
      </div>

      {/* Spray Window Advisory Card (Crucial for farmers) */}
      <Card variant="warm" className="border-emerald-200 bg-[#F4F9F2] shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-harvest-deep flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? 'कीटनाशक व खाद छिड़काव अनुकूलता' : 'Foliar Spray Suitability Index'}</span>
            </CardTitle>
            <StatusBadge variant="success" size="sm" showDot>
              {language === 'hi' ? 'छिड़काव के लिए उत्तम' : 'Ideal Window'}
            </StatusBadge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pt-1 text-xs">
          <p className="text-stone-700 leading-relaxed">
            {language === 'hi'
              ? 'अगले 24 घंटे कीटनाशक या खरपतवार नाशक छिड़काव के लिए अनुकूल हैं। हवा की गति 10 किमी/घंटा से कम है और दोपहर तक तेज बारिश की संभावना नहीं है।'
              : 'Conditions are optimal for foliar spray over the next 24 hours. Wind velocity is gentle (<10 km/h) ensuring minimal drift loss before Monday showers.'}
          </p>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start space-x-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-xs">
                {language === 'hi' ? 'सोमवार दोपहर बारिश चेतावनी' : 'Heavy Shower Alert on Monday'}
              </p>
              <p className="text-[11px] text-amber-800">
                {language === 'hi'
                  ? 'सोमवार को 65% बारिश का अनुमान है। यूरिया छिड़काव बारिश के बाद तक टालें।'
                  : 'Postpone granular urea top dressing until after Monday rain to prevent leaching.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Spray Windows */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-harvest-primary" />
            <span>{language === 'hi' ? 'आज का प्रति घंटा छिड़काव समय' : 'Hourly Spray Windows'}</span>
          </h3>
          <span className="text-[10px] text-stone-500">Live Forecast</span>
        </div>

        <div className="space-y-1.5">
          {hourlyForecast.map((h, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl border border-stone-100 bg-[#F9FAF8] flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-3">
                <span className="font-extrabold text-harvest-deep w-16">{h.time}</span>
                <span className="text-stone-700 font-semibold">{h.temp}</span>
                <span className="text-[11px] text-stone-500 flex items-center space-x-0.5">
                  <Wind className="w-3 h-3 text-stone-400" />
                  <span>{h.wind}</span>
                </span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  h.spray === 'Optimal'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : h.spray === 'Caution'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                {h.spray}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
