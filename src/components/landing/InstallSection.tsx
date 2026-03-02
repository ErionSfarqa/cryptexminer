"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import Link from "next/link";

const platforms = [
  {
    id: "windows",
    icon: "🪟",
    name: "Windows",
    version: "10 / 11",
    step1: "Complete one-time payment",
    step2: "Open Cryptex in your browser",
    step3: "Start mining instantly",
  },
  {
    id: "macos",
    icon: "🖥️",
    name: "macOS",
    version: "12+",
    step1: "Complete one-time payment",
    step2: "Open Cryptex in your browser",
    step3: "Start mining instantly",
  },
  {
    id: "android",
    icon: "🤖",
    name: "Android",
    version: "Chrome / Firefox",
    step1: "Complete one-time payment",
    step2: "Open Cryptex in your browser",
    step3: "Start mining instantly",
  },
  {
    id: "ios",
    icon: "🍎",
    name: "iOS",
    version: "Safari",
    step1: "Complete one-time payment",
    step2: "Open Cryptex in Safari",
    step3: "Start mining instantly",
  },
];

export function InstallSection() {
  return (
    <section className="section-padding bg-surface-50" id="install">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Available on <span className="text-gradient">All Devices</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Access Cryptex from any browser on any device. No downloads or installs required.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((p, idx) => (
            <ScrollReveal key={p.id}>
              <div
                className="card p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{p.icon}</div>
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-1">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-500 mb-5">{p.version}</p>

                <ol className="space-y-3 flex-1">
                  {[p.step1, p.step2, p.step3].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-none w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>

                <Link
                  href="/access"
                  className="btn-secondary mt-6 text-center"
                >
                  Get Started
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
