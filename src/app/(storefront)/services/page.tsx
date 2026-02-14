"use client";

import { useState, useCallback } from "react";
import { services } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { useCurrency } from "@/lib/CurrencyContext";
import { useBooking } from "@/lib/BookingContext";
import BookingTimer from "@/components/BookingTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function ServicesPage() {
  const { toggleWishlist, isWishlisted: checkWishlisted, addToCart, removeFromCart } = useCart();
  const { formatPrice, getProductPrice } = useCurrency();
  const { isSlotTaken, createHold, getActiveHold, releaseHold } = useBooking();

  const [bookingService, setBookingService] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [addOnSelected, setAddOnSelected] = useState(false);
  const [holdError, setHoldError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);

  const timeSlots = ["12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM"];

  const activeHold = getActiveHold();
  const currentService = bookingService ? services.find((s) => s.id === bookingService) : null;

  const basePrice = currentService ? getProductPrice(currentService.startingPrices) : 0;
  const addOnPrice = addOnSelected && currentService?.addOn ? getProductPrice(currentService.addOn.prices) : 0;
  const totalPrice = basePrice + addOnPrice;

  const cadBasePrice = currentService?.startingPrices.CAD ?? 0;
  const cadAddOnPrice = addOnSelected && currentService?.addOn ? currentService.addOn.prices.CAD : 0;
  const cadTotalPrice = cadBasePrice + cadAddOnPrice;

  const resetModal = useCallback(() => {
    setBookingService(null);
    setBookingStep(0);
    setSelectedDate("");
    setSelectedTime("");
    setFormData({ name: "", email: "", notes: "" });
    setAddOnSelected(false);
    setHoldError("");
    setAddedToCart(false);
  }, []);

  const handleAddToCart = async () => {
    if (!currentService) return;
    setHoldError("");

    // Check one-hold-per-user
    const existing = getActiveHold();
    if (existing) {
      setHoldError("You already have a held booking. Complete or cancel it before booking another.");
      return;
    }

    const holdId = await createHold({
      serviceId: currentService.id,
      selectedDate,
      selectedTime,
      userName: formData.name,
      userEmail: formData.email,
      userNotes: formData.notes,
      addOn: addOnSelected,
      totalPrice,
    });

    if (!holdId) {
      setHoldError("This time slot is no longer available. Please choose another.");
      return;
    }

    addToCart({
      productId: `service-${currentService.id}-${holdId}`,
      name: currentService.name,
      price: totalPrice,
      cadPrice: cadTotalPrice,
      quantity: 1,
      image: "",
      isService: true,
      holdId,
      selectedDate,
      selectedTime,
    });

    setAddedToCart(true);
  };

  const handleOpenBooking = (serviceId: string) => {
    setBookingService(serviceId);
    setBookingStep(1);
    setHoldError("");
    setAddedToCart(false);
  };

  const handleHoldExpire = useCallback(() => {
    if (activeHold) {
      // Remove from cart
      const cartProductId = `service-${activeHold.serviceId}-${activeHold.id}`;
      removeFromCart(cartProductId);
      releaseHold(activeHold.id);
    }
  }, [activeHold, removeFromCart, releaseHold]);

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Services</h1>
          <p className="font-accent italic text-white/70 text-lg max-w-2xl mx-auto">
            Personalized guidance to support your spiritual journey
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl text-navy mb-4">What to Expect</h2>
          <p className="text-navy/80 leading-relaxed">
            Each session is held with intention and care. Whether virtual or in-person, you will be met with presence, honesty, and a non-judgmental approach. Sessions are collaborative — you bring your questions, and together we explore what arises. No prior experience with spiritual tools is required.
          </p>
        </div>
      </section>

      {/* Active hold banner */}
      {activeHold && (
        <section className="px-4 pt-6">
          <div className="max-w-5xl mx-auto">
            <BookingTimer
              expiresAt={activeHold.expiresAt}
              onExpire={handleHoldExpire}
              variant="banner"
            />
          </div>
        </section>
      )}

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {services.map((service) => (
            <div key={service.id} id={service.id} className="bg-white rounded-xl p-8 md:p-12 shadow-[0_4px_12px_rgba(83,91,115,0.08)] scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading text-3xl text-navy">{service.name}</h3>
                    <button
                      onClick={() => toggleWishlist(service.id)}
                      className="flex-shrink-0 p-1 hover:scale-110 transition-transform mt-1"
                      aria-label={checkWishlisted(service.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FontAwesomeIcon
                        icon={checkWishlisted(service.id) ? faHeart : faHeartRegular}
                        className={`w-5 h-5 ${checkWishlisted(service.id) ? "text-blush" : "text-mauve"}`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-mauve mb-4">
                    <span>{service.duration}</span>
                    <span className="text-mauve/30">|</span>
                    <span className="font-semibold text-navy">From {formatPrice(getProductPrice(service.startingPrices))}</span>
                  </div>
                  <p className="text-navy/80 leading-relaxed mb-6">{service.description}</p>
                  <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">What&apos;s Included</h4>
                  <ul className="space-y-2 mb-6">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-navy/80">
                        <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-blush mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {service.addOn && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Add On</h4>
                      <p className="text-sm text-navy/80">{service.addOn.name} · <span className="font-semibold text-navy">{formatPrice(getProductPrice(service.addOn.prices))}</span></p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button onClick={() => handleOpenBooking(service.id)}
                    className="w-full px-8 py-4 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Modal */}
      {bookingService && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-2xl text-navy">
                {addedToCart ? "Added to Cart" : `Book ${currentService?.name}`}
              </h3>
              <button onClick={resetModal} className="text-mauve hover:text-navy">
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>

            {addedToCart ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-navy font-medium mb-2">Service added to cart</p>
                <p className="text-mauve text-sm mb-6">Your time is held for 10 minutes. Complete checkout to secure your booking.</p>
                <div className="flex gap-3">
                  <button
                    onClick={resetModal}
                    className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase"
                  >
                    Continue Browsing
                  </button>
                  <a
                    href="/cart"
                    className="flex-1 py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase text-center"
                  >
                    Go to Cart
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Step indicators */}
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`flex-1 h-1.5 rounded-full ${bookingStep >= step ? "bg-navy" : "bg-cream"}`} />
                  ))}
                </div>

                {holdError && (
                  <div className="mb-4 p-3 bg-blush/10 border border-blush/30 rounded-lg text-sm text-navy">
                    {holdError}
                  </div>
                )}

                {/* Step 1: Date & Time */}
                {bookingStep === 1 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Select a Date</h4>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setSelectedDate(newDate);
                        setSelectedTime("");
                        if (newDate) {
                          setLoadingSlots(true);
                          fetch(`/api/schedule/availability?date=${newDate}`)
                            .then((res) => res.ok ? res.json() : { blockedSlots: [] })
                            .then((data) => setBlockedSlots(new Set(data.blockedSlots ?? [])))
                            .catch(() => setBlockedSlots(new Set()))
                            .finally(() => setLoadingSlots(false));
                        } else {
                          setBlockedSlots(new Set());
                        }
                      }}
                      className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy focus:outline-none focus:border-navy mb-6"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Select a Time</h4>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {loadingSlots ? (
                        <p className="col-span-2 text-sm text-mauve py-2">Loading availability...</p>
                      ) : blockedSlots.size === timeSlots.length && selectedDate ? (
                        <p className="col-span-2 text-sm text-mauve py-2">No time slots available for this date.</p>
                      ) : (
                        timeSlots.map((time) => {
                          const taken = selectedDate && currentService
                            ? isSlotTaken(currentService.id, selectedDate, time)
                            : false;
                          const blocked = blockedSlots.has(time);
                          const unavailable = taken || blocked;
                          return (
                            <button
                              key={time}
                              onClick={() => !unavailable && setSelectedTime(time)}
                              disabled={unavailable || !selectedDate}
                              className={`px-4 py-2.5 rounded-lg text-sm border transition-colors ${
                                unavailable
                                  ? "border-navy/10 bg-navy/5 text-mauve/50 cursor-not-allowed"
                                  : selectedTime === time
                                  ? "border-navy bg-navy text-white"
                                  : !selectedDate
                                  ? "border-navy/10 text-mauve/50 cursor-not-allowed"
                                  : "border-navy/20 text-navy hover:border-navy"
                              }`}
                            >
                              {unavailable ? `${time} — Unavailable` : time}
                            </button>
                          );
                        })
                      )}
                    </div>
                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!selectedDate || !selectedTime}
                      className="w-full py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase disabled:bg-mauve/30 disabled:text-mauve disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 2: Information + Add-on */}
                {bookingStep === 2 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Your Information</h4>
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy"
                      />
                      <textarea
                        placeholder="Special requests or notes (optional)"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy resize-none"
                      />
                    </div>

                    {currentService?.addOn && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-navy mb-3 uppercase tracking-wider">Add On</h4>
                        <label className="flex items-center gap-3 p-4 border border-navy/20 rounded-lg cursor-pointer hover:border-navy transition-colors">
                          <input
                            type="checkbox"
                            checked={addOnSelected}
                            onChange={(e) => setAddOnSelected(e.target.checked)}
                            className="w-4 h-4 rounded border-navy/30 text-navy focus:ring-navy"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-navy">{currentService.addOn.name}</p>
                          </div>
                          <span className="text-sm font-semibold text-navy">+{formatPrice(getProductPrice(currentService.addOn.prices))}</span>
                        </label>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-6 p-3 bg-cream rounded-lg">
                      <span className="text-sm text-navy/70">Subtotal</span>
                      <span className="font-semibold text-navy">{formatPrice(totalPrice)}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => { setHoldError(""); setBookingStep(3); }}
                        disabled={!formData.name || !formData.email}
                        className="flex-1 py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase disabled:bg-mauve/30 disabled:text-mauve disabled:cursor-not-allowed"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Review & Add to Cart */}
                {bookingStep === 3 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Review Your Booking</h4>
                    <div className="bg-cream rounded-lg p-4 space-y-2 mb-6 text-sm">
                      <p><span className="font-semibold text-navy">Service:</span> <span className="text-navy/80">{currentService?.name}</span></p>
                      <p><span className="font-semibold text-navy">Date:</span> <span className="text-navy/80">{selectedDate}</span></p>
                      <p><span className="font-semibold text-navy">Time:</span> <span className="text-navy/80">{selectedTime}</span></p>
                      <p><span className="font-semibold text-navy">Name:</span> <span className="text-navy/80">{formData.name}</span></p>
                      <p><span className="font-semibold text-navy">Email:</span> <span className="text-navy/80">{formData.email}</span></p>
                      {formData.notes && (
                        <p><span className="font-semibold text-navy">Notes:</span> <span className="text-navy/80">{formData.notes}</span></p>
                      )}
                      {addOnSelected && currentService?.addOn && (
                        <p><span className="font-semibold text-navy">Add-on:</span> <span className="text-navy/80">{currentService.addOn.name} (+{formatPrice(getProductPrice(currentService.addOn.prices))})</span></p>
                      )}
                      <p className="pt-2 border-t border-mauve/20">
                        <span className="font-semibold text-navy">Total:</span>{" "}
                        <span className="text-navy font-semibold">{formatPrice(totalPrice)}</span>
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setBookingStep(2)}
                        className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
