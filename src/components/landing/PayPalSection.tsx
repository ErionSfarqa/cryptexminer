"use client";

import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function PayPalSection() {
  return (
    <section className="section-padding bg-white" id="payments">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Image */}
          <ScrollReveal>
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-3xl blur-2xl scale-90" />
              <Image
                src="/assets/paypal.png"
                alt="Secure payments powered by PayPal"
                width={600}
                height={600}
                className="relative drop-shadow-xl w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[600px] h-auto"
              />
            </div>
          </ScrollReveal>

          {/* Right — Copy */}
          <ScrollReveal>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-blue-700 bg-blue-100 rounded-full border border-blue-200">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Payments
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-4">
                Powered by <span className="text-[#003087]">PayPal</span>
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Your payment is protected by PayPal&apos;s industry-leading security. 
                Pay with credit card, debit card, or PayPal balance — and get a receipt 
                instantly.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Bank-grade encryption",
                    desc: "256-bit SSL encryption protects every transaction.",
                  },
                  {
                    title: "Instant confirmation",
                    desc: "Get immediate access after payment. No waiting.",
                  },
                  {
                    title: "Receipt & records",
                    desc: "Digital receipt sent to your email automatically.",
                  },
                  {
                    title: "Money-back guarantee",
                    desc: "Full refund within 30 days if you're not satisfied.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-none w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
