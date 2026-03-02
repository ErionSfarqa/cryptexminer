"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BuySection } from "@/components/landing/BuySection";
import { CryptoSea } from "@/components/landing/CryptoSea";
import { BitcoinInfoSections } from "@/components/landing/BitcoinInfoSections";
import { MarketSection } from "@/components/landing/MarketSection";
import { InstallSection } from "@/components/landing/InstallSection";
import { PayPalSection } from "@/components/landing/PayPalSection";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { SupportSection } from "@/components/landing/SupportSection";
import { Footer } from "@/components/landing/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export default function LandingPage() {
  return (
    <ToastProvider>
      <Navbar />
      <main>
        <Hero />
        <BuySection />
        <CryptoSea />
        <BitcoinInfoSections />
        <MarketSection />
        <InstallSection />
        <PayPalSection />
        <Testimonials />
        <SupportSection />
        <FAQ />
      </main>
      <Footer />
    </ToastProvider>
  );
}
