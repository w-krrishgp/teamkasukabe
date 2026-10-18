import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Radar,
  PlusCircle,
  CheckCircle2,
  Filter,
  Sparkles,
  Info,
  Flame,
  ChevronRight,
  Bell,
  BellRing,
  Radio,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  FormInput,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import {
  getOutbreakReports,
  getDiseaseClusters,
  reportOutbreakSighting,
  calculateBioSecurityRiskIndex,
} from '@/services/diseaseOutbreakService';
import {
  broadcastOutbreakAlert,
  requestPushPermission,
} from '@/services/notificationService';
import { isConfigured } from '@/config/env';
import type {
  DiseaseOutbreakReport,
  DiseaseSeverity,
  OutbreakSightingInput,
} from '@/types/intelligence';

export const DiseaseOutbreakPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [reports, setReports] = useState<DiseaseOutbreakReport[]>(() => getOutbreakReports());
  const clusters = useMemo(() => getDiseaseClusters(), []);
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState<string | null>('outbreak-001');
  const [reportSuccessMessage, setReportSuccessMessage] = useState<string | null>(null);
  const [pushStatus, setPushStatus] = useState<string>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);

  // Form State
  const [newCrop, setNewCrop] = useState('Wheat');
  const [newDisease, setNewDisease] = useState('Yellow Rust / Leaf Blotch');
  const [newSeverity, setNewSeverity] = useState<DiseaseSeverity>('high');
  const [newVillage, setNewVillage] = useState('Kheda Farm #1, Mehsana');
  const [newSymptoms, setNewSymptoms] = useState('');
  const [newAcres, setNewAcres] = useState('2.5');

  const handleRequestPush = async () => {
    const res = await requestPushPermission();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
    if (res.granted) {
      setReportSuccessMessage(
        language === 'hi'
          ? 'पुश नोटिफिकेशन सक्षम! अब आपके डिवाइस पर रोग अलर्ट आएंगे।'
          : 'Push Notifications enabled! Real-time outbreak alerts will arrive on this device.'
      );
      setTimeout(() => setReportSuccessMessage(null), 5000);
    }
  };

  const handleBroadcastTest = async () => {
    setIsSendingTestAlert(true);
    await broadcastOutbreakAlert({
      diseaseName: 'Yellow Rust (Puccinia striiformis)',
      crop: 'Wheat HD-2967',
      village: 'Vadu Village, Kadi',
      distanceKm: 3.8,
      severity: 'critical',
    });
    setIsSendingTestAlert(false);
  };

  const riskMetrics = useMemo(() => calculateBioSecurityRiskIndex(reports), [reports]);

  const crops = ['All', 'Wheat', 'Mustard', 'Potato', 'Cotton', 'Tomato'];

  const filteredReports = useMemo(() => {
    if (selectedCropFilter === 'All') return reports;
    return reports.filter((r) => r.crop.toLowerCase().includes(selectedCropFilter.toLowerCase()));
  }, [reports, selectedCropFilter]);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input: OutbreakSightingInput = {
      crop: newCrop,
      diseaseName: newDisease,
      severity: newSeverity,
      village: newVillage,
      taluka: 'Kadi',
      symptoms: newSymptoms || 'Early stage foliar discoloration and pathogen lesions observed.',
      affectedAcres: Number(newAcres) || 2,
    };

    const created = reportOutbreakSighting(input);
    setReports((prev) => [created, ...prev]);
    setIsReportModalOpen(false);

    // Broadcast push notification + in-app audio chime + system notification
    broadcastOutbreakAlert({
      diseaseName: created.diseaseName,
      crop: created.crop,
      village: created.village,
      distanceKm: created.distanceKm,
      severity: created.severity,
      preventiveProtocol: created.preventiveProtocol,
    });

    setReportSuccessMessage(
      language === 'hi'
        ? `अलर्ट सफलतापूर्वक दर्ज व प्रसारित! केवीके वैज्ञानिक और निकटवर्ती किसानों को सूचना भेज दी गई।`
        : `Sighting registered! Notification broadcasted to ICAR-KVK Mehsana and neighboring farmers.`
    );
    setTimeout(() => setReportSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-stone-600 hover:text-harvest-deep transition-colors p-1 -ml-1 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </button>
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
          <span>Feature 5 • Bio-Security</span>
        </span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-harvest-deep flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>{language === 'hi' ? 'रोग प्रकोप व क्लस्टर चेतावनी' : 'Disease Outbreak Alert & Clusters'}</span>
          </h1>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-harvest-primary text-harvest-primary font-bold"
            onClick={() => setIsReportModalOpen(true)}
            iconLeft={<PlusCircle className="w-3.5 h-3.5" />}
          >
            {language === 'hi' ? 'रिपोर्ट करें' : 'Report Sighting'}
          </Button>
        </div>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'क्षेत्रीय रोग क्लस्टर, निकटवर्ती संक्रमण रडार व रासायनिक/जैविक रोकथाम गाइड'
            : 'Geographic pathogen clustering, neighbor contagion radius & chemical containment protocols'}
        </p>
      </div>

      {/* Firebase Cloud Messaging & Push Notification Controller */}
      <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-xs font-extrabold text-harvest-deep">
              Outbreak Notification Dispatcher
            </span>
          </div>
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
              isConfigured.firebase
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-sky-100 text-sky-800 border border-sky-300'
            }`}
          >
            {isConfigured.firebase ? '● Firebase FCM Configured' : '● HTML5 Web Push Active'}
          </span>
        </div>

        <p className="text-[11px] text-stone-600 leading-snug">
          Instant multi-channel alert delivery via Firebase Cloud Messaging (FCM), HTML5 Web Notifications, and audible chimes to neighboring farmers.
        </p>

        <div className="flex items-center space-x-2 pt-1 border-t border-stone-100">
          <Button
            size="sm"
            variant={pushStatus === 'granted' ? 'outline' : 'primary'}
            className="text-xs h-8 px-2.5 font-bold"
            onClick={handleRequestPush}
            disabled={pushStatus === 'granted'}
            iconLeft={<Bell className="w-3.5 h-3.5" />}
          >
            {pushStatus === 'granted' ? 'Push Alerts Active' : 'Enable Device Push'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="text-xs h-8 px-2.5 font-bold bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100"
            onClick={handleBroadcastTest}
            disabled={isSendingTestAlert}
            iconLeft={<BellRing className="w-3.5 h-3.5 text-rose-700" />}
          >
            {isSendingTestAlert ? 'Broadcasting...' : 'Simulate Outbreak Push Alert'}
          </Button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {reportSuccessMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center space-x-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <p className="font-bold flex-1">{reportSuccessMessage}</p>
        </div>
      )}

      {/* Urgent Emergency Outbreak Warning Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white p-4 rounded-3xl shadow-lg border border-rose-800/50 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-rose-500/30 text-rose-300 border border-rose-400/30">
              <Flame className="w-4 h-4 animate-bounce" />
            </span>
            <span className="text-xs font-extrabold tracking-wide uppercase text-rose-200">
              {language === 'hi' ? 'आपातकालीन जैव-सुरक्षा चेतावनी' : 'High Contagion Proximity Warning'}
            </span>
          </div>
          <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-extrabold uppercase">
            Within {riskMetrics.nearestOutbreakKm} km
          </span>
        </div>

        <div>
          <h2 className="text-base font-extrabold tracking-tight">
            Yellow Rust detected in Vadu village (3.8 km away)
          </h2>
          <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">
            {language === 'hi'
              ? 'हवा की दिशा अनुकूल होने के कारण कवक बीजाणु (spores) अगले 48 घंटों में आपके खेत तक पहुंच सकते हैं। तुरंत पत्तों का निरीक्षण करें।'
              : 'Wind currents favor fungal spore dispersion toward your wheat parcel. Preventive foliar shield recommended within 24 hours.'}
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 text-[11px] text-rose-200">
            <span>Critical Hotspots: <strong>{riskMetrics.criticalWithin10km}</strong></span>
            <span>Bio-Security Score: <strong>{riskMetrics.score}/100</strong></span>
          </div>
          <button
            onClick={() => setExpandedReportId('outbreak-001')}
            className="text-[11px] font-bold text-amber-300 hover:underline flex items-center space-x-1"
          >
            <span>View Protocol</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Deliverable 2 Banner */}
      <div className="bg-gradient-to-r from-[#142318] to-emerald-950 text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
              Workflow 2 Deliverable
            </span>
          </div>
          <p className="text-xs font-extrabold">Bio-Security & Disease Early Containment</p>
          <p className="text-[10px] text-emerald-100">
            Proximity clusters, chemical dosage formulas & crowd report broadcast
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

      {/* Visual Geographic Clustering Radar */}
      <Card variant="default" className="border-stone-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-harvest-deep flex items-center space-x-1.5">
              <Radar className="w-4 h-4 text-rose-600" />
              <span>{language === 'hi' ? 'भौगोलिक क्लस्टर रडार' : 'Geographic Outbreak Cluster Radar'}</span>
            </CardTitle>
            <span className="text-[10px] text-stone-500 font-medium">Mehsana Agro-Corridor</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-1">
          {/* Radar graphic representation */}
          <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-stone-900 via-[#18231c] to-stone-950 p-3 overflow-hidden border border-stone-800 flex items-center justify-center">
            {/* Concentric distance rings */}
            <div className="absolute w-40 h-40 rounded-full border border-dashed border-rose-500/40 animate-pulse" />
            <div className="absolute w-28 h-28 rounded-full border border-rose-400/60" />
            <div className="absolute w-14 h-14 rounded-full border border-rose-300/80 bg-rose-500/10" />

            {/* User center farm pin */}
            <div className="absolute z-10 flex flex-col items-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow-lg animate-ping" />
              <span className="text-[9px] font-extrabold text-emerald-200 mt-1 bg-black/70 px-1.5 py-0.5 rounded">
                Your Farm
              </span>
            </div>

            {/* Cluster Pins on Radar */}
            <div className="absolute top-4 right-10 flex items-center space-x-1 bg-rose-950/80 border border-rose-500 px-2 py-0.5 rounded-full text-[9px] text-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>Kadi (3.8 km • 7 cases)</span>
            </div>

            <div className="absolute bottom-6 left-6 flex items-center space-x-1 bg-amber-950/80 border border-amber-500 px-2 py-0.5 rounded-full text-[9px] text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Nandasan (8.2 km • 12 cases)</span>
            </div>

            <div className="absolute top-6 left-8 flex items-center space-x-1 bg-sky-950/80 border border-sky-500 px-2 py-0.5 rounded-full text-[9px] text-sky-200">
              <span>Visnagar (18.5 km • 15 cases)</span>
            </div>

            {/* Range Legend */}
            <div className="absolute bottom-2 right-2 text-[9px] text-stone-400 bg-black/60 px-2 py-0.5 rounded">
              Inner Ring: 10km • Outer: 25km
            </div>
          </div>

          {/* Cluster Metric Cards */}
          <div className="space-y-1.5">
            {clusters.map((c) => (
              <div
                key={c.id}
                className="p-2.5 rounded-xl border border-stone-200/80 bg-[#F9FAF8] flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-harvest-deep">{c.clusterName}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        c.riskLevel === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : c.riskLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Primary: {c.primaryDisease} ({c.primaryCrop}) • {c.caseCount} reported plots
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-harvest-deep block">
                    {c.proximityToUserKm} km
                  </span>
                  <span className="text-[10px] text-stone-500 capitalize">{c.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Crop Filter Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-harvest-primary" />
            <span>{language === 'hi' ? 'सक्रिय रोग प्रकोप रिपोर्ट' : 'Active Outbreak Incidents'}</span>
          </h2>
          <span className="text-[10px] text-stone-500">{filteredReports.length} Active Records</span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCropFilter === c
                  ? 'bg-harvest-deep text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Outbreak Incident Cards Feed */}
      <div className="space-y-3">
        {filteredReports.map((report) => {
          const isExpanded = expandedReportId === report.id;
          return (
            <div
              key={report.id}
              className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden transition-all"
            >
              <div className="p-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          report.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : report.severity === 'high'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {report.severity}
                      </span>
                      <span className="text-xs font-bold text-stone-500">
                        {report.crop}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-harvest-deep mt-1">
                      {report.diseaseName}
                    </h3>
                    <p className="text-[10.5px] italic text-stone-500">
                      {report.scientificName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                      {report.distanceKm} km away
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-1">
                      {report.village}, {report.district}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1 border-t border-stone-100">
                  <span>Affected: <strong>{report.affectedAcres} Acres</strong> ({report.reportedCasesCount} cases)</span>
                  <span className="text-[10px] text-stone-500">{report.reportedDate}</span>
                </div>

                <div className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">Source: {report.sourceBadge}</span>
                </div>

                <button
                  onClick={() => setExpandedReportId(isExpanded ? null : report.id)}
                  className="w-full mt-2 py-1.5 text-xs font-bold text-harvest-primary bg-harvest-pale/60 hover:bg-harvest-pale rounded-xl border border-harvest-primary/20 flex items-center justify-center space-x-1 transition-colors"
                >
                  <span>{isExpanded ? 'Hide Treatment Protocol' : 'View Containment & Chemical Dosage'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
              </div>

              {/* Expandable Protocol & Chemical Dosage */}
              {isExpanded && (
                <div className="bg-[#F8FAF6] p-3.5 border-t border-stone-200 space-y-2.5 text-xs animate-in slide-in-from-top-2 duration-150">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                      Diagnostic Symptoms:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-stone-700 text-[11px]">
                      {report.symptoms.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                      <span>Immediate Preventive Containment:</span>
                    </span>
                    <p className="text-[11px] text-rose-950 leading-relaxed">
                      {report.preventiveProtocol}
                    </p>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Approved Chemical Dilution & Spray Formula:
                    </span>
                    <p className="text-[11px] font-semibold text-emerald-950 leading-relaxed">
                      {report.chemicalDosage}
                    </p>
                  </div>

                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Biological / Organic Alternative:
                    </span>
                    <p className="text-[11px] text-amber-950 leading-relaxed">
                      {report.organicRemedy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Report New Outbreak Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-harvest-deep">
                  Report Pest / Disease Outbreak
                </h3>
                <p className="text-xs text-stone-500">
                  Broadcast sighting to KVK scientists and nearby farmers
                </p>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Crop</label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs bg-white focus:border-harvest-primary focus:outline-none"
                >
                  <option value="Wheat (HD-2967)">Wheat (HD-2967)</option>
                  <option value="Mustard (Bio-902)">Mustard (Bio-902)</option>
                  <option value="Potato (Kufri Pukhraj)">Potato (Kufri Pukhraj)</option>
                  <option value="Cotton (Bt Hybrid)">Cotton (Bt Hybrid)</option>
                  <option value="Tomato & Veg">Tomato & Veg</option>
                  <option value="Cumin / Jeera">Cumin / Jeera</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Suspected Pathogen / Disease Name
                </label>
                <FormInput
                  placeholder="e.g. Yellow Rust, Aphids, Whitefly, Powdery Mildew"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as DiseaseSeverity)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs bg-white focus:border-harvest-primary focus:outline-none"
                  >
                    <option value="critical">Critical (Rapid Spreading)</option>
                    <option value="high">High (Clustered)</option>
                    <option value="moderate">Moderate (Isolated)</option>
                    <option value="watch">Watch / Early Signs</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Affected Area (Acres)</label>
                  <FormInput
                    type="number"
                    step="0.5"
                    value={newAcres}
                    onChange={(e) => setNewAcres(e.target.value)}
                    className="h-10 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Field Location</label>
                <FormInput
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Observed Symptoms</label>
                <textarea
                  rows={2}
                  value={newSymptoms}
                  onChange={(e) => setNewSymptoms(e.target.value)}
                  placeholder="Describe leaf yellowing, fungal pustules, or insect infestation..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs focus:border-harvest-primary focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 text-xs"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-1/2 text-xs font-bold bg-rose-700 hover:bg-rose-800"
                >
                  Broadcast Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
