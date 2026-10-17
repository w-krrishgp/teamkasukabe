import React from 'react';
import { X, BookOpen, Scale } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FormulaDocumentationModalProps {
  onClose: () => void;
}

export const FormulaDocumentationModal: React.FC<FormulaDocumentationModalProps> = ({
  onClose,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto p-5 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-harvest-pale text-harvest-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-harvest-deep">
              {isHi
                ? 'हार्वेस्टगार्ड फॉर्मूला व निर्णय इंजन गणित'
                : 'HarvestGuard Formula & Decision Engine Math'}
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              {isHi
                ? 'किसान की शुद्ध आय निर्धारित करने वाले पारदर्शी गणितीय समीकरण'
                : 'Transparent equations governing farmer net proceeds'}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-xs text-stone-700">
          {/* Core Philosophy */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
            <h3 className="font-extrabold text-harvest-deep flex items-center space-x-1.5 text-xs">
              <Scale className="w-4 h-4 text-harvest-primary" />
              <span>
                {isHi ? 'मुख्य आर्थिक सिद्धांत: खाते में शुद्ध बचत' : 'Core Economic Principle: Net In Pocket'}
              </span>
            </h3>
            <p className="mt-1 text-stone-600 leading-relaxed text-[11px]">
              {isHi
                ? 'सकल भाव भ्रामक हो सकता है। 90 किमी दूर ₹200 अधिक देने वाला व्यापारी भाड़ा, लोडिंग और रास्ते की वजन कमी के बाद किसान को कम बचत दे सकता है। हार्वेस्टगार्ड प्रति क्विंटल शुद्ध बचत की गणना करता है।'
                : 'Gross price is deceptive. A buyer offering ₹200 more at a 90 km distance may leave the farmer poorer than a local sale once freight, loading labor, and transit shrinkage are subtracted. HarvestGuard isolates true net take-home realization per quintal.'}
            </p>
          </div>

          {/* Formula 1: Sell Immediately */}
          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5">
            <span className="font-extrabold text-amber-900 block text-xs">
              {isHi ? '1. तुरंत स्थानीय बिक्री समीकरण' : '1. Immediate Local Sale Equation'}
            </span>
            <div className="bg-stone-100 p-2.5 rounded-lg font-mono text-[11px] text-stone-800 overflow-x-auto">
              Net = (Q × P_immediate) - [max(MinTrip, D × R_base × Q) + (Gross × MandiFee%) + (Q × Labor)]
            </div>
            <ul className="text-[11px] text-stone-600 list-disc list-inside space-y-0.5">
              <li><strong>Q</strong> = {isHi ? 'उपज मात्रा (क्विंटल)' : 'Quantity harvested in Quintals'}</li>
              <li><strong>P_immediate</strong> = {isHi ? 'स्थानीय मंडी / व्यापारी नकद भाव (₹/क्विंटल)' : 'Local APMC / trader cash quote (₹/Qtl)'}</li>
              <li><strong>D</strong> = {isHi ? 'दूरी किमी में' : 'Distance in km'}; <strong>R_base</strong> = {isHi ? 'प्रति किमी प्रति क्विंटल भाड़ा दर' : 'Freight rate per km per Qtl'}</li>
              <li><strong>MandiFee%</strong> = {isHi ? 'वैधानिक एपीएमसी मंडी शुल्क' : 'APMC statutory market cess'}</li>
            </ul>
          </div>

          {/* Formula 2: Store & Sell Later */}
          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5">
            <span className="font-extrabold text-blue-900 block text-xs">
              {isHi ? '2. वेयरहाउस व कोल्ड स्टोरेज समीकरण' : '2. Warehouse & Cold Storage Holding Equation'}
            </span>
            <div className="bg-stone-100 p-2.5 rounded-lg font-mono text-[11px] text-stone-800 overflow-x-auto">
              Q_effective = Q × [1 - (ShrinkageMonthly% × Days / 30)]<br />
              Gross_future = Q_effective × P_future<br />
              Costs = (Q × Rent_month × Days/30) + (Q × EntryHandling) + Transport + KCC_Interest<br />
              Net_storage = Gross_future - Costs
            </div>
            <ul className="text-[11px] text-stone-600 list-disc list-inside space-y-0.5">
              <li><strong>ShrinkageMonthly%</strong> = {isHi ? 'प्राकृतिक नमी व वजन में मासिक कमी' : 'Moisture evaporation & grading shrinkage'}</li>
              <li><strong>KCC_Interest</strong> = {isHi ? '4% रियायती वार्षिक दर पर पूंजी रुकावट लागत' : 'Capital holding cost at 4% p.a. concessional rate'}</li>
              <li><strong>Days ≤ ShelfLife</strong> = {isHi ? 'शेल्फ-लाइफ से अधिक दिन होने पर स्वतः अमान्य' : 'Mandatory safety ceiling (otherwise flagged as prohibitive risk)'}</li>
            </ul>
          </div>

          {/* Formula 3: Break-Even Price */}
          <div className="p-3 bg-harvest-cream border border-harvest-primary/20 rounded-xl space-y-1.5">
            <span className="font-extrabold text-harvest-deep block text-xs">
              {isHi ? '3. ब्रेक-ईवन न्यूनतम भविष्य भाव सीमा' : '3. Break-Even Storage Threshold'}
            </span>
            <div className="bg-white p-2.5 rounded-lg font-mono text-[11px] text-harvest-primary font-bold overflow-x-auto border border-harvest-primary/20">
              P_breakeven = (Net_immediate + Total_Storage_Costs) / Q_effective
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {isHi
                ? 'यदि भविष्य का अपेक्षित बाजार भाव P_breakeven तक नहीं पहुंचता है, तो माल को रोकना तुरंत बेचने की तुलना में आर्थिक नुकसान देगा।'
                : 'If the expected future market price fails to reach P_breakeven, holding the crop is mathematically guaranteed to result in a financial loss compared to selling immediately.'}
            </p>
          </div>

          {/* Formula 4: Crop Pooling */}
          <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1.5">
            <span className="font-extrabold text-emerald-900 block text-xs">
              {isHi ? '4. किसान समूह (पूलिंग) साझा लॉजिस्टिक्स' : '4. Collective Crop Pooling Logistics'}
            </span>
            <div className="bg-stone-100 p-2.5 rounded-lg font-mono text-[11px] text-stone-800 overflow-x-auto">
              SoloFreight = D × R_base × Q<br />
              SharedFreight = SoloFreight × (1 - SharedSavings%)<br />
              Net_pool = (Q × P_pool) - [SharedFreight + (Q × PoolCoordFee) + Labor]
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              {isHi
                ? 'कई किसानों के माल को 16-टन ट्रक में समेकित करने से भाड़े में 35% से 45% की बचत होती है और बड़े खरीदारों से बेहतर भाव मिलता है।'
                : 'Consolidating multiple farmer truckloads into a single 16-tonne multi-axle freight carrier typically generates 35% to 45% freight cost reduction, enabling access to high-paying terminal export hubs.'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close Documentation'}
          </button>
        </div>
      </div>
    </div>
  );
};
