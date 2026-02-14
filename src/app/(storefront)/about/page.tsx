"use client";

import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaintbrush,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import ChapterDownloadForm from "@/components/ChapterDownloadForm";

export default function AboutPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HERO */}
      <section className="bg-navy py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-5xl md:text-6xl text-white mb-3">
            About Us
          </h1>
          <p className="font-accent italic text-white/70 text-lg">
            The story behind the craft
          </p>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-4xl text-navy mb-6">
            The Origin Story
          </h2>

          <div className="space-y-6 text-navy/80 leading-relaxed">
            <p>
              The Spirit Atelier was born the night everything began to
              unravel.
            </p>

            <p>
              In the first chapter of A.K. Bird's debut roman à clef novel,
              <Link
                href="/shop/my-intuition-made-me-do-it"
                className="font-bold text-navy hover:text-blush transition-colors"
              >
                {" "}
                My Intuition Made Me Do It
              </Link>
              , she enters a room cast in red light during a shamanic journey.
              A circle of women surrounds her, passing textiles and trinkets
              between them. She is present, but not included.
            </p>

            <p>
              Slowly, quietly, she understands. She has nothing to pass.
            </p>

            <p>
              The Spirit Atelier began as a promise. A promise to create
              objects worthy of being passed from hand to hand.
            </p>

            <p>
              Tarot decks. Rune sets. Journals. Textiles. Trinkets. Each one
              crafted from the understanding that belonging is not something we
              wait for. It is something we participate in.
            </p>

            <p>
              If you would like to read the chapter where this vision first
              unfolds, you are invited to download the first chapter below.
            </p>
          </div>

          {/* DOWNLOAD BUTTON */}
          <div className="mt-10 bg-cream rounded-xl p-6">
            <h3 className="font-heading text-2xl text-navy mb-2 text-center">
              Explore the First Chapter
            </h3>
            <p className="font-accent italic text-navy/60 text-sm mb-6 text-center">
              Free download — no purchase required
            </p>
            <button
              onClick={() => setOpen(true)}
              className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
            >
              Download 'The Journey'
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal Panel */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 z-10">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-navy text-xl"
            >
              ×
            </button>

            <h3 className="font-heading text-2xl text-navy mb-2 text-center">
              Read the First Chapter
            </h3>
            <p className="font-accent italic text-navy/60 text-sm mb-6 text-center">
              Free download — no purchase required
            </p>

            <ChapterDownloadForm />
          </div>
        </div>
      )}

      {/* OUR MISSION */}
      <section className="py-20 bg-cream px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl text-navy mb-6">
            Our Mission
          </h2>

          <blockquote className="font-accent italic text-navy/80 text-xl leading-relaxed mb-12">
            &ldquo;To create tools that honor the practice they serve, tools
            that support clarity, deepen reflection, and meet you wherever you
            are on your journey.&rdquo;
          </blockquote>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon icon={faHeart} className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">
                Intentional
              </h3>
              <p className="text-navy/70 text-sm">
                Every product is designed with purpose, not spectacle.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faPaintbrush}
                  className="w-6 h-6 text-navy"
                />
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">
                Handcrafted
              </h3>
              <p className="text-navy/70 text-sm">
                Made locally with care. Each piece may vary slightly.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 bg-white rounded-full mx-auto mb-4flex items-center justify-center">
                <FontAwesomeIcon icon={faSun} className="w-6 h-6 text-navy" />
              </div>
              <h3 className="font-heading text-xl text-navy mb-2">
                Accessible
              </h3>
              <p className="text-navy/70 text-sm">
                Spiritual practice belongs to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT A.K. BIRD */}
      <section className="py-20 px-4 ">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-12 items-center bg-navy p-8 rounded-xl">
          <div className="md:col-span-2">
            <h2 className="font-heading text-4xl text-white mb-6">
              About A. K. Bird
            </h2>

            <div className="space-y-6 text-white leading-relaxed">
              <p>
                A. K. Bird writes stories about intuition, unraveling, and
                becoming.
              </p>

              <p>
                Her work explores the quiet turning points that reshape a
                woman’s life and the inner knowing that refuses to be silenced.
              </p>

              <p>
                Alongside her novels, she designs tarot decks, rune sets, and
                ritual tools through The Spirit Atelier.
              </p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end md:mt-12">
            <div className="w-[75vw] max-w-[500px] aspect-square relative">
              <svg viewBox="0 0 100 100" className="absolute w-0 h-0">
                <defs>
                  <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
                    <path
                      d="M0.5,0.9 C0.1,0.6 0,0.35 0.25,0.2 
                       C0.4,0.1 0.5,0.25 0.5,0.25 
                       C0.5,0.25 0.6,0.1 0.75,0.2 
                       C1,0.35 0.9,0.6 0.5,0.9 Z"
                    />
                  </clipPath>
                </defs>
              </svg>

              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{
                  clipPath: "url(#heartClip)",
                  objectPosition: "center 18%",
                }}
              >
                <source src="/videos/portrait-loop.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* WHY WE DO THIS */}
      <section className="py-20 px-4 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl text-navy/80 mb-6">
            Why We Do This
          </h2>

          <div className="space-y-6 text-navy/80 leading-relaxed">
            <p>Because the tools we use in our practice matter.</p>
            <p>The Spirit Atelier exists to serve your journey.</p>
          </div>

          <div className="mt-12">
            <Link
              href="/shop"
              className="inline-block px-8 py-3.5 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors text-sm tracking-wider uppercase"
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}