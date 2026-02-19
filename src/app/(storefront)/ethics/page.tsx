import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const ethicsJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://thespiritatelier.ca" },
    { "@type": "ListItem", position: 2, name: "Ethics", item: "https://thespiritatelier.ca/ethics" },
  ],
};

export default function EthicsPage() {
  return (
    <>
      <JsonLd data={ethicsJsonLd} />
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">Our Ethics</h1>
          <p className="font-accent italic text-white/50 text-sm">Boundaries we hold in our practice</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8 text-sm text-navy/80 leading-relaxed">
          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Our Commitment</h2>
            <p>At The Spirit Atelier, we approach every reading and interaction with care, integrity, and deep respect for the boundaries of our practice. We believe that honest, grounded guidance serves you far better than overreach, and we hold ourselves to that standard in every session.</p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Topics We Do Not Read</h2>
            <p className="mb-3">To honour both our ethical responsibility and your wellbeing, we do not provide readings on the following topics:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Fertility</li>
              <li>Mortality</li>
              <li>Mediumship</li>
              <li>Major health concerns</li>
              <li>Major legal matters</li>
            </ul>
            <p className="mt-3">If your question falls within one of these areas, we will gently redirect the reading or respectfully decline.</p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Professional Disclaimer</h2>
            <p>The Spirit Atelier is not operated by a trained psychological practitioner, licensed counsellor, or medical professional. All readings and guidance offered through our services are spiritual in nature and should not be treated as a substitute for professional medical, legal, or psychological advice.</p>
          </div>

          <div>
            <h2 className="font-heading text-2xl text-navy mb-3">Your Discernment</h2>
            <p>All guidance provided through our readings is offered at the discretion and discernment of those being read. We encourage you to use your own judgement, trust your intuition, and seek appropriate professional support when needed. Our role is to offer perspective &mdash; what you do with it is always yours to decide.</p>
          </div>

          <div className="pt-4 text-center">
            <p className="mb-4">If you have questions about our practice or would like to learn more about what we offer, we welcome you to reach out.</p>
            <div className="flex justify-center gap-4">
              <Link
                href="/services"
                className="inline-block px-6 py-2.5 bg-navy text-white text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-navy/90 transition-colors"
              >
                View Services
              </Link>
              <Link
                href="/contact"
                className="inline-block px-6 py-2.5 border border-navy text-navy text-sm font-semibold tracking-wider uppercase rounded-xl hover:bg-navy/5 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
