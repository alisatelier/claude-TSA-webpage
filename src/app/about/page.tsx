import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">About Us</h1>
          <p className="font-accent italic text-white/70 text-lg">The story behind the craft</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl text-navy mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-navy/80 leading-relaxed">
            <p>
              The Spirit Atelier was born from a deeply personal practice — one that began quietly, in journals and candlelit rooms, with tarot cards spread across a table and questions held gently in hand.
            </p>
            <p>
              What started as a private exploration of intuition and self-reflection gradually became something more. The tools we used became extensions of our practice, and we began to wonder: what if these tools could be designed with the same intentionality we brought to using them?
            </p>
            <p>
              That question became The Spirit Atelier — a space where craft meets ceremony. Every product in our collection is created to be returned to, not displayed and forgotten. From our locally printed Whims &amp; Whispers Tarot to our handmade Norse Runes, each piece carries a deliberate design philosophy: clarity without rigidity, beauty without excess, and function rooted in practice.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-cream px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl text-navy mb-6">Our Mission</h2>
          <blockquote className="font-accent italic text-navy/80 text-xl leading-relaxed mb-12">
            &ldquo;To create tools that honor the practice they serve — tools that support clarity, deepen reflection, and meet you wherever you are on your journey.&rdquo;
          </blockquote>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">Intentional</h3>
              <p className="text-navy/70 text-sm">Every product is designed with purpose, not for spectacle but for practice.</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">Handcrafted</h3>
              <p className="text-navy/70 text-sm">Made locally with care. Each piece may vary slightly — that is the nature of handmade work.</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">Accessible</h3>
              <p className="text-navy/70 text-sm">We believe spiritual practice belongs to everyone, regardless of experience level.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl text-navy mb-6 text-center">Why We Do This</h2>
          <div className="space-y-6 text-navy/80 leading-relaxed">
            <p>
              Because we believe that the tools we use in our practice matter. Not because they hold power on their own, but because they become vessels for our intention, our attention, and our willingness to return to ourselves again and again.
            </p>
            <p>
              We create for the seeker who wants something authentic. For the practitioner who values substance over spectacle. For the curious soul who is ready to begin, even without knowing where the path leads.
            </p>
            <p>
              The Spirit Atelier exists to serve your journey — wherever it takes you.
            </p>
          </div>
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase">
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
