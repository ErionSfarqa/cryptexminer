"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeviceDetect } from "@/lib/useDeviceDetect";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";

export function Hero() {
  const { platform, label } = useDeviceDetect();
  const [showModal, setShowModal] = useState(false);

  const platformCTA: Record<string, string> = {
    ios: "Access Cryptex",
    android: "Access Cryptex",
    macos: "Access Cryptex",
    windows: "Access Cryptex",
    unknown: "Access Cryptex",
  };

  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 sm:pt-36 sm:pb-24">

      <div className="container-main section-padding pt-0 pb-0 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-brand-700 bg-brand-100 rounded-full border border-brand-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Now available on all devices
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold leading-[1.1] tracking-tight text-gray-900 mb-6">
              Mine Crypto{" "}
              <span className="text-gradient">Effortlessly</span>
              <br />
              From Any Device
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl mb-8">
              Cryptex brings professional-grade mining to everyone. Real-time market
              analytics, multi-coin support, and one-click mining — all in one
              beautifully designed app.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link href="/access" className="btn-primary text-base px-8 py-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {platformCTA[platform]}
              </Link>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-gray-500 hover:text-brand-600 transition-colors underline underline-offset-4"
              >
                View supported devices →
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-surface-200">
              <div>
                <p className="text-2xl font-heading font-bold text-gray-900">50K+</p>
                <p className="text-xs text-gray-500">Active Miners</p>
              </div>
              <div className="w-px h-10 bg-surface-200" />
              <div>
                <p className="text-2xl font-heading font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Coins Supported</p>
              </div>
              <div className="w-px h-10 bg-surface-200" />
              <div>
                <p className="text-2xl font-heading font-bold text-gray-900">99.9%</p>
                <p className="text-xs text-gray-500">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right — 3D Image */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Image
              src="/assets/cryptominer.png"
              alt="Cryptex — 3D visualization of crypto mining"
              width={800}
              height={800}
              priority
              className="animate-float w-full max-w-[520px] sm:max-w-[640px] lg:max-w-[780px] h-auto"
            />
          </div>
        </div>
      </div>

      {/* Device Picker Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Choose Your Device">
        <div className="grid grid-cols-2 gap-3 mt-2">
          {(["ios", "android", "macos", "windows"] as const).map((p) => {
            const names = { ios: "iOS", android: "Android", macos: "macOS", windows: "Windows" };
            const icons = { ios: "🍎", android: "🤖", macos: "🖥️", windows: "🪟" };
            return (
              <Link
                key={p}
                href="/access"
                className="flex flex-col items-center gap-2 p-5 rounded-xl border border-surface-200 hover:border-brand-300 hover:bg-brand-50 transition-all group"
                onClick={() => setShowModal(false)}
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{icons[p]}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-brand-700">
                  {names[p]}
                </span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </section>
  );
}
