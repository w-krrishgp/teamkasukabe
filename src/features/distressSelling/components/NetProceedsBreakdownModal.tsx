import React from 'react';
import { X, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';
import type { OptionAnalysis } from '../types';
import { formatCurrency } from '@/utils/formatters';
import { useLanguage } from '@/context/LanguageContext';

interface NetProceedsBreakdownModalProps {
  option: OptionAnalysis | null;
  onClose: () => void;
}

export const NetProceedsBreakdownModal: React.FC<NetProceedsBreakdownModalProps> = ({
  option,
  onClose,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  if (!option) return null;

  const costs = option.costs;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-harvest-pale text-harvest-primary">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-harvest-deep">
              {option.title} — {isHi ? 'लागत विवरण (वाटरफॉल)' : 'Waterfall Breakdown'}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {isHi
                ? 'पारदर्शी लागत लेखांकन और किसान की शुद्ध आय'
                : 'Transparent cost accounting and farmer net realizations'}
            </p>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="mt-4 p-3.5 bg-harvest-cream border border-harvest-primary/20 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-harvest-primary uppercase tracking-wider block">
              {isHi ? 'अंतिम शुद्ध प्राप्त राशि' : 'Final Net Proceeds'}
            </span>
            <div className="text-2xl font-black text-harvest-deep">
              {formatCurrency(option.netProceeds)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 block">
              {isHi ? 'बिक्री योग्य मात्रा' : 'Effective Volume Sold'}
            </span>
            <span className="text-xs font-extrabold text-stone-800">
              {option.effectiveQuantitySold} {isHi ? 'क्विंटल' : 'Quintals'}
            </span>
            <span className="text-[11px] block text-harvest-primary font-bold">
              ₹{option.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl
            </span>
          </div>
        </div>

        {/* Waterfall Table */}
        <div className="mt-4 space-y-2 text-xs">
          <h3 className="font-extrabold text-stone-800 text-[11px] uppercase tracking-wider">
            {isHi ? 'विस्तृत गणना सूची' : 'Detailed Calculations'}
          </h3>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden bg-white">
            {/* Gross Revenue */}
            <div className="flex items-center justify-between p-3 bg-emerald-50/50">
              <div>
                <span className="font-extrabold text-emerald-950">
                  {isHi ? 'अनुमानित सकल राजस्व' : 'Estimated Gross Revenue'}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {option.effectiveQuantitySold} Qtl @ {isHi ? 'बाजार मूल्य' : 'base market offer'}
                </span>
              </div>
              <span className="font-extrabold text-emerald-900 text-sm">
                +{formatCurrency(option.grossRevenue)}
              </span>
            </div>

            {/* Transport Freight */}
            <div className="flex items-center justify-between p-3">
              <div>
                <span className="font-medium text-stone-700">
                  {isHi ? 'परिवहन व ढुलाई भाड़ा' : 'Transport & Haulage Freight'}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {isHi ? 'दूरी यात्रा, ईंधन व गाड़ी किराया' : 'Distance travel, loading fuel & vehicle hire'}
                </span>
              </div>
              <span className="font-bold text-red-600">
                -₹{costs.transportCost.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Storage Rent (if any) */}
            {costs.storageRentCost > 0 && (
              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-medium text-stone-700">
                    {isHi ? 'वेयरहाउस / कोल्ड स्टोरेज किराया' : 'Warehouse / Cold Storage Rent'}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {isHi ? 'भंडारण अवधि का प्रमाणित किराया' : 'Accredited storage rent across holding duration'}
                  </span>
                </div>
                <span className="font-bold text-red-600">
                  -₹{costs.storageRentCost.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Loading / Labor */}
            <div className="flex items-center justify-between p-3">
              <div>
                <span className="font-medium text-stone-700">
                  {isHi ? 'हमाली, तुलाई व मजदूरी' : 'Handling, Stacking & Labor'}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  {isHi ? 'लोडिंग, अनलोडिंग और कांटा शुल्क' : 'Hamali, weighbridge fee & entry handling'}
                </span>
              </div>
              <span className="font-bold text-red-600">
                -₹{costs.handlingAndLaborCost.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Mandi Fee / Commission / Insurance */}
            {costs.commissionAndMandiFees > 0 && (
              <div className="flex items-center justify-between p-3">
                <div>
                  <span className="font-medium text-stone-700">
                    {isHi ? 'मंडी सेस / कमीशन / बीमा' : 'Mandi Cess / Commission / Insurance'}
                  </span>
                  <span className="text-[10px] text-stone-500 block">
                    {isHi ? 'वैधानिक मंडी टैक्स व बीमा कवर' : 'Statutory APMC fee, warehouse risk cover or pooling charge'}
                  </span>
                </div>
                <span className="font-bold text-red-600">
                  -₹{costs.commissionAndMandiFees.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* KCC Opportunity Holding Finance Cost */}
            {costs.holdingOpportunityFinanceCost > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50/40">
                <div>
                  <span className="font-medium text-amber-900">
                    {isHi ? 'पूंजी रुकावट / KCC ब्याज (4% वार्षिक)' : 'Capital Lockup / KCC Interest (4% p.a.)'}
                  </span>
                  <span className="text-[10px] text-amber-700 block">
                    {isHi ? 'भंडारण दौरान रोके गए माल पर ब्याज' : 'Concessional institutional holding opportunity cost'}
                  </span>
                </div>
                <span className="font-bold text-red-600">
                  -₹{costs.holdingOpportunityFinanceCost.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            {/* Spoilage Loss Note */}
            {option.spoilageQuantityLossKg > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50/40">
                <div>
                  <span className="font-medium text-red-950">
                    {isHi ? 'प्राकृतिक नमी / वजन में कमी' : 'Natural Moisture / Shrinkage Loss'}
                  </span>
                  <span className="text-[10px] text-red-700 block">
                    {option.spoilageQuantityLossKg} {isHi ? 'किग्रा वजन कमी कुल मात्रा से घटाई गई' : 'kg physical weight shrinkage deducted from volume'}
                  </span>
                </div>
                <span className="font-semibold text-red-800 text-[11px]">
                  -₹{costs.spoilageLossValue.toLocaleString('en-IN')} {isHi ? '(मात्रा में)' : '(In Volume)'}
                </span>
              </div>
            )}

            {/* Total Deductions Summary Row */}
            <div className="flex items-center justify-between p-3 bg-stone-100 font-extrabold text-stone-900">
              <span>{isHi ? 'कुल लागू कटौतियां' : 'Total Applicable Deductions'}</span>
              <span className="text-red-700">
                -₹{costs.totalCosts.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Net Proceeds Final Row */}
            <div className="flex items-center justify-between p-3 bg-harvest-pale font-black text-harvest-deep text-sm">
              <span>{isHi ? 'खाते में शुद्ध बचत राशि' : 'Net Take-Home Proceeds'}</span>
              <span className="text-harvest-primary text-base">
                {formatCurrency(option.netProceeds)}
              </span>
            </div>
          </div>
        </div>

        {/* Assumptions List */}
        <div className="mt-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
          <h4 className="font-bold text-[11px] text-stone-800 uppercase tracking-wide flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-harvest-primary" />
            <span>{isHi ? 'मान्यताएं व गणना आधार' : 'Assumptions & Parameters'}</span>
          </h4>
          <ul className="mt-2 space-y-1 text-xs text-stone-600 list-disc list-inside">
            {option.bulletAssumptions.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimers & Advisory Note */}
        <div className="mt-3 bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
          <div className="flex items-start space-x-1.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                {isHi ? 'सलाहकारी गैर-गारंटी सूचना:' : 'Advisory Guidance Non-Guarantee:'}
              </span>
              <p className="mt-0.5">
                {isHi
                  ? 'यह गणना प्रचलित मंडी दरों, WDRA वेयरहाउस दरों और e-NAM आंकड़ों पर आधारित सांकेतिक मॉडल है। भविष्य के भाव घट-बढ़ सकते हैं और अंतिम भुगतान उपज की जांच पर निर्भर करता है।'
                  : 'Projections are non-binding estimates based on prevailing market rates, standard WDRA warehousing tariffs, and official e-NAM quotes. Future prices fluctuate according to arrival volumes, and buyer final acceptance is subject to moisture/quality assay at inspection.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Close Action */}
        <div className="mt-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-colors"
          >
            {isHi ? 'पूर्ण' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
