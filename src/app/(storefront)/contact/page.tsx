"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const subjects = [
  "General Inquiry",
  "Order Question",
  "Service Inquiry",
  "Partnership",
  "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const [subjectOpen, setSubjectOpen] = useState(false);

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            Contact
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            We would love to hear from you
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-cream rounded-xl p-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="w-8 h-8 text-[A69FA5]]"
                    />
                  </div>
                  <h2 className="font-heading text-3xl text-navy mb-4">
                    Message Sent
                  </h2>
                  <p className="text-navy/70 mb-6">
                    We will respond within 24-48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="text-navy underline text-sm"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors"
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                      Subject
                    </label>
                    <div>
                      <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                        Subject
                      </label>

                      <div className="relative">
                        {/* Trigger */}
                        <button
                          type="button"
                          onClick={() => setSubjectOpen((prev) => !prev)}
                          className="w-full px-4 py-3 bg-white border border-navy/20 rounded-xl text-sm text-navy flex justify-between items-center hover:border-blush transition-colors focus:outline-none focus:ring-2 focus:ring-blush/30"
                        >
                          <span>{formData.subject || "Select a subject"}</span>

                          <svg
                            className={`w-4 h-4 text-mauve transition-transform duration-300 ${
                              subjectOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {subjectOpen && (
                          <div className="absolute z-30 mt-2 w-full bg-white border border-cream rounded-xl shadow-[0_10px_40px_rgba(83,91,115,0.15)] overflow-hidden animate-fade-in">
                            {subjects.map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, subject: s });
                                  setSubjectOpen(false);
                                }}
                                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                                  formData.subject === s
                                    ? "bg-blush/10 text-navy"
                                    : "text-navy hover:bg-blush/10"
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-3 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors resize-none"
                      placeholder="Your message"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="font-heading text-xl text-navy mb-3">
                  Get in Touch
                </h3>
                <p className="text-navy/70 text-sm mb-4">
                  We typically respond within 24-48 hours.
                </p>
              </div>
              <div>
                <h3 className="font-heading text-xl text-navy mb-3">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/faq"
                      className="text-navy/70 text-sm hover:text-navy transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-returns"
                      className="text-navy/70 text-sm hover:text-navy transition-colors"
                    >
                      Shipping &amp; Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-navy/70 text-sm hover:text-navy transition-colors"
                    >
                      Book a Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
