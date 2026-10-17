import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Send,
  Building2,
  Users,
  Truck,
  Copy,
  Check,
} from 'lucide-react';
import type { OptionAnalysis, BookingEnquiry } from '../types';
import { distressSellingService } from '../distressSellingService';
import { formatCurrency } from '@/utils/formatters';
import { MOCK_FARMER_PROFILE } from '@/services/supabase';
import { useLanguage } from '@/context/LanguageContext';

interface EnquiryBookingModalProps {
  option: OptionAnalysis | null;
  cropName: string;
  quantityQuintals: number;
  onClose: () => void;
}

export const EnquiryBookingModal: React.FC<EnquiryBookingModalProps> = ({
  option,
  cropName,
  quantityQuintals,
  onClose,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  if (!option) return null;

  const [farmerName, setFarmerName] = useState(MOCK_FARMER_PROFILE.fullName);
  const [farmerPhone, setFarmerPhone] = useState(MOCK_FARMER_PROFILE.phone);
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<BookingEnquiry | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const getActionTitle = () => {
    if (isHi) {
      switch (option.id) {
        case 'store_and_sell_later':
          return 'वेयरहाउस व कोल्ड स्टोरेज आरक्षण अनुरोध';
        case 'crop_pooling':
          return 'किसान समूह (पूलिंग) बैच में जुड़ने का आवेदन';
        case 'alternative_buyer':
          return 'सीधे मिलर / प्रोसेसर खरीद पूछताछ';
        case 'sell_immediately':
          return 'स्थानीय मंडी / व्यापारी रवानगी पुष्टि';
      }
    }
    switch (option.id) {
      case 'store_and_sell_later':
        return 'Warehouse & Cold Storage Reservation Request';
      case 'crop_pooling':
        return 'Join Crop Pooling Batch Application';
      case 'alternative_buyer':
        return 'Direct Miller / Processor Purchase Enquiry';
      case 'sell_immediately':
        return 'Immediate APMC Mandi Trader Dispatch Confirmation';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await distressSellingService.submitEnquiry({
        farmerName,
        farmerPhone,
        cropName,
        quantityQuintals,
        optionSelected: option.id,
        targetEntityName: option.subtitle,
        expectedNetProceeds: option.netProceeds,
        notes: `Preferred pickup/intake date: ${preferredDate}. ${notes}`.trim(),
      });
      setSubmittedEnquiry(result);
    } catch (err) {
      console.error('Failed to submit booking enquiry', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyToken = () => {
    if (submittedEnquiry?.id) {
      navigator.clipboard.writeText(submittedEnquiry.id);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] overflow-y-auto p-5 shadow-2xl relative"
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

        {submittedEnquiry ? (
          /* Success Screen */
          <div className="py-4 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {isHi ? 'अनुरोध सफलतापूर्वक भेजा गया' : 'Enquiry Dispatched Successfully'}
              </span>
              <h2 className="text-lg font-black text-harvest-deep mt-2">
                {isHi ? 'बुकिंग टोकन जनरेट हुआ' : 'Booking Token Confirmed'}
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                {isHi
                  ? `आपका अनुरोध ${option.subtitle} को भेजा गया है। आधिकारिक SMS टोकन दर्ज किया गया है।`
                  : `Your request has been routed to ${option.subtitle}. An official SMS token has been logged.`}
              </p>
            </div>

            {/* Token Badge */}
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl flex items-center justify-between max-w-xs mx-auto">
              <div className="text-left">
                <span className="text-[10px] text-stone-500 font-bold uppercase block">
                  {isHi ? 'संदर्भ संख्या (टोकन)' : 'Reference ID'}
                </span>
                <span className="text-xs font-mono font-black text-harvest-deep truncate block">
                  {submittedEnquiry.id}
                </span>
              </div>
              <button
                onClick={handleCopyToken}
                className="p-1.5 rounded-lg bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
                title="Copy Token"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Key Summary */}
            <div className="bg-harvest-cream p-3 rounded-xl border border-harvest-primary/20 text-xs text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-600">{isHi ? 'फसल विवरण:' : 'Crop Batch:'}</span>
                <span className="font-bold text-harvest-deep">
                  {quantityQuintals} Qtl {cropName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">{isHi ? 'अनुमानित शुद्ध आय:' : 'Projected Net Proceeds:'}</span>
                <span className="font-extrabold text-harvest-primary">
                  {formatCurrency(option.netProceeds)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">{isHi ? 'प्राप्तकर्ता:' : 'Recipient Contact:'}</span>
                <span className="font-medium text-stone-800">{option.subtitle}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
              <a
                href={`tel:+919876543210`}
                className="py-2.5 px-3 rounded-xl border border-stone-300 font-bold text-stone-800 flex items-center justify-center space-x-1.5 hover:bg-stone-50 transition-colors"
              >
                <Phone className="w-4 h-4 text-harvest-primary" />
                <span>{isHi ? 'सीधा कॉल करें' : 'Call Desk'}</span>
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `HarvestGuard Booking Request: ${submittedEnquiry.id} for ${quantityQuintals} Qtl ${cropName} with ${option.subtitle}. Estimated net: ${formatCurrency(
                    option.netProceeds
                  )}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isHi ? 'व्हाट्सएप पर साझा करें' : 'Share WhatsApp'}</span>
              </a>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-harvest-deep text-white font-bold text-xs hover:bg-stone-900 transition-colors"
            >
              {isHi ? 'निर्णय इंजन पर वापस जाएं' : 'Back to Decision Engine'}
            </button>
          </div>
        ) : (
          /* Input Form */
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-harvest-pale text-harvest-primary">
                {option.id === 'store_and_sell_later' ? (
                  <Building2 className="w-5 h-5" />
                ) : option.id === 'crop_pooling' ? (
                  <Users className="w-5 h-5" />
                ) : (
                  <Truck className="w-5 h-5" />
                )}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-harvest-deep">
                  {getActionTitle()}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {option.subtitle} • {quantityQuintals} {isHi ? 'क्विंटल' : 'Quintals'} {cropName}
                </p>
              </div>
            </div>

            {/* Target Value Callout */}
            <div className="mt-4 p-3 bg-harvest-cream border border-harvest-primary/20 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-600 block">
                  {isHi ? 'अपेक्षित शुद्ध बचत (खाते में):' : 'Expected Take-Home Net:'}
                </span>
                <span className="text-base font-black text-harvest-deep">
                  {formatCurrency(option.netProceeds)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-500 block">
                  {isHi ? 'प्राप्त दर' : 'Realized Rate'}
                </span>
                <span className="font-extrabold text-harvest-primary">
                  ₹{option.netRealizedPricePerQuintal.toLocaleString('en-IN')} / Qtl
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'किसान का पूरा नाम' : 'Farmer Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30 text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'मोबाइल नंबर (SMS टोकन हेतु)' : 'Contact Mobile Number (SMS Token)'}
                </label>
                <input
                  type="tel"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30 text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'पसंदीदा माल जमा/लोडिंग तिथि' : 'Preferred Intake / Pickup Date'}
                </label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30 text-stone-800"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isHi ? 'विशेष निर्देश / नमी / बोरी विवरण (वैकल्पिक)' : 'Special Notes / Moisture / Loading Instructions (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isHi ? 'जैसे: बोरियां खेत के मुख्य गेट पर तैयार हैं...' : 'e.g. Gunny bags ready at farm entrance...'}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-harvest-primary/30 text-stone-800"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] text-stone-600 flex items-start space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  {isHi
                    ? 'कोई अग्रिम शुल्क या जुर्माना नहीं। यह अनुरोध प्राथमिकता स्लॉट सुरक्षित करता है और आपको सत्यापित प्रबंधक से जोड़ता है।'
                    : 'No immediate commitment or financial penalty. Submitting this enquiry reserves priority intake slot and connects you with the verified coordinator.'}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-harvest-primary hover:bg-harvest-deep text-white font-extrabold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? (isHi ? 'भेज रहे हैं...' : 'Submitting...') : (isHi ? 'अनुरोध भेजें' : 'Send Booking Request')}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
