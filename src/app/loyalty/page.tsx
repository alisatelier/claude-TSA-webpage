import Link from "next/link";

export default function LoyaltyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">
            The Atelier Recognizes You
          </h1>
          <p className="font-accent italic text-white/70 text-lg max-w-2xl mx-auto">
            A Loyalty Program by The Spirit Atelier
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl text-navy mb-6">
            Our Philosophy
          </h2>
          <p className="text-navy/80 leading-relaxed text-lg">
            Returning to a practice — and to a place that supports it — deserves
            recognition. This program is our way of honoring those who walk with
            us more than once. Every purchase, review, and referral earns Ritual
            Credits — redeemable toward future tools, readings, and offerings.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl text-navy text-center mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Join */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] text-center">
              <h3 className="font-heading text-xl text-navy mb-3">Join</h3>
              <p className="text-navy/70 text-sm leading-relaxed">
                Create a free account and receive{" "}
                <span className="font-semibold text-navy">
                  50 Ritual Credits
                </span>{" "}
                as a welcome gift.
              </p>
            </div>

            {/* Earn */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] text-center">
              <h3 className="font-heading text-xl text-navy mb-5">Earn</h3>
              <ul className="text-navy/70 text-sm space-y-4 text-left">
                <li className="flex justify-between">
                  <span>Every $1 Spent</span>
                  <span className="font-semibold text-navy">1 Credit</span>
                </li>

                <li className="flex justify-between">
                  <span>Write a Review</span>
                  <span className="font-semibold text-navy">100 Credits</span>
                </li>

                <li className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <span>Birthday Recognition</span>
                    <span className="font-semibold text-navy">150 Credits</span>
                  </div>
                  <span className="text-xs text-navy/50">
                    ✨ Applied during your birthday month.
                  </span>
                </li>

                <li className="flex flex-col space-y-1">
                  <div className="flex justify-between">
                    <span>Refer a Friend</span>
                    <span className="font-semibold text-navy">200 Credits</span>
                  </div>
                  <span className="text-xs text-navy/50">
                    ✨ Your friend receives 250 Credits when they create a
                    loyalty account.
                  </span>
                  <span className="text-xs text-navy/50">
                    ✨ You earn 200 Credits when they complete their first
                    purchase.
                  </span>
                </li>
              </ul>
            </div>

            {/* Redeem */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] text-center">
              <h3 className="font-heading text-xl text-navy mb-5">Redeem</h3>
              <div className="space-y-3 text-sm text-navy/70">
                <div className="bg-cream rounded-lg py-3 px-4">
                  <span className="font-semibold text-navy">
                    250 Ritual Credits
                  </span>{" "}
                  = <span className="font-semibold text-navy">$10 Off</span>
                </div>
                <div className="bg-cream rounded-lg py-3 px-4">
                  <span className="font-semibold text-navy">
                    500 Ritual Credits
                  </span>{" "}
                  = <span className="font-semibold text-navy">$20 Off</span>
                </div>
                <p className="text-navy/60 text-xs mt-2">
                  Credits apply at checkout toward any eligible order.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Rites */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl text-navy text-center mb-12">
            Membership Rites
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Seeker */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] border border-cream">
              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl text-navy">Seeker</h3>
                <p className="text-xs text-mauve mt-1 uppercase tracking-wider">
                  0–499 Credits
                </p>
              </div>

              <ul className="space-y-2 text-sm text-navy/70">
                <li>Earn 1 Credit per $1 spent</li>
                <li>Birthday recognition</li>
                <li>Review & referral rewards</li>
              </ul>
            </div>

            {/* Keeper */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] border border-blush">
              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl text-navy">Keeper</h3>
                <p className="text-xs text-mauve mt-1 uppercase tracking-wider">
                  500+ Credits
                </p>
              </div>

              <ul className="space-y-2 text-sm text-navy/70">
                <li>All Seeker benefits</li>
                <li>24-Hour Early Access to Limited Drops</li>
                <li>Recognition in a Dedicated Instagram Story</li>
              </ul>
            </div>

            {/* Elder */}
            <div className="bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(83,91,115,0.08)] border border-navy/20">
              <div className="text-center mb-6">
                <h3 className="font-heading text-2xl text-navy">Elder</h3>
                <p className="text-xs text-mauve mt-1 uppercase tracking-wider">
                  1,500+ Credits
                </p>
              </div>

              <ul className="space-y-2 text-sm text-navy/70">
                <li>All Keeper benefits</li>
                <li>72-Hour Early Access to Limited Drops</li>
                <li>1.5× Ritual Credit Earning Rate</li>
                <li>Recognition in a Dedicated Instagram Feed Post</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl text-white mb-4">
            Begin Your Path
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Create your account and receive 50 Ritual Credits instantly. The
            Atelier is ready to recognize you.
          </p>

          <Link
            href="/account"
           className="relative inline-block px-8 py-4 w-full max-w-md mx-auto
          bg-white text-navy font-semibold rounded-xl 
            tracking-widest uppercase text-center overflow-hidden shadow-lg transition-all duration-300
            before:absolute before:inset-0 
            before:bg-[linear-gradient(110deg,transparent,rgba(212,175,55,0.12),rgba(212,175,55,0.35),rgba(212,175,55,0.12),transparent)]
            before:animate-[goldSweep_6s_linear_infinite]
            md:before:animate-none md:before:translate-x-[-150%]
            md:before:transition-transform md:before:duration-[2800ms]
            md:before:ease-[cubic-bezier(0.4,0,0.2,1)] md:hover:before:translate-x-[150%]"

          >
            ✨ Start Earning Credits ✨
          </Link>
        </div>
      </section>

      {/* Closing Quote */}
      <section className="bg-cream py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="font-accent italic text-navy/80 text-xl md:text-2xl leading-relaxed">
            “You are remembered here. You are recognized. Not for what you
            purchase — but for your continued presence.”
          </blockquote>
        </div>
      </section>

      {/* Terms */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto border-t border-cream pt-8">
          <p className="text-xs text-mauve/70 text-center leading-relaxed">
            Ritual Credits apply to subtotal before tax. Credits hold no cash
            value and cannot be transferred. The Spirit Atelier reserves the
            right to modify program terms at any time.
          </p>
        </div>
      </section>
    </>
  );
}
