import { useState } from 'react';
import {
  User,
  MapPin,
  Phone,
  Database,
  Languages,
  HardDrive,
  HelpCircle,
  RefreshCw,
  Info,
  FileText,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  FormSelect,
  StatusBadge,
} from '@/components/common';
import { MOCK_FARMER_PROFILE, isSupabaseLive } from '@/services/supabase';
import { env } from '@/config/env';
import { useLanguage, type Language } from '@/context/LanguageContext';

export const ProfilePage = () => {
  const { language, setLanguage } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(
    language === 'hi' ? 'सभी स्थानीय डेटा क्लाउड से सिंक है' : 'All field telemetry up to date'
  );

  const handleManualSync = () => {
    setIsSyncing(true);
    setSyncStatus(language === 'hi' ? 'सिंक किया जा रहा है...' : 'Syncing with HarvestGuard cloud...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus(language === 'hi' ? 'सफलतापूर्वक सिंक हुआ' : 'Synchronized successfully just now');
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Demo Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            {language === 'hi'
              ? 'डिजिटल किसान पहचान व भूमि रिकॉर्ड (प्रमाणित डेमो डेटा)'
              : 'Digital Farmer Identity & Land Registry (Verified Schema)'}
          </span>
        </div>
        <StatusBadge variant="success" size="sm">
          Aadhaar e-KYC
        </StatusBadge>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <User className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-extrabold text-harvest-deep">
            {language === 'hi' ? 'किसान प्रोफ़ाइल व सेटिंग्स' : 'Farmer Profile & Settings'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'डिजिटल किसान आईडी, पंजीकृत भूमि रिकॉर्ड व क्लाउड डेटाबेस स्थिति'
            : 'Digital Kisan credentials, registered land registry & offline sync controls'}
        </p>
      </div>

      {/* Profile Card */}
      <Card variant="default" className="shadow-sm border-stone-200">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-harvest-primary to-harvest-sage flex items-center justify-center text-white text-xl font-bold shadow-xs">
                RP
              </div>
              <div>
                <h2 className="text-base font-extrabold text-harvest-deep">
                  {MOCK_FARMER_PROFILE.fullName}
                </h2>
                <p className="text-xs text-stone-600 flex items-center space-x-1 mt-0.5">
                  <Phone className="w-3 h-3 text-stone-400" />
                  <span>{MOCK_FARMER_PROFILE.phone}</span>
                </p>
                <p className="text-xs text-stone-600 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{MOCK_FARMER_PROFILE.village}, {MOCK_FARMER_PROFILE.state}</span>
                </p>
              </div>
            </div>
            <StatusBadge variant="success" size="sm" showDot>
              Aadhaar KYC
            </StatusBadge>
          </div>

          <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500">Kisan ID</span>
              <p className="font-bold text-harvest-deep">{MOCK_FARMER_PROFILE.kisanId}</p>
            </div>
            <div className="bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-100">
              <span className="text-[10px] text-stone-500">
                {language === 'hi' ? 'पंजीकृत भूमि' : 'Registered Land'}
              </span>
              <p className="font-bold text-harvest-deep">{MOCK_FARMER_PROFILE.totalLandAcres} Acres</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Land Holdings Details */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-harvest-primary" />
            <CardTitle className="text-xs uppercase font-bold text-stone-600">
              {language === 'hi' ? 'भूमि स्वामित्व रिकॉर्ड' : 'Digital Land Ownership Record'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-1 text-xs">
          <div className="p-3 bg-[#F8FAF6] rounded-xl border border-stone-100 space-y-1">
            <div className="flex justify-between font-bold text-harvest-deep">
              <span>Plot #1: Kheda Kalan Survey 104/A</span>
              <span className="text-harvest-primary">3.2 Acres</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Soil: Sandy Loam • Irrigation: Borewell Tubewell • Crop: Wheat HD-2967
            </p>
          </div>

          <div className="p-3 bg-[#F8FAF6] rounded-xl border border-stone-100 space-y-1">
            <div className="flex justify-between font-bold text-harvest-deep">
              <span>Plot #2: Kheda Kalan Survey 108/B</span>
              <span className="text-harvest-primary">2.3 Acres</span>
            </div>
            <p className="text-[11px] text-stone-500">
              Soil: Alluvial • Irrigation: Canal / Drip • Crop: Mustard & Cotton
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Language Preference */}
      <Card variant="warm">
        <CardHeader className="pb-1">
          <CardTitle className="text-xs uppercase font-bold text-harvest-deep flex items-center space-x-1.5">
            <Languages className="w-4 h-4 text-harvest-primary" />
            <span>App Language • भाषा चयन</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1">
          <FormSelect
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            options={[
              { label: 'English (English)', value: 'en' },
              { label: 'हिन्दी (Hindi)', value: 'hi' },
            ]}
          />
        </CardContent>
      </Card>

      {/* Backend & Cloud Sync Telemetry */}
      <Card variant="default" className="border-stone-200 shadow-sm">
        <CardHeader className="pb-1">
          <div className="flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-harvest-primary" />
            <CardTitle className="text-sm font-bold text-harvest-deep">
              Backend & Cloud Sync Telemetry
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Supabase client & Android local storage status
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2.5 text-xs pt-1">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF6] border border-stone-100">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-harvest-primary" />
              <div>
                <p className="font-bold text-harvest-deep">Supabase Cloud Engine</p>
                <p className="text-[10px] text-stone-500 truncate max-w-[190px]">
                  {env.supabaseUrl}
                </p>
              </div>
            </div>
            <StatusBadge variant={isSupabaseLive ? 'success' : 'earth'} size="sm">
              {isSupabaseLive ? 'Live Cloud' : 'Demo Offline Seed'}
            </StatusBadge>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAF6] border border-stone-100">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-harvest-primary" />
              <div>
                <p className="font-bold text-harvest-deep">Android Offline SQLite Cache</p>
                <p className="text-[10px] text-stone-500">{syncStatus}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs px-2.5"
              isLoading={isSyncing}
              iconLeft={<RefreshCw className="w-3 h-3" />}
              onClick={handleManualSync}
            >
              Sync
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Kisan Helpline */}
      <div className="p-3 bg-[#F1F5EE] border border-stone-200 rounded-2xl flex items-center justify-between text-xs text-harvest-deep">
        <div className="flex items-center space-x-2.5">
          <HelpCircle className="w-4 h-4 text-harvest-primary" />
          <span>Kisan Call Center: 1800-180-1551</span>
        </div>
        <a
          href="tel:18001801551"
          className="text-xs font-bold text-harvest-primary underline"
        >
          Call Free
        </a>
      </div>
    </div>
  );
};
