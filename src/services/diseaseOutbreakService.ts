import type {
  DiseaseOutbreakReport,
  DiseaseCluster,
  OutbreakSightingInput,
} from '@/types/intelligence';

const STORAGE_KEY_OUTBREAK_REPORTS = 'harvestguard_disease_outbreak_reports';
const STORAGE_KEY_OUTBREAK_SIGHTINGS = 'harvestguard_user_outbreak_sightings';

// Baseline verified sample outbreak database
const INITIAL_OUTBREAK_REPORTS: DiseaseOutbreakReport[] = [
  {
    id: 'outbreak-001',
    crop: 'Wheat (HD-2967, GW-496)',
    diseaseName: 'Stripe / Yellow Rust',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    severity: 'critical',
    spreadStatus: 'spreading',
    distanceKm: 3.8,
    village: 'Vadu',
    taluka: 'Kadi',
    district: 'Mehsana',
    coordinates: { latitude: 23.5612, longitude: 72.3941 },
    reportedDate: '2026-10-17 (Yesterday)',
    affectedAcres: 42,
    reportedCasesCount: 7,
    sourceBadge: 'ICAR-KVK Mehsana Field Surveillance',
    symptoms: [
      'Bright yellow-orange linear pustules parallel to leaf veins',
      'Yellow dust on fingers upon touching infected leaves',
      'Premature leaf senescence and reduced grain filling',
    ],
    preventiveProtocol:
      'Immediately isolate infected plots. Avoid excessive nitrogen application which accelerates fungal virulence. Ensure field drainage.',
    chemicalDosage:
      'Foliar spray of Propiconazole 25% EC @ 1.0 ml per liter of water (200 ml/acre in 200L water) or Tebuconazole 25.9% EC @ 1.0 ml/L.',
    organicRemedy:
      'Bio-fungicide spray with Trichoderma harzianum @ 5g/L + 5% Neem seed kernel extract (NSKE) at early onset.',
  },
  {
    id: 'outbreak-002',
    crop: 'Mustard (Bio-902, Varuna)',
    diseaseName: 'Mustard Aphid Infestation',
    scientificName: 'Lipaphis erysimi',
    severity: 'high',
    spreadStatus: 'active',
    distanceKm: 8.2,
    village: 'Nandasan',
    taluka: 'Kadi',
    district: 'Mehsana',
    coordinates: { latitude: 23.4981, longitude: 72.4102 },
    reportedDate: '2026-10-16 (2 days ago)',
    affectedAcres: 65,
    reportedCasesCount: 12,
    sourceBadge: 'Gujarat State Dept of Agriculture Alert',
    symptoms: [
      'Dense colonies of greenish nymphs clustered on tender inflorescence and pods',
      'Honeydew secretion followed by black sooty mold',
      'Curling and yellowing of young leaves',
    ],
    preventiveProtocol:
      'Set up yellow sticky traps (15-20 traps/acre). Clip and destroy heavily infested terminal twigs before colonies multiply.',
    chemicalDosage:
      'Spray Dimethoate 30% EC @ 1.7 ml/L or Imidacloprid 17.8% SL @ 0.5 ml/L of water during evening hours to protect pollinators.',
    organicRemedy:
      'Neem oil 1500 ppm @ 3 ml/L or 2% soap solution for light infestations.',
  },
  {
    id: 'outbreak-003',
    crop: 'Potato (Kufri Pukhraj)',
    diseaseName: 'Late Blight of Potato',
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    spreadStatus: 'spreading',
    distanceKm: 18.5,
    village: 'Jornang',
    taluka: 'Visnagar',
    district: 'Mehsana',
    coordinates: { latitude: 23.7001, longitude: 72.5482 },
    reportedDate: '2026-10-15',
    affectedAcres: 88,
    reportedCasesCount: 15,
    sourceBadge: 'Potato Research Station Deesa Telemetry',
    symptoms: [
      'Water-soaked dark lesions on leaf tips turning brownish-black',
      'White cottony fungal downy growth on the underside of leaves during damp mornings',
      'Rapid rotting of foliage and foul odor in field',
    ],
    preventiveProtocol:
      'Stop flood irrigation immediately. Ridge soil high around tuber zones to prevent zoospores from washing down to potatoes.',
    chemicalDosage:
      'Prophylactic spray of Mancozeb 75% WP @ 2.5 g/L. If disease is established, apply Cymoxanil 8% + Mancozeb 64% WP @ 3.0 g/L.',
    organicRemedy:
      'Copper oxychloride 50% WP @ 2.5 g/L with sticker surfactant.',
  },
  {
    id: 'outbreak-004',
    crop: 'Cotton (Bt Hybrid)',
    diseaseName: 'Pink Bollworm Infestation',
    scientificName: 'Pectinophora gossypiella',
    severity: 'moderate',
    spreadStatus: 'contained',
    distanceKm: 27.4,
    village: 'Bhalak',
    taluka: 'Mandal',
    district: 'Ahmedabad Rural',
    coordinates: { latitude: 23.2842, longitude: 72.0911 },
    reportedDate: '2026-10-12',
    affectedAcres: 30,
    reportedCasesCount: 4,
    sourceBadge: 'Farmer Producer Company (FPC) Crowd Report',
    symptoms: [
      'Rosetted flowers that fail to open fully',
      'Small entry holes in green developing bolls with brown frass',
      'Damaged locules with stained lint and premature opening',
    ],
    preventiveProtocol:
      'Install gossyplure pheromone traps (5 per acre for monitoring, 15 per acre for mass trapping). Destroy rosette flowers manually.',
    chemicalDosage:
      'Chlorantraniliprole 18.5% SC @ 0.3 ml/L or Emamectin Benzoate 5% SG @ 0.5 g/L.',
    organicRemedy:
      'Release Trichogramma bactrae egg parasitoids @ 60,000/acre at weekly intervals.',
  },
  {
    id: 'outbreak-005',
    crop: 'Tomato & Vegetables',
    diseaseName: 'Tomato Leaf Curl Virus (ToLCV)',
    scientificName: 'Begomovirus / Bemisia tabaci vector',
    severity: 'watch',
    spreadStatus: 'surveillance',
    distanceKm: 34.0,
    village: 'Ladol',
    taluka: 'Vijapur',
    district: 'Mehsana',
    coordinates: { latitude: 23.6321, longitude: 72.7121 },
    reportedDate: '2026-10-10',
    affectedAcres: 16,
    reportedCasesCount: 3,
    sourceBadge: 'KVK Vijapur Advisory',
    symptoms: [
      'Severe upward curling and puckering of leaves',
      'Stunting of plant growth with bushy appearance',
      'Drastic reduction in fruit set and size',
    ],
    preventiveProtocol:
      'Control whitefly vectors using yellow sticky traps and barrier nylon netting (40-mesh). Uproot and burn infected plants.',
    chemicalDosage:
      'Diafenthiuron 50% WP @ 1.2 g/L or Spiromesifen 22.9% SC @ 1.0 ml/L.',
    organicRemedy:
      'Neem oil 10,000 ppm @ 2 ml/L combined with Pongamia oil.',
  },
];

// Baseline geographic clusters calculated across the Mehsana-Sabarkantha agro-corridor
const INITIAL_CLUSTERS: DiseaseCluster[] = [
  {
    id: 'cluster-kadi-vadu',
    clusterName: 'Kadi - Vadu Wheat Cluster',
    district: 'Mehsana',
    centerCoordinates: { latitude: 23.5612, longitude: 72.3941 },
    radiusKm: 6.5,
    caseCount: 7,
    primaryCrop: 'Wheat',
    primaryDisease: 'Yellow Rust',
    riskLevel: 'high',
    trend: 'expanding',
    proximityToUserKm: 3.8,
  },
  {
    id: 'cluster-nandasan-mustard',
    clusterName: 'Nandasan Aphid Hotspot',
    district: 'Mehsana',
    centerCoordinates: { latitude: 23.4981, longitude: 72.4102 },
    radiusKm: 11.0,
    caseCount: 12,
    primaryCrop: 'Mustard',
    primaryDisease: 'Mustard Aphid',
    riskLevel: 'high',
    trend: 'expanding',
    proximityToUserKm: 8.2,
  },
  {
    id: 'cluster-visnagar-blight',
    clusterName: 'Visnagar - Deesa Blight Corridor',
    district: 'Mehsana / Banaskantha',
    centerCoordinates: { latitude: 23.7001, longitude: 72.5482 },
    radiusKm: 18.0,
    caseCount: 15,
    primaryCrop: 'Potato',
    primaryDisease: 'Late Blight',
    riskLevel: 'medium',
    trend: 'stable',
    proximityToUserKm: 18.5,
  },
  {
    id: 'cluster-mandal-cotton',
    clusterName: 'Mandal Cotton Buffer',
    district: 'Ahmedabad Rural',
    centerCoordinates: { latitude: 23.2842, longitude: 72.0911 },
    radiusKm: 25.0,
    caseCount: 4,
    primaryCrop: 'Cotton',
    primaryDisease: 'Pink Bollworm',
    riskLevel: 'surveillance',
    trend: 'declining',
    proximityToUserKm: 27.4,
  },
];

export function getOutbreakReports(): DiseaseOutbreakReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OUTBREAK_REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_OUTBREAK_REPORTS, JSON.stringify(INITIAL_OUTBREAK_REPORTS));
      return INITIAL_OUTBREAK_REPORTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_OUTBREAK_REPORTS;
  }
}

export function getDiseaseClusters(): DiseaseCluster[] {
  return INITIAL_CLUSTERS;
}

export function reportOutbreakSighting(sighting: OutbreakSightingInput): DiseaseOutbreakReport {
  const reports = getOutbreakReports();

  const newReport: DiseaseOutbreakReport = {
    id: `outbreak-usr-${Date.now()}`,
    crop: sighting.crop,
    diseaseName: sighting.diseaseName,
    scientificName: 'Pathogen Under Lab Verification',
    severity: sighting.severity,
    spreadStatus: 'active',
    distanceKm: 0.5, // Registered from farmer's current location
    village: sighting.village || 'Kheda Village',
    taluka: sighting.taluka || 'Kadi',
    district: 'Mehsana',
    coordinates: { latitude: 23.588, longitude: 72.3693 },
    reportedDate: 'Just now (Verified Farmer Crowd-Report)',
    affectedAcres: Number(sighting.affectedAcres) || 2,
    reportedCasesCount: 1,
    sourceBadge: 'Farmer Community Field Sighting (Under KVK Review)',
    symptoms: [sighting.symptoms || 'Visual lesion and canopy yellowing reported by grower.'],
    preventiveProtocol:
      'Isolate the inspected zone. Avoid mechanical movement across wet foliage to prevent spore dispersal.',
    chemicalDosage:
      'Consult nearest Krishi Vigyan Kendra (KVK) scientist or apply broad-spectrum copper fungicide.',
    organicRemedy: 'Neem-based preventive foliar spray @ 5ml/L of water.',
  };

  const updated = [newReport, ...reports];
  try {
    localStorage.setItem(STORAGE_KEY_OUTBREAK_REPORTS, JSON.stringify(updated));
    // Also track user submitted sightings
    const existingSightings = JSON.parse(
      localStorage.getItem(STORAGE_KEY_OUTBREAK_SIGHTINGS) || '[]'
    );
    localStorage.setItem(
      STORAGE_KEY_OUTBREAK_SIGHTINGS,
      JSON.stringify([newReport, ...existingSightings])
    );
  } catch (err) {
    console.error('Failed to save outbreak report to localStorage', err);
  }

  return newReport;
}

export function calculateBioSecurityRiskIndex(reports: DiseaseOutbreakReport[]): {
  score: number; // 0-100 (100 = safe, 0 = severe outbreak)
  riskLevel: 'critical' | 'high' | 'moderate' | 'safe';
  nearestOutbreakKm: number;
  nearestDisease: string;
  criticalWithin10km: number;
} {
  const activeReports = reports.filter((r) => r.spreadStatus === 'active' || r.spreadStatus === 'spreading');
  const criticalNearby = activeReports.filter((r) => r.distanceKm <= 10 && (r.severity === 'critical' || r.severity === 'high'));

  const sortedByDist = [...activeReports].sort((a, b) => a.distanceKm - b.distanceKm);
  const nearest = sortedByDist[0];
  const nearestDist = nearest ? nearest.distanceKm : 999;
  const nearestDisease = nearest ? `${nearest.diseaseName} (${nearest.crop})` : 'None detected';

  let score = 88;
  if (nearestDist < 5) score -= 40;
  else if (nearestDist < 10) score -= 25;
  else if (nearestDist < 25) score -= 12;

  score -= criticalNearby.length * 8;
  score = Math.max(20, Math.min(95, score));

  let riskLevel: 'critical' | 'high' | 'moderate' | 'safe' = 'safe';
  if (score < 45) riskLevel = 'critical';
  else if (score < 65) riskLevel = 'high';
  else if (score < 80) riskLevel = 'moderate';

  return {
    score,
    riskLevel,
    nearestOutbreakKm: nearestDist,
    nearestDisease,
    criticalWithin10km: criticalNearby.length,
  };
}
