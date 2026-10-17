import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Truck,
  Building2,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import type { OptionAnalysis } from '../types';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

interface ComparisonCardProps {
  option: OptionAnalysis;
  viewMetric?: 'total' | 'rate';
  onOpenBreakdown: (option: OptionAnalysis) => void;
  onOpenEnquiry: (option: OptionAnalysis) => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({
  option,
  viewMetric = 'total',
  onOpenBreakdown,
  onOpenEnquiry,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const getIcon = () => {
    switch (option.id) {
      case 'sell_immediately':
        return <Clock className="w-5 h-5 text-amber-700" />;
      case 'store_and_sell_later':
        return <Building2 className="w-5 h-5 text-blue-700" />;
      case 'alternative_buyer':
        return <Truck className="w-5 h-5 text-purple-700" />;
      case 'crop_pooling':
        return <Users className="w-5 h-5 text-emerald-700" />;
    }
  };

  const getLocalizedTitle = () => {
    if (!isHi) return option.title;
    switch (option.id) {
      case 'sell_immediately':
        return 'तुरंत मंडी/व्यापारी को बेचें';
      case 'store_and_sell_later':
        return 'भंडारण करें व बाद में बेचें';
      case 'alternative_buyer':
        return 'सीधे मिलर/प्रोसेसर को बेचें';
      case 'crop_pooling':
        return 'किसान समूह (पूलिंग) में जुड़ें';
    }
  };

  const getCardBorder = () => {
    if (option.isRecommended) {
      return 'border-2 border-harvest-primary bg-gradient-to-b from-harvest-pale/40 via-white to-white shadow-md ring-1 ring-harvest-primary/20';
    }
    if (option.feasibility === 'not_recommended') {
      return 'border border-red-200 bg-red-50/30 opacity-90';
    }
    return 'border border-stone-200 bg-white hover:border-harvest-primary/40 transition-all shadow-xs';
  };

  const getFeasibilityBadge = () => {
    switch (option.feasibility) {
      case 'optimal':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3" />
            <span>{isHi ? 'सर्वोत्तम मुनाफा' : 'Optimal Return'}</span>
          </span>
        );
      case 'viable':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {isHi ? 'उचित विकल्प' : 'Viable Choice'}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            <span>{isHi ? 'कम मुनाफा / जोखिम' : 'Tight Margin'}</span>
          </span>
        );
      case 'not_recommended':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
            <ShieldAlert className="w-3 h-3" />
            <span>{isHi ? 'अनुशंसित नहीं' : 'Not Recommended'}</span>
          </span>
        );
    }
  };

  const getActionLabel = () => {
    if (isHi) {
      switch (option.id) {
        case 'store_and_sell_later':
          return 'भंडारण बुक करें';
        case 'crop_pooling':
          return 'पूलिंग में जुड़ें';
        case 'alternative_buyer':
          return 'खरीदार से संपर्क';
        case 'sell_immediately':
          return 'प्रस्ताव स्वीकारें';
      }
    }
    switch (option.id) {
      case 'store_and_sell_later':
        return 'Book Storage';
      case 'crop_pooling':
        return 'Join Pool';
      case 'alternative_buyer':
        return 'Contact Buyer';
      case 'sell_immediately':
        return 'Accept Offer';
    }
  };

  return (
    <div className={`rounded-2xl p-4 transition-all relative overflow-hidden ${getCardBorder()}`}>
      {/* Recommended banner ribbon */}
      {option.isRecommended && (
        <div className="absolute top-0 right-0 bg-harvest-primary text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-xl uppercase tracking-wider shadow-xs flex items-center space-x-1">
          <span>{isHi ? '★ सर्वाधिक शुद्ध लाभ' : '★ Best Farmer Net Return'}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-stone-100 border border-stone-200">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-bold text-stone-400">#{option.rank}</span>
              <h3 className="text-sm font-extrabold text-harvest-deep">{getLocalizedTitle()}</h3>
            </div>
            <p className="text-xs text-stone-500 font-medium truncate max-w-[200px]">
              {option.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-1">
          {getFeasibilityBadge()}
        </div>
      </div>

      {/* Main Net Proceeds Display with Metric Toggle Awareness */}
      <div className="mt-3.5 bg-stone-50/80 rounded-xl p-3 border border-stone-200/60">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide block">
              {viewMetric === 'rate'
                ? isHi ? 'शुद्ध प्राप्त दर' : 'Net Realized Rate'
                : isHi ? 'अनुमानित शुद्ध बचत (खाते में)' : 'Estimated Net In Pocket'}
            </span>
            <div className="text-xl font-black text-harvest-deep tracking-tight">
              {viewMetric === 'rate'
                ? `₹${option.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl`
                : formatCurrency(option.netProceeds)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-medium text-stone-500 block">
              {viewMetric === 'rate'
                ? isHi ? 'कुल शुद्ध राशि' : 'Total Net'
                : isHi ? 'प्रति क्विंटल दर' : 'Net Realized'}
            </span>
            <span className="text-xs font-bold text-harvest-primary">
              {viewMetric === 'rate'
                ? formatCurrency(option.netProceeds)
                : `₹${option.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl`}
            </span>
          </div>
        </div>

        {/* Comparison with Immediate Distress Sale */}
        {option.id !== 'sell_immediately' && (
          <div className="mt-2 pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs">
            <span className="text-stone-600 font-medium text-[11px]">
              {isHi ? 'तुरंत स्थानीय बिक्री के मुकाबले:' : 'vs. Immediate Local Sale:'}
            </span>
            {option.netGainVsImmediate > 0 ? (
              <span className="font-extrabold text-emerald-700 flex items-center space-x-0.5">
                <TrendingUp className="w-3.5 h-3.5 inline mr-0.5" />
                +₹{option.netGainVsImmediate.toLocaleString('en-IN')} (+{option.netGainPercentageVsImmediate}%)
              </span>
            ) : (
              <span className="font-bold text-red-600">
                -₹{Math.abs(option.netGainVsImmediate).toLocaleString('en-IN')} ({option.netGainPercentageVsImmediate}%)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Why Recommended / Feasibility Note */}
      <div className="mt-2.5 text-xs text-stone-700 leading-relaxed bg-white/70 p-2 rounded-lg border border-stone-100">
        <span className="font-bold text-harvest-deep mr-1">
          {isHi ? 'कारण विश्लेषण:' : 'Rationale:'}
        </span>
        {option.whyRecommended}
      </div>

      {/* Key Cost & Risk Badges */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md font-medium border border-stone-200/60">
          {isHi ? 'कुल कटौती: ' : 'Costs: '}₹{option.costs.totalCosts.toLocaleString('en-IN')}
        </span>

        {option.spoilageQuantityLossKg > 0 && (
          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md font-medium border border-amber-200">
            {isHi ? 'वजन कमी: ' : 'Shrink: '}{option.spoilageQuantityLossKg} kg
          </span>
        )}

        <span
          className={`px-2 py-0.5 rounded-md font-medium border ${
            option.spoilageRisk === 'low'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : option.spoilageRisk === 'moderate'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {isHi ? 'जोखिम: ' : 'Risk: '}
          {isHi
            ? option.spoilageRisk === 'low'
              ? 'कम'
              : option.spoilageRisk === 'moderate'
              ? 'मध्यम'
              : 'अधिक'
            : option.spoilageRisk.toUpperCase()}
        </span>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onOpenBreakdown(option)}
          className="text-xs font-bold text-harvest-primary hover:text-harvest-deep flex items-center space-x-1 py-1.5 px-2 rounded-lg hover:bg-stone-100 transition-colors"
        >
          <span>{isHi ? 'लागत विवरण (वाटरफॉल)' : 'Cost Waterfall'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onOpenEnquiry(option)}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1 transition-all active:scale-95 shadow-xs ${
            option.isRecommended
              ? 'bg-harvest-primary text-white hover:bg-harvest-deep'
              : 'bg-stone-800 text-white hover:bg-stone-900'
          }`}
        >
          <span>{getActionLabel()}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
