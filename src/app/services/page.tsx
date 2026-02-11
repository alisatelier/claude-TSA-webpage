"use client";

import { useState } from "react";
import { services } from "@/lib/data";
import { useCart } from "@/lib/CartContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

export default function ServicesPage() {
  const { toggleWishlist, wishlist } = useCart();
  const [bookingService, setBookingService] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", notes: "" });
  const [booked, setBooked] = useState(false);

  const timeSlots = ["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"];

  const handleBook = () => {
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setBookingService(null);
      setBookingStep(0);
      setSelectedDate("");
      setSelectedTime("");
      setFormData({ name: "", email: "", notes: "" });
    }, 3000);
  };

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
                      aria-label={wishlist.includes(service.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <FontAwesomeIcon
                        icon={wishlist.includes(service.id) ? faHeart : faHeartRegular}
                        className={`w-5 h-5 ${wishlist.includes(service.id) ? "text-blush" : "text-mauve"}`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-mauve mb-4">
                    <span>{service.duration}</span>
                    <span className="text-mauve/30">|</span>
                    <span className="font-semibold text-navy">From ${service.startingPrice}</span>
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
                      <p className="text-sm text-navy/80">{service.addOn.name} · <span className="font-semibold text-navy">${service.addOn.price}</span></p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <button onClick={() => { setBookingService(service.id); setBookingStep(1); }}
                    className="w-full px-8 py-4 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bookingService && (
        <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-2xl text-navy">
                {booked ? "Booking Confirmed" : `Book ${services.find(s => s.id === bookingService)?.name}`}
              </h3>
              <button onClick={() => { setBookingService(null); setBookingStep(0); }} className="text-mauve hover:text-navy">
                <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
              </button>
            </div>

            {booked ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-[#A69FA5]" />
                </div>
                <p className="text-navy font-medium mb-2">Your session has been booked.</p>
                <p className="text-mauve text-sm">A confirmation email will be sent shortly.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`flex-1 h-1.5 rounded-full ${bookingStep >= step ? "bg-navy" : "bg-cream"}`} />
                  ))}
                </div>

                {bookingStep === 1 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Select a Date</h4>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy focus:outline-none focus:border-navy mb-6"
                      min={new Date().toISOString().split("T")[0]} />
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Select a Time</h4>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {timeSlots.map((time) => (
                        <button key={time} onClick={() => setSelectedTime(time)}
                          className={`px-4 py-2.5 rounded-lg text-sm border transition-colors ${selectedTime === time ? "border-navy bg-navy text-white" : "border-navy/20 text-navy hover:border-navy"}`}>
                          {time}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setBookingStep(2)} disabled={!selectedDate || !selectedTime}
                      className="w-full py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase disabled:bg-mauve/30 disabled:text-mauve disabled:cursor-not-allowed">
                      Continue
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Your Information</h4>
                    <div className="space-y-4 mb-6">
                      <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy" />
                      <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy" />
                      <textarea placeholder="Special requests or notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy resize-none" />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setBookingStep(1)} className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase">Back</button>
                      <button onClick={() => setBookingStep(3)} disabled={!formData.name || !formData.email}
                        className="flex-1 py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase disabled:bg-mauve/30 disabled:text-mauve disabled:cursor-not-allowed">
                        Review
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div>
                    <h4 className="text-sm font-semibold text-navy mb-4 uppercase tracking-wider">Review Your Booking</h4>
                    <div className="bg-cream rounded-lg p-4 space-y-2 mb-6 text-sm">
                      <p><span className="font-semibold text-navy">Service:</span> <span className="text-navy/80">{services.find(s => s.id === bookingService)?.name}</span></p>
                      <p><span className="font-semibold text-navy">Date:</span> <span className="text-navy/80">{selectedDate}</span></p>
                      <p><span className="font-semibold text-navy">Time:</span> <span className="text-navy/80">{selectedTime}</span></p>
                      <p><span className="font-semibold text-navy">Name:</span> <span className="text-navy/80">{formData.name}</span></p>
                      <p className="pt-2 border-t border-mauve/20"><span className="font-semibold text-navy">Total:</span> <span className="text-navy font-semibold">${services.find(s => s.id === bookingService)?.startingPrice}</span></p>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setBookingStep(2)} className="flex-1 py-3 border-2 border-navy text-navy font-medium rounded-lg text-sm tracking-wider uppercase">Back</button>
                      <button onClick={handleBook} className="flex-1 py-3 bg-navy text-white font-medium rounded-lg text-sm tracking-wider uppercase">Confirm Booking</button>
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
