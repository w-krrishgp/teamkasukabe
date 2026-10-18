export interface MandiRateResult {
  cropId: string;
  cropNameEn: string;
  cropNameHi: string;
  emoji: string;
  mandi: string;
  district: string;
  modalRate: number;
  minRate: number;
  maxRate: number;
  change: string;
  isPositive: boolean;
  arrival: string;
  spokenResponseEn: string;
  spokenResponseHi: string;
}

export const CROP_DATABASE: Record<string, { en: string; hi: string; emoji: string; keywords: string[] }> = {
  wheat: {
    en: 'Wheat (Sharbati)',
    hi: 'गेहूं (शरबती)',
    emoji: '🌾',
    keywords: ['wheat', 'gehu', 'gehun', 'गेहूं', 'गेहू', 'sharbati'],
  },
  mustard: {
    en: 'Mustard (Rayda)',
    hi: 'सरसों (रायड़ा)',
    emoji: '🌼',
    keywords: ['mustard', 'sarson', 'rayda', 'raida', 'सरसों', 'सरसो', 'रायड़ा'],
  },
  cumin: {
    en: 'Cumin (Jeera)',
    hi: 'जीरा (Jeera)',
    emoji: '🌿',
    keywords: ['cumin', 'jeera', 'jira', 'जीरा'],
  },
  tomato: {
    en: 'Tomato (Hybrid)',
    hi: 'टमाटर (हाइब्रिड)',
    emoji: '🍅',
    keywords: ['tomato', 'tamatar', 'टमाटर', 'tamater'],
  },
  potato: {
    en: 'Potato (Jyoti)',
    hi: 'आलू (ज्योति)',
    emoji: '🥔',
    keywords: ['potato', 'aaloo', 'aalu', 'aloo', 'आलू', 'alu'],
  },
  onion: {
    en: 'Onion (Red Nashik)',
    hi: 'प्याज (लाल नासिक)',
    emoji: '🧅',
    keywords: ['onion', 'pyaaz', 'pyaz', 'kanda', 'प्याज', 'प्याज़', 'कांदा'],
  },
  cotton: {
    en: 'Cotton (Kapash)',
    hi: 'कपास (कॉटन)',
    emoji: '☁️',
    keywords: ['cotton', 'kapas', 'kapash', 'कपास'],
  },
  chana: {
    en: 'Gram / Chana (Desi)',
    hi: 'चना (देसी)',
    emoji: '🌱',
    keywords: ['chana', 'gram', 'channa', 'चना', 'चना दाल'],
  },
};

const MANDI_DATA_MAP: Record<string, MandiRateResult[]> = {
  wheat: [
    {
      cropId: 'wheat',
      cropNameEn: 'Wheat (Sharbati)',
      cropNameHi: 'गेहूं (शरबती)',
      emoji: '🌾',
      mandi: 'Unjha APMC',
      district: 'Mehsana',
      modalRate: 2750,
      minRate: 2620,
      maxRate: 2840,
      change: '+₹70 (2.6%)',
      isPositive: true,
      arrival: '1,450 Qtl',
      spokenResponseEn: 'In Unjha Mandi, Wheat average price is ₹2,750 per quintal, up by ₹70 today.',
      spokenResponseHi: 'ऊंझा मंडी में गेहूं का औसत भाव ₹2,750 प्रति क्विंटल है, जो आज ₹70 ऊपर चल रहा है।',
    },
    {
      cropId: 'wheat',
      cropNameEn: 'Wheat (Sharbati)',
      cropNameHi: 'गेहूं (शरबती)',
      emoji: '🌾',
      mandi: 'Mehsana Main Yard',
      district: 'Mehsana',
      modalRate: 2680,
      minRate: 2550,
      maxRate: 2720,
      change: '+₹40 (1.5%)',
      isPositive: true,
      arrival: '2,100 Qtl',
      spokenResponseEn: 'In Mehsana Mandi, Wheat average price is ₹2,680 per quintal.',
      spokenResponseHi: 'मेहसाणा मंडी में गेहूं का भाव ₹2,680 प्रति क्विंटल है।',
    },
  ],
  mustard: [
    {
      cropId: 'mustard',
      cropNameEn: 'Mustard (Rayda)',
      cropNameHi: 'सरसों (रायड़ा)',
      emoji: '🌼',
      mandi: 'Unjha APMC',
      district: 'Mehsana',
      modalRate: 5450,
      minRate: 5200,
      maxRate: 5620,
      change: '+₹110 (2.1%)',
      isPositive: true,
      arrival: '850 Qtl',
      spokenResponseEn: 'In Unjha APMC, Mustard rate is ₹5,450 per quintal, with high buyer demand.',
      spokenResponseHi: 'ऊंझा एपीएमसी में सरसों का भाव ₹5,450 प्रति क्विंटल है।',
    },
  ],
  cumin: [
    {
      cropId: 'cumin',
      cropNameEn: 'Cumin (Jeera)',
      cropNameHi: 'जीरा (Jeera)',
      emoji: '🌿',
      mandi: 'Unjha APMC (Asia Largest)',
      district: 'Mehsana',
      modalRate: 28400,
      minRate: 26500,
      maxRate: 30200,
      change: '+₹650 (2.3%)',
      isPositive: true,
      arrival: '3,800 Qtl',
      spokenResponseEn: 'In Unjha, Cumin Jeera price is trading strong at ₹28,400 per quintal.',
      spokenResponseHi: 'ऊंझा मंडी में जीरे का भाव ₹28,400 प्रति क्विंटल मजबूती पर है।',
    },
  ],
  tomato: [
    {
      cropId: 'tomato',
      cropNameEn: 'Tomato (Hybrid)',
      cropNameHi: 'टमाटर (हाइब्रिड)',
      emoji: '🍅',
      mandi: 'Kadi APMC Yard',
      district: 'Mehsana',
      modalRate: 1850,
      minRate: 1600,
      maxRate: 2100,
      change: '+₹150 (8.8%)',
      isPositive: true,
      arrival: '620 Qtl',
      spokenResponseEn: 'Tomato price in Kadi Mandi is ₹1,850 per quintal, up by 8.8 percent today.',
      spokenResponseHi: 'कड़ी मंडी में टमाटर का भाव ₹1,850 प्रति क्विंटल है, जो आज ₹150 बढ़ा है।',
    },
  ],
  potato: [
    {
      cropId: 'potato',
      cropNameEn: 'Potato (Jyoti)',
      cropNameHi: 'आलू (ज्योति)',
      emoji: '🥔',
      mandi: 'Patan APMC',
      district: 'Patan',
      modalRate: 1420,
      minRate: 1300,
      maxRate: 1550,
      change: '-₹30 (-2.0%)',
      isPositive: false,
      arrival: '1,900 Qtl',
      spokenResponseEn: 'Potato rate in Patan Mandi is ₹1,420 per quintal with steady arrivals.',
      spokenResponseHi: 'पाटन मंडी में आलू का भाव ₹1,420 प्रति क्विंटल दर्ज किया गया है।',
    },
  ],
  onion: [
    {
      cropId: 'onion',
      cropNameEn: 'Onion (Red Nashik)',
      cropNameHi: 'प्याज (लाल नासिक)',
      emoji: '🧅',
      mandi: 'Unjha Sub-Yard',
      district: 'Mehsana',
      modalRate: 2150,
      minRate: 1950,
      maxRate: 2300,
      change: '+₹80 (3.8%)',
      isPositive: true,
      arrival: '1,100 Qtl',
      spokenResponseEn: 'In Unjha Mandi, Red Onion price is ₹2,150 per quintal.',
      spokenResponseHi: 'ऊंझा मंडी में लाल प्याज का औसत भाव ₹2,150 प्रति क्विंटल है।',
    },
  ],
  cotton: [
    {
      cropId: 'cotton',
      cropNameEn: 'Cotton (Kapash)',
      cropNameHi: 'कपास (कॉटन)',
      emoji: '☁️',
      mandi: 'Kadi Yard',
      district: 'Mehsana',
      modalRate: 7200,
      minRate: 6900,
      maxRate: 7450,
      change: '+₹120 (1.7%)',
      isPositive: true,
      arrival: '1,600 Qtl',
      spokenResponseEn: 'Cotton price in Kadi is ₹7,200 per quintal with firm mill demand.',
      spokenResponseHi: 'कड़ी मंडी में कपास का भाव ₹7,200 प्रति क्विंटल चल रहा है।',
    },
  ],
  chana: [
    {
      cropId: 'chana',
      cropNameEn: 'Gram / Chana (Desi)',
      cropNameHi: 'चना (देसी)',
      emoji: '🌱',
      mandi: 'Mehsana APMC',
      district: 'Mehsana',
      modalRate: 5850,
      minRate: 5600,
      maxRate: 6100,
      change: '+₹90 (1.5%)',
      isPositive: true,
      arrival: '740 Qtl',
      spokenResponseEn: 'Chana Desi price in Mehsana is ₹5,850 per quintal.',
      spokenResponseHi: 'मेहसाणा मंडी में चना का भाव ₹5,850 प्रति क्विंटल है।',
    },
  ],
};

/**
 * Intelligent entity matching from natural speech
 */
export function parseVoiceMandiQuery(text: string): MandiRateResult {
  const clean = text.toLowerCase().trim();

  // 1. Detect matching crop
  for (const [cropKey, cropInfo] of Object.entries(CROP_DATABASE)) {
    const match = cropInfo.keywords.some((kw) => clean.includes(kw.toLowerCase()));
    if (match) {
      const records = MANDI_DATA_MAP[cropKey];
      if (records && records.length > 0) {
        return records[0];
      }
    }
  }

  // 2. Default fallback if crop not explicitly detected: return Wheat (highest volume staple)
  return MANDI_DATA_MAP.wheat[0];
}

export function getMandiRateByCropId(cropId: string): MandiRateResult {
  const records = MANDI_DATA_MAP[cropId];
  if (records && records.length > 0) {
    return records[0];
  }
  return MANDI_DATA_MAP.wheat[0];
}
