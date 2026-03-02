"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface Subsection {
  image: string;
  imageAlt: string;
  imageOnLeft: boolean;
  badge: string;
  title: string;
  highlight: string;
  paragraphs: string[];
  bullets?: string[];
}

const SUBSECTIONS: Subsection[] = [
  {
    image: "/assets/bitcoinmining.webp",
    imageAlt: "Bitcoin mining illustration — proof of work and transaction validation",
    imageOnLeft: true,
    badge: "How It Works",
    title: "Bitcoin Mining,",
    highlight: "Explained",
    paragraphs: [
      "Mining is the backbone of the Bitcoin network. Miners validate pending transactions by competing to solve a cryptographic puzzle using Proof-of-Work hashing — the first to find a valid hash wins the right to add the next block.",
    ],
    bullets: [
      "Transactions are grouped into blocks and broadcast to the network.",
      "Miners race to find a SHA-256 hash below the target difficulty.",
      "Difficulty adjusts every 2,016 blocks to maintain ~10-minute intervals.",
      "Successful miners earn block rewards plus transaction fees.",
    ],
  },
  {
    image: "/assets/bitcoinprices.png",
    imageAlt: "Bitcoin price chart showing market trends and volatility",
    imageOnLeft: false,
    badge: "Market Insight",
    title: "Understanding",
    highlight: "Bitcoin Prices",
    paragraphs: [
      "Bitcoin's price is driven by a dynamic interplay of supply, demand, and global sentiment. With a hard cap of 21 million coins and halving events every four years, scarcity is built into the protocol.",
    ],
    bullets: [
      "Supply & demand: limited supply meets growing institutional interest.",
      "Liquidity & order books: depth across exchanges determines price stability.",
      "Macro sentiment: inflation hedging, regulation, and geopolitical events move markets.",
      "Volatility creates opportunity — and risk — for traders and miners alike.",
    ],
  },
  {
    image: "/assets/bitcoinwithdraw.png",
    imageAlt: "Withdraw your available balance to your own wallet",
    imageOnLeft: true,
    badge: "Your Funds",
    title: "Withdraw Your",
    highlight: "Available Balance",
    paragraphs: [
      "When you're ready, withdraw your available balance directly to your own wallet. Cryptex processes withdrawals quickly and transparently so you always know the status of your funds.",
    ],
    bullets: [
      "Send to any external BTC, ETH, or BNB wallet address you control.",
      "Track every withdrawal in your transparent transaction history.",
      "Fast processing — most withdrawals complete within minutes.",
      "No hidden fees; network gas costs are shown upfront before you confirm.",
    ],
  },
];

export function BitcoinInfoSections() {
  return (
    <section className="bg-white">
      {SUBSECTIONS.map((sub, idx) => (
        <div
          key={idx}
          className="section-padding border-t border-surface-100 first:border-t-0"
        >
          <div className="container-main">
            <ScrollReveal>
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  sub.imageOnLeft ? "" : "lg:[direction:rtl]"
                }`}
              >
                {/* Image */}
                <div className={`flex justify-center ${sub.imageOnLeft ? "lg:justify-start" : "lg:justify-end"} ${!sub.imageOnLeft ? "lg:[direction:ltr]" : ""}`}>
                  <Image
                    src={sub.image}
                    alt={sub.imageAlt}
                    width={380}
                    height={380}
                    className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[380px] h-auto rounded-2xl"
                  />
                </div>

                {/* Text */}
                <div className={!sub.imageOnLeft ? "lg:[direction:ltr]" : ""}>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 text-xs font-medium text-brand-700 bg-brand-100 rounded-full border border-brand-200">
                    {sub.badge}
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {sub.title}{" "}
                    <span className="text-gradient">{sub.highlight}</span>
                  </h3>

                  {sub.paragraphs.map((p, pi) => (
                    <p
                      key={pi}
                      className="text-gray-600 text-lg leading-relaxed mb-4 max-w-lg"
                    >
                      {p}
                    </p>
                  ))}

                  {sub.bullets && (
                    <ul className="space-y-3 mt-4">
                      {sub.bullets.map((b, bi) => (
                        <li key={bi} className="flex items-start gap-3 text-gray-600">
                          <svg
                            className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm leading-relaxed">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      ))}
    </section>
  );
}
