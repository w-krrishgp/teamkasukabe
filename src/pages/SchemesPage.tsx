import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck2,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';
import {
  Button,
  StatusBadge,
  SearchInput,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';

export const SchemesPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'central' | 'subsidy' | 'insurance'>('all');

  const schemes = [
    {
      id: 's1',
      name: language === 'hi' ? 'पीएम-किसान सम्मान निधि' : 'PM-KISAN Samman Nidhi',
      benefit: '₹ 6,000 / year (Direct DBT)',
      category: 'central',
      status: language === 'hi' ? 'सक्रिय • 16वीं किस्त जमा' : 'Active • 16th Installment Credited',
      desc:
        language === 'hi'
          ? 'किसानों को आर्थिक सहायता हेतु प्रतिवर्ष ₹2,000 की 3 किस्तों में सीधे बैंक खाते में भुगतान।'
          : 'Direct income support of ₹6,000 per year in three equal quarterly installments to eligible landholding farmers.',
      eligibility: 'All landholding farmer families with cultivated land records.',
      deadline: 'Continuous DBT',
    },
    {
      id: 's2',
      name: language === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : 'PM Fasal Bima Yojana (PMFBY)',
      benefit: 'Up to ₹ 45,000 / Acre Coverage',
      category: 'insurance',
      status: language === 'hi' ? 'रबी 2026 बीमा सक्रिय' : 'Rabi 2026 Coverage Active',
      desc:
        language === 'hi'
          ? 'प्राकृतिक आपदाओं, कीटों और रोगों से फसल नुकसान पर न्यूनतम 1.5% प्रीमियम पर सुरक्षा।'
          : 'Comprehensive risk insurance against unseasonal rain, pest outbreaks, and drought at nominal 1.5% Rabi premium.',
      eligibility: 'All farmers cultivating notified crops in notified insurance areas.',
      deadline: 'Dec 31, 2026',
    },
    {
      id: 's3',
      name: language === 'hi' ? 'पीएम-कुसुम सोलर पंप योजना' : 'PM-KUSUM Solar Agricultural Pumps',
      benefit: '60% Capital Subsidy',
      category: 'subsidy',
      status: language === 'hi' ? 'आवेदन खुला' : 'Applications Open',
      desc:
        language === 'hi'
          ? '7.5 HP तक के सौर कृषि पंपों की स्थापना पर 60% सरकारी सब्सिडी और आसान बैंक ऋण।'
          : 'Provides 60% government subsidy to install standalone 3 to 7.5 HP off-grid solar irrigation pumps.',
      eligibility: 'Individual farmers, water user associations, and farmer producer groups.',
      deadline: 'Rolling Subsidies',
    },
    {
      id: 's4',
      name: language === 'hi' ? 'कृषि यंत्रीकरण उप-मिशन (SMAM)' : 'Sub-Mission on Agri Mechanization (SMAM)',
      benefit: '40% - 50% Subsidy on Machinery',
      category: 'subsidy',
      status: language === 'hi' ? 'पोर्टल खुला' : 'Portal Active',
      desc:
        language === 'hi'
          ? 'रोटावेटर, लेजर लैंड लेवलर, और सुपर सीडर जैसे आधुनिक उपकरणों पर 50% तक वित्तीय अनुदान।'
          : 'Direct subsidy for purchasing rotavators, laser levellers, and combine harvesters for smallholder efficiency.',
      eligibility: 'Small and marginal farmers, SC/ST, and women farmers.',
      deadline: 'Quarterly Allotment',
    },
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filter === 'all' || s.category === filter;
    return matchesSearch && matchesCat;
  });

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
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
          Govt DBT & Subsidies
        </span>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-extrabold text-harvest-deep flex items-center space-x-2">
          <FileCheck2 className="w-5 h-5 text-harvest-primary" />
          <span>{language === 'hi' ? 'सरकारी योजनाएं व सब्सिडी' : 'Government Welfare & Subsidies'}</span>
        </h1>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'पात्रता जांचें, सीधे आवेदन करें और DBT बैंक हस्तांतरण की स्थिति देखें।'
            : 'Explore central and state farmer benefit programs with direct eligibility verification.'}
        </p>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-2">
        <SearchInput
          placeholder={language === 'hi' ? 'योजना खोजें (जैसे: किसान सम्मान, सोलर पंप)...' : 'Search schemes (e.g. PM-KISAN, Solar Pump)...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी योजनाएं' : 'All Schemes' },
            { id: 'central', label: language === 'hi' ? 'प्रत्यक्ष लाभ (DBT)' : 'Direct Benefit' },
            { id: 'insurance', label: language === 'hi' ? 'फसल बीमा' : 'Crop Insurance' },
            { id: 'subsidy', label: language === 'hi' ? 'उपकरण सब्सिडी' : 'Equipment Subsidy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as typeof filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === cat.id
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-2.5">
        {filteredSchemes.map((s) => (
          <div
            key={s.id}
            className="p-4 bg-white border border-stone-200 rounded-3xl shadow-xs space-y-3 hover:border-harvest-primary transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-harvest-deep">{s.name}</h3>
                <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block mt-1">
                  {s.benefit}
                </span>
              </div>
              <StatusBadge variant="success" size="sm">
                {s.status}
              </StatusBadge>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">{s.desc}</p>

            <div className="p-2.5 bg-[#F9FAF8] rounded-xl border border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
              <span>
                <strong className="text-stone-800">{language === 'hi' ? 'पात्रता:' : 'Eligibility:'}</strong> {s.eligibility}
              </span>
              <span className="font-bold text-harvest-primary shrink-0 ml-2">{s.deadline}</span>
            </div>

            <div className="pt-1 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 h-9 text-xs font-bold bg-harvest-primary text-white"
                onClick={() => alert(`Direct portal redirect for ${s.name} initialized.`)}
              >
                <span>{language === 'hi' ? 'आवेदन की स्थिति देखें' : 'Check Application Status'}</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Kisan Call Center Helpline */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <p className="font-extrabold">{language === 'hi' ? 'किसान कॉल सेंटर (टोल-फ्री)' : 'Kisan Call Center (Toll-Free)'}</p>
            <p className="text-[11px] text-amber-800">1800-180-1551 • 24x7 Support</p>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="px-3 py-1.5 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 transition-colors"
        >
          {language === 'hi' ? 'कॉल करें' : 'Call Now'}
        </a>
      </div>
    </div>
  );
};
