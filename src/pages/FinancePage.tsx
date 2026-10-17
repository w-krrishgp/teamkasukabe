import { useState } from 'react';
import {
  Coins,
  CreditCard,
  CheckCircle,
  Clock,
  ExternalLink,
  HelpCircle,
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
  StatusBadge,
  SearchInput,
  EmptyState,
} from '@/components/common';
import { MOCK_SCHEMES } from '@/services/supabase';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

export const FinancePage = () => {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredSchemes = MOCK_SCHEMES.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Demo Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            {language === 'hi'
              ? 'किसान क्रेडिट कार्ड व DBT योजनाएं (सत्यापित प्रारूप)'
              : 'Institutional Credit & Welfare Schemes (Demonstration Mode)'}
          </span>
        </div>
        <StatusBadge variant="success" size="sm">
          DBT Active
        </StatusBadge>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-amber-100 text-amber-900">
            <Coins className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-extrabold text-harvest-deep">
            {language === 'hi' ? 'योजना, ऋण व वित्तीय सहायता' : 'Money, Schemes & Credit'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'किसान क्रेडिट कार्ड सीमा, PM-KISAN DBT स्थिति व सरकारी फसल बीमा'
            : 'Kisan Credit Card (KCC) balance, direct DBT verification & insurance subsidies'}
        </p>
      </div>

      {/* Kisan Credit Card (KCC) Limit Card */}
      <Card variant="default" className="border-stone-200 shadow-sm bg-gradient-to-br from-white to-[#F8FAF6]">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center space-x-1.5">
              <CreditCard className="w-4 h-4 text-harvest-primary" />
              <span>Kisan Credit Card (KCC)</span>
            </CardTitle>
            <StatusBadge variant="success" size="sm" showDot>
              {language === 'hi' ? 'सक्रिय • 4% ब्याज' : 'Active • 4% Concessional'}
            </StatusBadge>
          </div>
          <CardDescription className="text-xs">
            SBI Mehsana Rural Branch • Account: *******4920
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[11px] text-stone-500">
                {language === 'hi' ? 'उपलब्ध ऋण सीमा' : 'Available Credit Limit'}
              </p>
              <p className="text-2xl font-black text-harvest-deep">
                {formatCurrency(175000)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-stone-500">
                {language === 'hi' ? 'कुल स्वीकृत सीमा' : 'Total Sanctioned'}
              </p>
              <p className="text-sm font-extrabold text-stone-700">{formatCurrency(250000)}</p>
            </div>
          </div>

          {/* Limit Bar */}
          <div className="space-y-1">
            <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-harvest-primary h-full rounded-full" style={{ width: '30%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-stone-500">
              <span>{language === 'hi' ? 'उपयोग: ₹ 75,000 (30%)' : 'Utilized: ₹ 75,000 (30%)'}</span>
              <span>{language === 'hi' ? 'अगला नवीनीकरण: मार्च 2027' : 'Next Renewal: March 2027'}</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              {language === 'hi'
                ? '3% ब्याज छूट (Prompt Repayment Incentive) लागू है।'
                : '3% prompt repayment interest subvention active. Net effective rate 4.0% p.a.'}
            </span>
          </div>
        </CardContent>

        <CardFooter>
          <Button size="sm" variant="outline" className="text-xs h-9">
            {language === 'hi' ? 'भुगतान विवरण' : 'Payment History'}
          </Button>
          <Button size="sm" variant="primary" className="text-xs h-9">
            {language === 'hi' ? 'खाते में ट्रांसफर करें' : 'Withdraw to Bank'}
          </Button>
        </CardFooter>
      </Card>

      {/* PM-KISAN Instant DBT Tracker */}
      <div className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ₹
            </div>
            <div>
              <h3 className="text-xs font-bold text-harvest-deep">PM-KISAN Samman Nidhi</h3>
              <p className="text-[10px] text-stone-500">Direct Benefit Transfer (DBT)</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
            {language === 'hi' ? 'किस्त जमा' : 'Credited'}
          </span>
        </div>
        <div className="p-2.5 bg-[#F8FAF6] rounded-xl border border-stone-100 flex items-center justify-between text-xs">
          <span className="text-stone-700 font-medium">16th Installment (₹ 2,000)</span>
          <span className="text-stone-500 text-[11px]">Deposited to SBI A/c ...4920</span>
        </div>
      </div>

      {/* Schemes Filter & Search */}
      <div className="space-y-2.5">
        <div className="px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {language === 'hi' ? 'सरकारी कल्याणकारी योजनाएं' : 'Government Welfare & Subsidies'}
          </h2>
          <p className="text-[11px] text-stone-500">
            {language === 'hi' ? 'अपनी पात्रता जांचें और सीधे आवेदन करें' : 'Check eligibility, deadlines, and direct benefit entitlements'}
          </p>
        </div>

        <SearchInput
          placeholder={language === 'hi' ? 'योजना खोजें (जैसे: फसल बीमा, सोलर पंप)...' : 'Search schemes by keyword...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar py-1">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी' : 'All' },
            { id: 'direct_benefit', label: language === 'hi' ? 'DBT सहायता' : 'Direct Benefit' },
            { id: 'credit', label: language === 'hi' ? 'ऋण / KCC' : 'Credit / Loans' },
            { id: 'insurance', label: language === 'hi' ? 'फसल बीमा' : 'Insurance' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredSchemes.length === 0 ? (
          <EmptyState
            title={language === 'hi' ? 'कोई योजना नहीं मिली' : 'No Matching Schemes'}
            description={language === 'hi' ? 'कृपया अलग कीवर्ड खोजें।' : 'Try clearing your filter or searching with different terms.'}
            actionLabel={language === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset Filter'}
            onAction={() => {
              setSearch('');
              setCategoryFilter('all');
            }}
          />
        ) : (
          <div className="space-y-2.5">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} variant="default" hoverable>
                <CardHeader className="pb-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-harvest-deep">
                        {scheme.name}
                      </CardTitle>
                      <CardDescription className="text-xs font-semibold text-harvest-primary mt-0.5">
                        {scheme.benefitAmount}
                      </CardDescription>
                    </div>
                    <StatusBadge
                      variant={
                        scheme.status === 'approved'
                          ? 'success'
                          : scheme.status === 'eligible'
                          ? 'info'
                          : 'warning'
                      }
                      size="sm"
                      showDot
                    >
                      {scheme.status.toUpperCase()}
                    </StatusBadge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-1.5 pt-1 text-xs">
                  <p className="text-stone-600 leading-relaxed">{scheme.description}</p>
                  <div className="p-2.5 rounded-xl bg-[#F8FAF6] text-[11px] text-harvest-deep flex items-start space-x-1.5 border border-stone-100">
                    <CheckCircle className="w-3.5 h-3.5 text-harvest-primary shrink-0 mt-0.5" />
                    <span>{scheme.eligibilityNotes}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <span className="text-[11px] text-stone-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Deadline: {scheme.deadline}</span>
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs font-semibold text-harvest-primary"
                    iconRight={<ExternalLink className="w-3 h-3" />}
                    onClick={() => alert(`Details for ${scheme.name}`)}
                  >
                    {language === 'hi' ? 'विवरण' : 'Details'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Helpline */}
      <div className="bg-[#F1F5EE] border border-stone-200 rounded-2xl p-3.5 flex items-center space-x-3 text-xs text-harvest-deep">
        <div className="w-9 h-9 rounded-xl bg-harvest-pale flex items-center justify-center text-harvest-primary shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold">
            {language === 'hi' ? 'PM-KISAN या KCC में सहायता चाहिए?' : 'Need Help with KCC or PM-KISAN?'}
          </p>
          <p className="text-[11px] text-stone-500">
            {language === 'hi' ? 'टोल-फ्री किसान कॉल सेंटर: 1800-180-1551' : 'Toll-free Kisan Call Center: 1800-180-1551'}
          </p>
        </div>
      </div>
    </div>
  );
};
