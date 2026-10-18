import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Warehouse,
  Thermometer,
  ShieldCheck,
  MapPin,
  Phone,
  Truck,
  Sparkles,
  QrCode,
  Tag,
  Sun,
  Zap,
  ChevronRight,
  Printer,
} from 'lucide-react';
import {
  StatusBadge,
  Button,
  FormInput,
} from '@/components/common';
import { useLanguage } from '@/context/LanguageContext';
import {
  getColdStorageFacilities,
  getUserColdStorageBookings,
  createColdStorageBooking,
} from '@/services/coldStorageService';
import type {
  ColdStorageFacility,
  ColdStorageBookingRequest,
} from '@/types/intelligence';

export const ColdStoragePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [facilities] = useState<ColdStorageFacility[]>(() => getColdStorageFacilities());
  const [bookings, setBookings] = useState<ColdStorageBookingRequest[]>(() =>
    getUserColdStorageBookings()
  );

  const [activeTab, setActiveTab] = useState<'facilities' | 'my_bookings'>('facilities');
  const [bookingModalFacility, setBookingModalFacility] = useState<ColdStorageFacility | null>(null);
  const [confirmedBookingSlip, setConfirmedBookingSlip] = useState<ColdStorageBookingRequest | null>(null);

  // Booking Form State
  const [farmerName, setFarmerName] = useState('Ramesh Patel');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [commodity, setCommodity] = useState('Potato (Kufri Pukhraj)');
  const [quantityQtl, setQuantityQtl] = useState('35');
  const [durationMonths, setDurationMonths] = useState('3');
  const [inboundDate, setInboundDate] = useState('2026-10-24');
  const [transportNeeded, setTransportNeeded] = useState(true);

  const commodities = ['All', 'Potato', 'Mustard', 'Onion', 'Cumin / Jeera', 'Vegetables'];

  const filteredFacilities = useMemo(() => {
    if (selectedCommodity === 'All') return facilities;
    return facilities.filter((f) =>
      f.supportedCommodities.some((c) =>
        c.toLowerCase().includes(selectedCommodity.toLowerCase())
      )
    );
  }, [facilities, selectedCommodity]);

  const handleOpenBooking = (facility: ColdStorageFacility) => {
    setBookingModalFacility(facility);
    if (facility.supportedCommodities.length > 0) {
      setCommodity(facility.supportedCommodities[0]);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalFacility) return;

    const newBooking = createColdStorageBooking({
      facilityId: bookingModalFacility.id,
      farmerName,
      contactPhone,
      commodity,
      quantityQuintals: Number(quantityQtl) || 20,
      durationMonths: Number(durationMonths) || 2,
      inboundDate,
      transportNeeded,
    });

    setBookings((prev) => [newBooking, ...prev]);
    setBookingModalFacility(null);
    setConfirmedBookingSlip(newBooking);
  };

  const calculatePreviewDeposit = () => {
    if (!bookingModalFacility) return 0;
    const qtl = Number(quantityQtl) || 0;
    const months = Number(durationMonths) || 1;
    return Math.round(qtl * bookingModalFacility.tariffPerQtlPerMonth * months);
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
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-200">
          Feature 6 • Post-Harvest Risk
        </span>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-harvest-deep flex items-center space-x-2">
            <Warehouse className="w-6 h-6 text-sky-700" />
            <span>{language === 'hi' ? 'कोल्ड स्टोरेज व फसल संरक्षण' : 'Cold Storage & Risk Mitigation'}</span>
          </h1>
          <div className="flex bg-stone-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('facilities')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'facilities' ? 'bg-white shadow-xs text-harvest-deep' : 'text-stone-500'
              }`}
            >
              Facilities
            </button>
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                activeTab === 'my_bookings' ? 'bg-white shadow-xs text-harvest-deep' : 'text-stone-500'
              }`}
            >
              <span>Bookings</span>
              <span className="w-4 h-4 rounded-full bg-harvest-primary text-white text-[10px] flex items-center justify-center">
                {bookings.length}
              </span>
            </button>
          </div>
        </div>
        <p className="text-xs text-stone-600">
          {language === 'hi'
            ? 'डब्ल्यूडीआरए प्रमाणित वेयरहाउस, क्षमता ट्रैकिंग, तापमान जोन व स्लॉट आरक्षण'
            : 'WDRA-certified cold chains, real-time capacity telemetry & instant slot booking requests'}
        </p>
      </div>

      {/* Perishable Harvest Spoilage Risk Detector */}
      <div className="bg-gradient-to-br from-[#122b1c] via-[#142318] to-stone-900 text-white p-4 rounded-3xl shadow-lg border border-emerald-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30">
              <Thermometer className="w-4 h-4" />
            </span>
            <span className="text-xs font-extrabold tracking-wide uppercase text-sky-200">
              Post-Harvest Spoilage Risk Advisory
            </span>
          </div>
          <span className="text-[10px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-extrabold uppercase">
            Rain Threat in 48h
          </span>
        </div>

        <div>
          <h2 className="text-base font-extrabold tracking-tight">
            Protect 40 Quintals of Harvest from Spoilage & Price Drop
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
            Upcoming humidity spikes and market arrival gluts in Mehsana / Unjha mandis may cause 15-20% post-harvest loss. Store in temperature-controlled vaults (2°C–4°C) to sell at peak off-season rates (+₹320/Qtl).
          </p>
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3 text-[11px] text-emerald-200">
            <span>Available Nearby Capacity: <strong>7,950 MT</strong></span>
            <span>Subsidized Tariff from <strong>₹38/Qtl/mo</strong></span>
          </div>
          <button
            onClick={() => handleOpenBooking(facilities[0])}
            className="text-[11px] font-bold text-sky-300 hover:underline flex items-center space-x-1"
          >
            <span>Quick Reserve</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Workflow 3 Deliverable Banner */}
      <div className="bg-gradient-to-r from-sky-950 to-harvest-deep text-white p-3.5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
              Workflow 3 Deliverable
            </span>
          </div>
          <p className="text-xs font-extrabold">Post-Harvest Loss Prevention & Cold Storage Booking</p>
          <p className="text-[10px] text-sky-100">
            Capacity audits, multi-chamber matching & digital gate pass generation
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="text-xs bg-white text-harvest-deep hover:bg-sky-50 shrink-0 font-bold"
          onClick={() => navigate('/intelligence')}
        >
          View Hub
        </Button>
      </div>

      {activeTab === 'facilities' ? (
        <>
          {/* Commodity Filters */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Filter by Target Commodity:
              </span>
              <span className="text-[10px] text-stone-500">{filteredFacilities.length} Facilities Found</span>
            </div>

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
              {commodities.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCommodity(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCommodity === c
                      ? 'bg-harvest-deep text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Facility Listings */}
          <div className="space-y-3">
            {filteredFacilities.map((facility) => {
              const freeSpaceMT = facility.availableCapacityMT;
              const isNearlyFull = facility.occupancyPercent >= 80;

              return (
                <div
                  key={facility.id}
                  className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden p-4 space-y-3 hover:border-harvest-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-extrabold text-harvest-deep">
                          {facility.name}
                        </span>
                        {facility.wdraRegistered && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded-full border border-emerald-200">
                            WDRA
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-harvest-primary shrink-0" />
                        <span>{facility.location}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-harvest-primary bg-harvest-pale px-2 py-0.5 rounded-md">
                        {facility.distanceKm} km away
                      </span>
                      <span className="text-[10px] text-stone-500 block mt-1">
                        ⭐ {facility.rating} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Real-time Capacity Progress Bar */}
                  <div className="space-y-1 bg-[#F9FAF8] p-2.5 rounded-xl border border-stone-200/70">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-stone-700">Storage Capacity Telemetry:</span>
                      <span
                        className={`font-extrabold ${
                          isNearlyFull ? 'text-amber-700' : 'text-emerald-700'
                        }`}
                      >
                        {facility.occupancyPercent}% Occupied ({freeSpaceMT} MT Free)
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isNearlyFull ? 'bg-amber-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${facility.occupancyPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-500">
                      <span>Total: {facility.totalCapacityMT} MT</span>
                      <span>Available: {facility.availableCapacityMT} MT</span>
                    </div>
                  </div>

                  {/* Specs & Chamber Environment */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                      <span className="text-[10px] text-stone-500 block font-medium">Temperature:</span>
                      <span className="font-bold text-harvest-deep">{facility.temperatureRange}</span>
                    </div>
                    <div className="p-2 bg-stone-50 rounded-xl border border-stone-200/60">
                      <span className="text-[10px] text-stone-500 block font-medium">Rental Tariff:</span>
                      <span className="font-extrabold text-emerald-800">
                        ₹ {facility.tariffPerQtlPerMonth} / Qtl / Month
                      </span>
                    </div>
                  </div>

                  {/* Supported Crops */}
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold block mb-1">
                      Commodities Accepted:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {facility.supportedCommodities.map((crop, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex items-center space-x-2 pt-1 text-[10px] text-stone-600">
                    {facility.solarPowered && (
                      <span className="flex items-center space-x-0.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
                        <Sun className="w-3 h-3" />
                        <span>Solar Powered</span>
                      </span>
                    )}
                    {facility.powerBackup && (
                      <span className="flex items-center space-x-0.5 text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-bold">
                        <Zap className="w-3 h-3" />
                        <span>24/7 Power Gen</span>
                      </span>
                    )}
                    {facility.subsidyEligible && (
                      <span className="flex items-center space-x-0.5 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                        <Tag className="w-3 h-3" />
                        <span>Govt Subsidy Eligible</span>
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex items-center space-x-2">
                    <a
                      href={`tel:${facility.contactPhone}`}
                      className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center justify-center shrink-0"
                      title="Call Warehouse Manager"
                    >
                      <Phone className="w-4 h-4 text-harvest-deep" />
                    </a>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1 text-xs font-bold bg-sky-800 hover:bg-sky-900"
                      onClick={() => handleOpenBooking(facility)}
                    >
                      Book Storage Slot Request
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Bookings Tab */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Active Storage Passes & Reservations ({bookings.length})
            </span>
          </div>

          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-stone-200 rounded-2xl p-4 space-y-2.5 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200">
                    Token: {b.tokenNumber}
                  </span>
                  <h3 className="text-sm font-extrabold text-harvest-deep mt-1">
                    {b.facilityName}
                  </h3>
                  <p className="text-[11px] text-stone-500">{b.facilityLocation}</p>
                </div>
                <StatusBadge variant="success" size="sm">
                  {b.status.toUpperCase()}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#F9FAF8] p-2.5 rounded-xl border border-stone-200/70 text-center text-xs">
                <div>
                  <span className="text-[10px] text-stone-500 block">Commodity</span>
                  <span className="font-extrabold text-harvest-deep">{b.commodity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Quantity</span>
                  <span className="font-extrabold text-harvest-deep">{b.quantityQuintals} Quintals</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">Duration</span>
                  <span className="font-extrabold text-harvest-deep">{b.durationMonths} Months</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                <span>Inbound Date: <strong>{b.inboundDate}</strong></span>
                <span>Deposit: <strong className="text-emerald-800">₹ {b.estimatedDeposit.toLocaleString()}</strong></span>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-500">Booked: {b.createdAt}</span>
                <button
                  onClick={() => setConfirmedBookingSlip(b)}
                  className="text-xs font-bold text-sky-800 hover:underline flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Gate Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Form Modal */}
      {bookingModalFacility && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl border border-stone-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-harvest-deep">
                  Reserve Cold Storage Slot
                </h3>
                <p className="text-xs text-stone-500 truncate max-w-[280px]">
                  {bookingModalFacility.name}
                </p>
              </div>
              <button
                onClick={() => setBookingModalFacility(null)}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Farmer Name</label>
                  <FormInput
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="h-10 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number</label>
                  <FormInput
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="h-10 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Select Commodity</label>
                <select
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs bg-white focus:border-harvest-primary focus:outline-none"
                >
                  {bookingModalFacility.supportedCommodities.map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Quantity (Quintals)</label>
                  <FormInput
                    type="number"
                    min="5"
                    max="500"
                    value={quantityQtl}
                    onChange={(e) => setQuantityQtl(e.target.value)}
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Storage Duration</label>
                  <select
                    value={durationMonths}
                    onChange={(e) => setDurationMonths(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-stone-300 text-xs bg-white focus:border-harvest-primary focus:outline-none"
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months (Standard)</option>
                    <option value="6">6 Months (Long-Term)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Target Inbound Date</label>
                <FormInput
                  type="date"
                  value={inboundDate}
                  onChange={(e) => setInboundDate(e.target.value)}
                  className="h-10 text-xs"
                  required
                />
              </div>

              {/* Farm Gate Pickup Toggle */}
              <div className="p-3 bg-[#F9FAF8] rounded-2xl border border-stone-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-sky-700" />
                  <div>
                    <span className="text-xs font-extrabold text-harvest-deep block">
                      Farm-Gate Transport Pickup
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Dispatches mini-truck from APMC hub to your farm
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={transportNeeded}
                  onChange={(e) => setTransportNeeded(e.target.checked)}
                  className="w-4 h-4 accent-harvest-primary cursor-pointer"
                />
              </div>

              {/* Live Rental Deposit Calculator */}
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-sky-800 uppercase font-bold block">
                    Estimated Storage Tariff
                  </span>
                  <span className="font-extrabold text-sky-950 text-base">
                    ₹ {calculatePreviewDeposit().toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-sky-700 font-semibold text-right">
                  Rate: ₹{bookingModalFacility.tariffPerQtlPerMonth}/Qtl/mo
                </span>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-1/2 text-xs"
                  onClick={() => setBookingModalFacility(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-1/2 text-xs font-bold bg-sky-800 hover:bg-sky-900"
                >
                  Confirm Reservation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Inbound Gate Pass / Booking Slip Modal */}
      {confirmedBookingSlip && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-sky-100 text-sky-800">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-950">
                    Official Inbound Gate Pass
                  </h3>
                  <span className="text-[10px] text-stone-500">WDRA Regulated Slip</span>
                </div>
              </div>
              <button
                onClick={() => setConfirmedBookingSlip(null)}
                className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            {/* Pass QR and Code */}
            <div className="text-center py-2 bg-[#F9FAF8] rounded-2xl border border-stone-200 space-y-2">
              <div className="w-24 h-24 mx-auto bg-white p-2 rounded-xl border border-stone-300 flex items-center justify-center shadow-xs">
                <QrCode className="w-20 h-20 text-stone-800" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-stone-500 uppercase">Booking Token ID</span>
                <p className="text-base font-extrabold text-harvest-deep tracking-wider font-mono">
                  {confirmedBookingSlip.tokenNumber}
                </p>
              </div>
            </div>

            {/* Slip Meta */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Warehouse:</span>
                <span className="font-extrabold text-harvest-deep text-right truncate max-w-[200px]">
                  {confirmedBookingSlip.facilityName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Farmer:</span>
                <span className="font-bold">{confirmedBookingSlip.farmerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Commodity & Quantity:</span>
                <span className="font-extrabold text-sky-800">
                  {confirmedBookingSlip.quantityQuintals} Qtl • {confirmedBookingSlip.commodity}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Target Inbound Date:</span>
                <span className="font-bold">{confirmedBookingSlip.inboundDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Deposit Estimate:</span>
                <span className="font-extrabold text-emerald-800">
                  ₹ {confirmedBookingSlip.estimatedDeposit.toLocaleString()}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs font-bold"
              onClick={() => {
                window.print();
              }}
              iconLeft={<Printer className="w-3.5 h-3.5" />}
            >
              Print / Save Gate Pass (PDF)
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
