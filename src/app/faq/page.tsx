"use client";

import { useState } from "react";
import { faqCategories } from "@/lib/data";

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const toggle = (id: string) => {
    setOpenItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const filtered = searchQuery
    ? faqCategories.map((cat) => ({
        ...cat,
        questions: cat.questions.filter((q) => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase())),
      })).filter((cat) => cat.questions.length > 0)
    : faqCategories;

  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">FAQ</h1>
          <p className="font-accent italic text-white/70 text-lg">Frequently asked questions</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions..." className="w-full px-5 py-3.5 border border-navy/20 rounded-lg text-navy placeholder:text-mauve focus:outline-none focus:border-navy transition-colors" />
        </div>
      </section>

      <section className="py-8 pb-20 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {filtered.map((category) => (
            <div key={category.name}>
              <h2 className="font-heading text-2xl text-navy mb-4">{category.name}</h2>
              <div className="space-y-2">
                {category.questions.map((item, i) => {
                  const id = `${category.name}-${i}`;
                  const isOpen = openItems.includes(id);
                  return (
                    <div key={id} className="border border-navy/10 rounded-lg overflow-hidden">
                      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-cream/50 transition-colors">
                        <span className="text-sm font-medium text-navy pr-4">{item.q}</span>
                        <svg className={`w-4 h-4 text-mauve flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-5 py-4 bg-cream/30 border-t border-navy/10">
                          <p className="text-sm text-navy/70 leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12"><p className="text-mauve font-accent italic">No matching questions found.</p></div>
          )}
        </div>
      </section>
    </>
  );
}
