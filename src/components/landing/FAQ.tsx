"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const faqs = [
  {
    q: "What is Cryptex?",
    a: "Cryptex is a multi-platform crypto mining application that lets you mine cryptocurrency from your desktop or mobile device. It includes built-in market analytics, real-time charts, and wallet integration.",
  },
  {
    q: "Is the mining simulation real?",
    a: "The web version includes simulated mining for demonstration purposes. For actual mining, connect the app to a real mining backend or pool. The app clearly indicates when mining is simulated.",
  },
  {
    q: "Which cryptocurrencies can I mine?",
    a: "Cryptex supports mining simulation for BTC, ETH, SOL, BNB, XRP, ADA, DOGE, and DOT. The markets section tracks 500+ trading pairs via Binance.",
  },
  {
    q: "Is my payment secure?",
    a: "Yes. All payments are processed through PayPal with 256-bit SSL encryption. We never see or store your payment details. You receive an instant digital receipt.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 30-day money-back guarantee. If you're not satisfied, contact support through the chat widget for a full refund.",
  },
  {
    q: "What platforms are supported?",
    a: "Cryptex is available on Windows 10+, macOS 12+, Android 10+, and iOS 16+ (via web-based miner). Native apps are available for desktop and Android.",
  },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="section-padding bg-white" id="faq">
      <div className="container-main max-w-3xl">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Everything you need to know about Cryptex.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx}>
              <div className="border border-surface-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-surface-50 transition-colors"
                  onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  aria-expanded={openIdx === idx}
                >
                  <span className="text-sm font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-none transition-transform duration-200 ${
                      openIdx === idx ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIdx === idx ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
