"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const subjects = ["General Inquiry", "Order Question", "Service Inquiry", "Partnership", "Other"];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Contact</h1>
          <p className="font-accent italic text-white/70 text-lg">We would love to hear from you</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-cream rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-8 h-8 text-[#A69FA5]" />
                  </div>
                  <h2 className="font-heading text-3xl text-navy mb-4">Message Sent</h2>
                  <p className="text-navy/70 mb-6">We will respond within 24-48 hours.</p>
                  <button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }} className="text-navy underline text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" placeholder="Your name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" placeholder="Your email" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Subject</label>
                    <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy focus:outline-none focus:border-navy transition-colors bg-white" required>
                      <option value="">Select a subject</option>
                      {subjects.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">Message</label>
                    <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} rows={6} className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors resize-none" placeholder="Your message" required />
                  </div>
                  <button type="submit" className="px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-xl text-navy mb-3">Get in Touch</h3>
                <p className="text-navy/70 text-sm mb-4">We typically respond within 24-48 hours.</p>
                <a href="mailto:hello@thespiritatelier.com" className="text-navy font-medium text-sm hover:text-mauve transition-colors">hello@thespiritatelier.com</a>
              </div>
              <div>
                <h3 className="font-heading text-xl text-navy mb-3">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/faq" className="text-navy/70 text-sm hover:text-navy transition-colors">FAQ</Link></li>
                  <li><Link href="/shipping-returns" className="text-navy/70 text-sm hover:text-navy transition-colors">Shipping &amp; Returns</Link></li>
                  <li><Link href="/services" className="text-navy/70 text-sm hover:text-navy transition-colors">Book a Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
