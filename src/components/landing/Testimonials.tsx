"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

const testimonials = [
  {
    name: "Alex K.",
    role: "Crypto Trader",
    text: "Cryptex made mining accessible to me. The UI is incredible and the real-time market data helps me make better decisions.",
    avatar: "AK",
  },
  {
    name: "Sarah M.",
    role: "Software Developer",
    text: "I've tried many mining solutions. Cryptex stands out with its clean design, cross-platform support, and professional charts.",
    avatar: "SM",
  },
  {
    name: "James L.",
    role: "DeFi Enthusiast",
    text: "The wallet integration is seamless. Love that I can mine, track markets, and manage my portfolio all in one place.",
    avatar: "JL",
  },
];

export function Testimonials() {
  return (
    <section className="section-padding bg-surface-50">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
              Trusted by <span className="text-gradient">Miners Worldwide</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of crypto enthusiasts using Cryptex daily.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <ScrollReveal key={t.name}>
              <div
                className="card p-6 h-full flex flex-col"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed flex-1 mb-6">&ldquo;{t.text}&rdquo;</p>

                <div className="flex items-center gap-3 border-t border-surface-200 pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
