import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CloudSun,
  Wind,
  AlertTriangle,
  Sun,
  MapPin,
  RefreshCw,
  Clock,
  Droplets,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import {
  AGRICULTURAL_LOCATIONS,
  getAgriWeatherForecast,
} from '@/services/weatherService';
import type { LocationOption, WeatherReport } from '@/types/intelligence';
import { getFarmLocation } from '@/services/deviceService';

export const WeatherPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(
    AGRICULTURAL_LOCATIONS[0]
  );
  const [weatherData, setWeatherData] = useState<WeatherReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGpsLocating, setIsGpsLocating] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [filterSprayOnly, setFilterSprayOnly] = useState(false);

  const fetchWeather = (loc: LocationOption) => {
    setIsLoading(true);
    getAgriWeatherForecast(loc)
      .then((data) => {
        setWeatherData(data);
      })
      .catch((err) => {
        console.error('Error fetching weather data', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    getAgriWeatherForecast(selectedLocation)
      .then((data) => {
        if (isMounted) {
          setWeatherData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching weather data', err);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedLocation]);

  const handleUseGps = async () => {
    setIsGpsLocating(true);
    try {
      const coords = await getFarmLocation();
      const gpsLocation: LocationOption = {
        id: 'loc-gps-live',
        name: coords.locality || 'GPS Registered Field',
        taluka: 'Local Taluka',
        district: 'Current District',
        state: 'India',
        latitude: coords.latitude,
        longitude: coords.longitude,
        isCurrent: true,
      };
      setSelectedLocation(gpsLocation);
      setIsLocationModalOpen(false);
    } finally {
      setIsGpsLocating(false);
    }
  };

  const handleSelectPreset = (loc: LocationOption) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-harvest-deep transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Feature 4 • Agro-Weather
          </span>
        </div>
      </div>

      {/* Title & Location Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-harvest-deep flex items-center space-x-2">
            <CloudSun className="w-6 h-6 text-sky-600" />
            <span>{language === 'hi' ? 'कृषि मौसम व छिड़काव रडार' : 'Weather & Spray Window Radar'}</span>
          </h1>
          <button
            onClick={() => fetchWeather(selectedLocation)}
            disabled={isLoading}
            title="Refresh Data"
            className="p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-harvest-primary' : ''}`} />
          </button>
        </div>

        {/* Location Dropdown Trigger */}
        <div className="flex items-center justify-between bg-white border border-stone-200 p-2.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center space-x-2 text-left flex-1 min-w-0 group"
          >
            <div className="w-8 h-8 rounded-xl bg-harvest-pale text-harvest-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-harvest-deep truncate">
                  {selectedLocation.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              </div>
              <p className="text-[10px] text-stone-500 truncate">
                {selectedLocation.taluka}, {selectedLocation.district} ({selectedLocation.latitude.toFixed(2)}°N, {selectedLocation.longitude.toFixed(2)}°E)
              </p>
            </div>
          </button>

          <button
            onClick={handleUseGps}
            disabled={isGpsLocating}
            className="text-[11px] font-bold text-harvest-primary bg-harvest-pale/60 hover:bg-harvest-pale px-2.5 py-1.5 rounded-xl border border-harvest-primary/20 transition-all flex items-center space-x-1 shrink-0 ml-2"
          >
            <Zap className={`w-3 h-3 ${isGpsLocating ? 'animate-spin' : ''}`} />
            <span>{isGpsLocating ? 'Locating...' : 'Live GPS'}</span>
          </button>
        </div>

        {/* API Connection & Data Source Badge */}
        <div className="flex items-center justify-between px-1 text-[11px]">
          <span className="text-stone-500">
            {language === 'hi' ? 'अंतिम अपडेट:' : 'Telemetry Source:'}
          </span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
              weatherData?.dataSource === 'live_open_meteo'
                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                : 'bg-stone-100 text-stone-700 border border-stone-200'
            }`}
          >
            {weatherData?.dataSource === 'live_open_meteo'
              ? '● Live Open-Meteo Satellite Feed'
              : '● IMD Agro-Met Verified Benchmark (Offline)'}
          </span>
        </div>
      </div>

      {/* Main Meteorological Card */}
      {weatherData && (
        <div className="bg-gradient-to-br from-[#1b3b2b] via-[#142318] to-[#122b1c] text-white p-5 rounded-3xl shadow-lg border border-emerald-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'वर्तमान मौसम स्थिति' : 'Current Conditions'}
              </span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-4xl font-extrabold tracking-tight">
                  {weatherData.currentTempC}°C
                </span>
                <span className="text-xs text-emerald-200 font-medium">
                  Feels like {weatherData.feelsLikeC}°C
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-100 mt-1">
                {weatherData.weatherDescription}
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <Sun className="w-9 h-9 animate-spin-slow" />
            </div>
          </div>

          {/* 3 Telemetry Quick Indicators */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 block">
                {language === 'hi' ? 'हवा की गति' : 'Wind Speed'}
              </span>
              <span className="text-sm font-extrabold text-white">
                {weatherData.windSpeedKmh} km/h
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 block">
                {language === 'hi' ? 'आर्द्रता' : 'Humidity'}
              </span>
              <span className="text-sm font-extrabold text-white">
                {weatherData.humidityPercent}%
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-emerald-200/80 block">
                {language === 'hi' ? 'बारिश जोखिम' : 'Precipitation'}
              </span>
              <span
                className={`text-sm font-extrabold ${
                  weatherData.precipitationProbability > 30 ? 'text-amber-300' : 'text-emerald-300'
                }`}
              >
                {weatherData.precipitationProbability}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Workflow 1 Deliverable Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-harvest-deep text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Workflow 1 Deliverable
            </span>
          </div>
          <p className="text-xs font-extrabold">Climate Risk & Spray Planning</p>
          <p className="text-[10px] text-emerald-100">
            Automated spray suitability window & irrigation delay protocol
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs bg-white text-harvest-deep hover:bg-emerald-50 shrink-0 font-bold"
          onClick={() => navigate('/intelligence')}
        >
          View Hub
        </Button>
      </div>

      {/* Hourly Spray Windows Matrix */}
      {weatherData && (
        <Card variant="default" className="border-stone-200">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-harvest-deep flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-harvest-primary" />
                <span>
                  {language === 'hi'
                    ? 'प्रति घंटा छिड़काव अनुकूलता रडार'
                    : 'Hourly Spray Window Matrix'}
                </span>
              </CardTitle>
              <button
                onClick={() => setFilterSprayOnly(!filterSprayOnly)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                  filterSprayOnly
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-stone-100 text-stone-600 border-stone-200'
                }`}
              >
                {filterSprayOnly ? 'Showing Optimal Only' : 'Show All Hours'}
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-2 pt-1 text-xs">
            <p className="text-stone-500 text-[11px]">
              Calculated using wind drift velocity, leaf-canopy wetness, and rainfall threshold.
            </p>

            <div className="space-y-1.5 pt-1">
              {weatherData.hourly
                .filter((h) => (!filterSprayOnly ? true : h.spraySuitability === 'optimal'))
                .map((h, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border flex flex-col space-y-1 transition-all ${
                      h.spraySuitability === 'optimal'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : h.spraySuitability === 'caution'
                        ? 'bg-amber-50/60 border-amber-200'
                        : 'bg-rose-50/60 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="font-extrabold text-harvest-deep w-16">{h.time}</span>
                        <span className="font-bold text-stone-700">{h.temperatureC}°C</span>
                        <span className="text-[11px] text-stone-500 flex items-center space-x-0.5">
                          <Wind className="w-3 h-3 text-stone-400" />
                          <span>{h.windSpeedKmh} km/h</span>
                        </span>
                        <span className="text-[11px] text-stone-500 flex items-center space-x-0.5">
                          <Droplets className="w-3 h-3 text-sky-400" />
                          <span>{h.precipitationProbability}%</span>
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          h.spraySuitability === 'optimal'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : h.spraySuitability === 'caution'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {h.spraySuitability}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-600 pl-0.5">{h.sprayReason}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agricultural Guidance Cards */}
      {weatherData && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600 px-1">
            {language === 'hi' ? 'विशिष्ट कृषि सलाह व चेतावनी' : 'Actionable Agricultural Guidance'}
          </h2>

          <div className="space-y-2">
            {weatherData.guidance.map((g) => (
              <div
                key={g.id}
                className={`p-3.5 rounded-2xl border shadow-xs space-y-1.5 ${
                  g.severity === 'optimal'
                    ? 'bg-emerald-50/90 border-emerald-300/80 text-emerald-950'
                    : g.severity === 'warning'
                    ? 'bg-amber-50/90 border-amber-300/80 text-amber-950'
                    : 'bg-rose-50/90 border-rose-300/80 text-rose-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    {g.severity === 'optimal' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    )}
                    <h3 className="text-xs font-extrabold">{g.title}</h3>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/80 border border-current">
                    {g.timeWindow}
                  </span>
                </div>

                <p className="text-xs leading-relaxed opacity-90">{g.description}</p>

                <div className="pt-1 border-t border-black/5 flex items-center justify-between text-[11px]">
                  <span className="font-bold">Recommendation:</span>
                  <span className="font-semibold text-right flex-1 pl-2">{g.recommendedAction}</span>
                </div>

                <div className="text-[9px] text-stone-500 pt-0.5 flex justify-end">
                  Source: {g.sourceBadge} ({g.confidence}% confidence)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5-Day Multi-Day Agro-Met Forecast */}
      {weatherData && (
        <Card variant="default" className="border-stone-200">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-harvest-primary" />
              <span>{language === 'hi' ? '5 दिवसीय कृषि मौसम पूर्वानुमान' : '5-Day Multi-Day Agro Forecast'}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-1 space-y-2">
            {weatherData.daily.map((d, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-stone-200/70 bg-[#F9FAF8] flex items-start justify-between space-x-2 text-xs"
              >
                <div className="w-20 shrink-0">
                  <span className="font-extrabold text-harvest-deep block">{d.dayName}</span>
                  <span className="text-[10px] text-stone-500">{d.date.slice(5)}</span>
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                      d.spraySuitable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {d.spraySuitable ? 'Spray OK' : 'Spray No'}
                  </span>
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-harvest-deep">{d.maxTempC}° / {d.minTempC}°</span>
                    <span className="text-[11px] text-stone-600 flex items-center space-x-0.5">
                      <Droplets className="w-3 h-3 text-sky-500" />
                      <span>{d.precipitationProbability}% Rain</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">{d.agriculturalGuidance}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-3.5 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-harvest-deep">
                  Select Agricultural Hub
                </h3>
                <p className="text-xs text-stone-500">
                  Choose a farming district or use live GPS telemetry
                </p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <button
              onClick={handleUseGps}
              disabled={isGpsLocating}
              className="w-full p-3 rounded-2xl bg-harvest-pale text-harvest-deep border border-harvest-primary/30 flex items-center justify-between hover:bg-emerald-100 transition-colors font-bold text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className="w-4 h-4 text-harvest-primary" />
                <span>Use Device GPS (Current Farm Coordinates)</span>
              </div>
              <span className="text-[10px] bg-white text-harvest-primary px-2 py-0.5 rounded-full font-extrabold">
                Auto
              </span>
            </button>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pt-1">
              {AGRICULTURAL_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => handleSelectPreset(loc)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                    selectedLocation.id === loc.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                      : 'bg-[#F8FAF6] border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div>
                    <p className="font-extrabold">{loc.name}</p>
                    <p className="text-[10px] text-stone-500">
                      {loc.taluka}, {loc.district} • {loc.state}
                    </p>
                  </div>
                  {selectedLocation.id === loc.id && (
                    <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
