import type { Metadata } from "next";
import { Poppins, Lora } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Spirit Atelier — May you Find Spirit Here",
  description:
    "Handcrafted spiritual tools, divination instruments, and wellness products. Explore our collection of tarot cards, runes, journals, and more.",
  openGraph: {
    title: "The Spirit Atelier — May you Find Spirit Here",
    description:
      "Handcrafted spiritual tools, divination instruments, and wellness products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${lora.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://thespiritatelier.ca/#organization",
                  name: "The Spirit Atelier",
                  url: "https://thespiritatelier.ca",
                  logo: "https://thespiritatelier.ca/logo.png",
                  description:
                    "The Spirit Atelier is an online artisan spiritual tools brand designing ancient-reimagined divination systems, including the proprietary Whims & Whispers Tarot and handcrafted Norse rune sets for intentional practitioners.",
                  slogan: "Ritual Tools for Structured Intuition.",
                  additionalType: "https://schema.org/ReligiousGoodsStore",
                  publishingPrinciples: "https://thespiritatelier.ca/ethics",
                  knowsAbout: [
                    "Divination Systems",
                    "Marseille Tarot",
                    "Elder Futhark",
                    "Esoteric Philosophy",
                    "Astrological House Casting",
                    "Ritual Design",
                    "Tarot Structure Innovation",
                  ],
                  address: {
                    "@type": "PostalAddress",
                    addressCountry: "CA",
                  },
                  founder: {
                    "@id": "https://thespiritatelier.ca/#founder",
                  },
                  brand: {
                    "@type": "Brand",
                    name: "The Spirit Atelier",
                  },
                  sameAs: ["https://www.authorakbird.com"],
                },
                {
                  "@type": "OnlineStore",
                  "@id": "https://thespiritatelier.ca/#store",
                  name: "The Spirit Atelier Online Store",
                  url: "https://thespiritatelier.ca",
                  parentOrganization: {
                    "@id": "https://thespiritatelier.ca/#organization",
                  },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Artisan Spiritual Tools Catalog",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Whims & Whispers Tarot Deck",
                          description:
                            "A proprietary Marseille-inspired quick-read tarot structure featuring the suits Sparks, Tears, Soil, and Whispers.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Gilded Resin Norse Rune Set",
                          description:
                            "Handcrafted Elder Futhark rune set designed for advanced practitioners.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Norse Rune Casting Cloth",
                          description:
                            "Astrological house casting cloth designed to accompany Elder Futhark rune readings.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Whims & Whispers Spirit Board",
                          description:
                            "Solid walnut ritual board with high-glide finish for intuitive clarification work.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Product",
                          name: "Whims & Whispers Journal",
                          description:
                            "Structured ritual journal designed for tarot and rune integration.",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Book",
                          name: "My Intuition Made Me Do It",
                          author: {
                            "@id": "https://thespiritatelier.ca/#founder",
                          },
                        },
                      },
                    ],
                  },
                },
                {
                  "@type": "Person",
                  "@id": "https://thespiritatelier.ca/#founder",
                  name: "A. K. Bird",
                  jobTitle: [
                    "Author",
                    "Creative Director",
                    "Esoteric Researcher",
                  ],
                  description:
                    "Author and creator of proprietary divination systems and spiritual literature rooted in structured symbolism and ethical practice.",
                  url: "https://www.authorakbird.com",
                  worksFor: {
                    "@id": "https://thespiritatelier.ca/#organization",
                  },
                },
                {
                  "@type": "DefinedTermSet",
                  "@id": "https://thespiritatelier.ca/#tarot-system",
                  name: "Whims & Whispers Tarot System",
                  description:
                    "A proprietary tarot structure featuring the suits Sparks, Tears, Soil, and Whispers.",
                  creator: {
                    "@id": "https://thespiritatelier.ca/#organization",
                  },
                },
                {
                  "@type": "WebPage",
                  "@id": "https://thespiritatelier.ca/ethics#webpage",
                  url: "https://thespiritatelier.ca/ethics",
                  name: "Ethical Boundaries and Reading Consent Policy",
                  description:
                    "The Spirit Atelier's formal commitment to consent-based divination and spiritual ethics.",
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
