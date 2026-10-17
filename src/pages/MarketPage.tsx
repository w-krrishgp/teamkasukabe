import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  TrendingUp,
  Minus,
  PlusCircle,
  Building2,
  MapPin,
  Info,
  X,
  CheckCircle2,
  Scale,
  ArrowRight,
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
  FormInput,
  FormSelect,
} from '@/components/common';
import { MOCK_MANDI_RATES } from '@/services/supabase';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

export const MarketPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [listingSuccess, setListingSuccess] = useState(false);

  const crops = ['All', 'Wheat', 'Mustard', 'Cotton'];

  const filteredRates = MOCK_MANDI_RATES.filter((item) => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marketName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop =
      selectedCropFilter === 'All' || item.cropName.includes(selectedCropFilter);
    return matchesSearch && matchesCrop;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Demo Badge */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#F1F5EE] border border-harvest-border/80 rounded-xl text-[11px] text-harvest-muted">
        <div className="flex items-center space-x-1.5 truncate">
          <Info className="w-3.5 h-3.5 text-harvest-primary shrink-0" />
          <span className="font-medium truncate">
            {language === 'hi'
              ? 'मंडी भाव व व्यापार • APMC ई-नाम लाइव डेटा (डेमो मोड)'
              : 'Market Access • e-NAM & APMC Rates (Demonstration Mode)'}
          </span>
        </div>
        <StatusBadge variant="earth" size="sm">
          APMC Gujarat
        </StatusBadge>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="p-1 rounded-lg bg-emerald-100 text-emerald-800">
            <Store className="w-5 h-5" />
          </span>
          <h1 className="text-lg font-extrabold text-harvest-deep">
            {language === 'hi' ? 'मंडी भाव व सीधा बाजार' : 'Market Access & APMC Rates'}
          </h1>
        </div>
        <p className="text-xs text-stone-600 mt-0.5">
          {language === 'hi'
            ? 'दैनिक APMC मंडी दरें, मूल्य रुझान व सत्यापित मिल खरीदारों से सीधा संपर्क'
            : 'Live APMC mandi pricing, price-trend momentum & verified miller direct trade'}
        </p>
      </div>

      {/* Signature Feature: No Distress Selling Decision Banner */}
      <div
        onClick={() => navigate('/no-distress-selling')}
        className="bg-harvest-cream border-2 border-harvest-primary/30 hover:border-harvest-primary p-3.5 rounded-2xl flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.99] transition-all group"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-harvest-pale text-harvest-primary shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wide bg-harvest-primary text-white px-2 py-0.2 rounded-md">
                Decision Tool
              </span>
              <h2 className="text-xs font-black text-harvest-deep">
                No Distress Selling Engine
              </h2>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Compare Net Realizations: Sell Now vs Store Later vs Food Mills vs FPO Pooling
            </p>
          </div>
        </div>
        <div className="p-2 rounded-xl bg-white border border-stone-200 text-harvest-deep group-hover:bg-harvest-primary group-hover:text-white transition-colors shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Sell Produce Action Banner */}
      <div className="bg-gradient-to-r from-[#1b3b2b] via-[#142318] to-[#1b3b2b] text-white p-4 rounded-3xl shadow-md flex items-center justify-between border border-emerald-900/40">
        <div className="space-y-0.5 max-w-[65%]">
          <h2 className="text-sm font-extrabold leading-snug">
            {language === 'hi' ? 'क्या आपके पास रबी उपज है?' : 'Have Rabi Harvest to Sell?'}
          </h2>
          <p className="text-xs text-emerald-100/80">
            {language === 'hi'
              ? 'गेहूं व सरसों की फसल सीधे मिलर्स को बेचें और बेहतर दाम पाएं।'
              : 'Connect directly with certified flour mills & oil extractors.'}
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="bg-white text-harvest-deep font-bold shadow-xs hover:bg-stone-100 text-xs shrink-0"
          iconLeft={<PlusCircle className="w-4 h-4 text-harvest-primary" />}
          onClick={() => setIsListingModalOpen(true)}
        >
          {language === 'hi' ? 'उपज जोड़ें' : 'Post Produce'}
        </Button>
      </div>

      {/* Search & Crop Quick Filters */}
      <div className="space-y-2">
        <SearchInput
          placeholder={language === 'hi' ? 'मंडी या फसल का नाम खोजें...' : 'Search by mandi or crop name...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto hide-scrollbar py-1">
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCropFilter(crop)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCropFilter === crop
                  ? 'bg-harvest-primary text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {crop === 'All' ? (language === 'hi' ? 'सभी फसलें' : 'All Crops') : crop}
            </button>
          ))}
        </div>
      </div>

      {/* APMC Mandi Live Rates List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {language === 'hi' ? `लाइव APMC मंडी भाव (${filteredRates.length})` : `Live Mandi Benchmark Rates (${filteredRates.length})`}
          </h2>
          <span className="text-[11px] text-stone-500">Updated: Today 09:30 AM</span>
        </div>

        {filteredRates.length === 0 ? (
          <EmptyState
            title={language === 'hi' ? 'कोई मंडी दर नहीं मिली' : 'No Matching Mandi Rates'}
            description={language === 'hi' ? 'कृपया अलग फसल या मंडी खोजें।' : 'Try selecting All Crops or searching with a different market name.'}
            actionLabel={language === 'hi' ? 'सभी फसलें देखें' : 'View All Crops'}
            onAction={() => {
              setSearchTerm('');
              setSelectedCropFilter('All');
            }}
          />
        ) : (
          filteredRates.map((rate) => (
            <Card key={rate.id} variant="default" hoverable>
              <CardHeader className="pb-1">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-harvest-deep">
                      {rate.cropName}
                    </CardTitle>
                    <CardDescription className="text-xs flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-harvest-primary shrink-0" />
                      <span>{rate.marketName}, {rate.state}</span>
                    </CardDescription>
                  </div>
                  <StatusBadge
                    variant={rate.priceTrend === 'up' ? 'success' : 'neutral'}
                    size="sm"
                    icon={
                      rate.priceTrend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-emerald-700" />
                      ) : (
                        <Minus className="w-3 h-3 text-stone-500" />
                      )
                    }
                  >
                    {rate.priceTrend === 'up'
                      ? (language === 'hi' ? 'तेजी (+₹ 80)' : 'Bullish (+₹ 80)')
                      : (language === 'hi' ? 'स्थिर' : 'Stable')}
                  </StatusBadge>
                </div>
              </CardHeader>

              <CardContent className="pt-2 pb-3">
                <div className="grid grid-cols-3 gap-2 bg-[#F8FAF6] p-2.5 rounded-xl border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] text-stone-500">Min Rate</span>
                    <p className="text-xs font-bold text-harvest-deep mt-0.5">
                      {formatCurrency(rate.minPrice)}
                    </p>
                  </div>
                  <div className="border-x border-stone-200">
                    <span className="text-[10px] text-harvest-primary font-bold">Modal Price</span>
                    <p className="text-sm font-black text-harvest-primary mt-0.5">
                      {formatCurrency(rate.modalPrice)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500">Max Rate</span>
                    <p className="text-xs font-bold text-harvest-deep mt-0.5">
                      {formatCurrency(rate.maxPrice)}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-right text-stone-500 mt-1.5">
                  Unit: {rate.unit} • {rate.updatedAt}
                </p>
              </CardContent>

              <CardFooter>
                <Button size="sm" variant="outline" className="text-xs h-8">
                  {language === 'hi' ? 'मूल्य इतिहास' : 'Price Chart'}
                </Button>
                <Button size="sm" variant="primary" className="text-xs h-8">
                  {language === 'hi' ? 'खरीदार सूची' : 'Buyer Inquiries'}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Verified Buyer Demand Card */}
      <Card variant="warm">
        <CardHeader className="pb-1">
          <div className="flex items-center space-x-1.5">
            <Building2 className="w-4 h-4 text-harvest-primary" />
            <CardTitle className="text-xs uppercase font-bold text-harvest-deep">
              {language === 'hi' ? 'सत्यापित मिल व व्यापारी मांग' : 'Verified Direct Institutional Demand'}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-1">
          <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-harvest-deep">Shree Ram Flour Mills</p>
              <p className="text-[11px] text-stone-600">Seeking 50 Quintals HD-2967 Wheat</p>
              <span className="text-[10px] text-emerald-800 font-semibold">
                Offered: ₹ 2,750 / Qtl • Unjha (14 km)
              </span>
            </div>
            <Button size="sm" variant="earth" className="h-8 text-xs">
              {language === 'hi' ? 'संपर्क करें' : 'Contact'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Post Produce Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white text-harvest-deep rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-sm font-extrabold text-harvest-deep">
                {language === 'hi' ? 'अपनी उपज बिक्री के लिए सूचीबद्ध करें' : 'List Harvested Produce for Sale'}
              </h3>
              <button
                onClick={() => {
                  setIsListingModalOpen(false);
                  setListingSuccess(false);
                }}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {listingSuccess ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-950">Produce Listed Successfully!</h4>
                <p className="text-xs text-stone-600">
                  Your listing is now visible to verified APMC millers in Mehsana district.
                </p>
                <Button
                  size="md"
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setIsListingModalOpen(false);
                    setListingSuccess(false);
                  }}
                >
                  Done
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <FormSelect
                  label="Select Crop"
                  options={[
                    { label: 'Wheat (Sharbati HD-2967)', value: 'wheat' },
                    { label: 'Mustard (Pusa Bold)', value: 'mustard' },
                    { label: 'Cotton (Bt-II)', value: 'cotton' },
                  ]}
                />
                <FormInput label="Quantity (Quintals)" type="number" placeholder="e.g. 40" />
                <FormInput label="Expected Price (₹ / Qtl)" type="number" placeholder="e.g. 2700" />
                <div className="pt-2 flex space-x-2">
                  <Button
                    size="md"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setIsListingModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    variant="primary"
                    className="flex-1 text-xs"
                    onClick={() => setListingSuccess(true)}
                  >
                    Submit Listing
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
