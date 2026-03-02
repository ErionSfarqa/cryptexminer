"use client";

import { useCallback } from "react";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function SupportSection() {
  const openChat = useCallback(() => {
    // Try OpenWidget API
    const ow = (window as any).OpenWidget;
    if (ow && typeof ow.call === "function") {
      try {
        ow.call("maximize");
        return;
      } catch { /* fall through */ }
    }
    // Fallback: scroll to bottom where the widget lives + open mailto
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    setTimeout(() => {
      // Retry once after scroll
      const ow2 = (window as any).OpenWidget;
      if (ow2 && typeof ow2.call === "function") {
        try { ow2.call("maximize"); return; } catch { /* noop */ }
      }
      window.location.href = "mailto:support@cryptexminer.com";
    }, 1200);
  }, []);

  return (
    <section className="section-padding bg-surface-50" id="support">
      <div className="container-main">
        <ScrollReveal>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT — Copy + CTA */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-brand-700 bg-brand-100 rounded-full border border-brand-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                24/7 Support
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                Need help?{" "}
                <span className="text-gradient">We&apos;re here 24/7.</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-4 max-w-lg">
                Our support team is standing by to help you with anything — from
                setup to troubleshooting. The contact form is connected directly to
                our support email so you&apos;ll always get a real response.
              </p>
              <p className="text-gray-500 text-sm mb-8 max-w-lg">
                You can also reach us at{" "}
                <a href="mailto:support@cryptexminer.com" className="text-brand-600 hover:underline font-medium">
                  support@cryptexminer.com
                </a>
              </p>

              <button
                onClick={openChat}
                className="btn-primary text-base px-8 py-4"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </button>
            </div>

            {/* RIGHT — Image */}
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/assets/customersupport.png"
                alt="Cryptex customer support — 3D visual"
                width={480}
                height={480}
                className="max-w-full h-auto"
                priority={false}
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
