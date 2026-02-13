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
        {children}
      </body>
    </html>
  );
}
