"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { PayPalHostedButton } from "@/components/PayPalHostedButton";
import { usePaywall } from "@/lib/usePaywall";

export function BuySection() {
  const { isPaid, isLoading, confirmPayment } = usePaywall();
  const [txnId, setTxnId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    setError("");
    if (!txnId.trim()) {
      setError("Please enter your PayPal transaction ID.");
      return;
    }

    setVerifying(true);
    const result = await confirmPayment(txnId.trim());
    setVerifying(false);

    if (result.ok) {
      router.push("/app/mine");
    } else {
      setError(result.error || "Verification failed. Please check your transaction ID.");
    }
  };

  return (
    <section className="section-padding bg-white" id="buy">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-xs font-medium text-brand-700 bg-brand-100 rounded-full border border-brand-200">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              One-Time Purchase
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
              Buy <span className="text-gradient">Cryptex Access</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Unlock the full mining suite with a single payment.
              No subscriptions, no hidden fees.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — features */}
          <ScrollReveal>
            <div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 mb-4">
                Unlock Full Access
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                A one-time payment is all it takes. Instantly unlock the Cryptex
                miner, market analytics, and wallet tools — forever.
              </p>

              <div className="space-y-5">
                {[
                  {
                    title: "Secure payment via PayPal",
                    desc: "Industry-leading buyer protection on every transaction.",
                  },
                  {
                    title: "Instant access after payment",
                    desc: "No waiting — start mining immediately after checkout.",
                  },
                  {
                    title: "No subscriptions",
                    desc: "Pay once, use forever. No recurring charges ever.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-none w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3.5 h-3.5 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Right — PayPal hosted button + verification */}
          <ScrollReveal>
            <div className="card p-6 sm:p-8 bg-white shadow-lg rounded-2xl">
              {/* Already paid — show access granted */}
              {isPaid && !isLoading && (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-heading font-bold text-gray-900">Access Granted</h4>
                  <p className="text-sm text-gray-500">You already have full access to Cryptex.</p>
                  <button
                    onClick={() => router.push("/app/mine")}
                    className="btn-primary w-full"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    Open Cryptex
                  </button>
                </div>
              )}

              {/* Loading state */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
                </div>
              )}

              {/* Not paid — show PayPal button + verification form */}
              {!isPaid && !isLoading && (
                <>
                  <h4 className="text-lg font-heading font-bold text-gray-900 mb-1">
                    Cryptex Miner — Lifetime License
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">
                    One-time payment &bull; Instant access
                  </p>

                  {/* PayPal hosted button */}
                  <PayPalHostedButton hostedButtonId="W7EWEEYZDF9KN" />

                  {/* Transaction ID verification form */}
                  <div className="border-t border-surface-200 pt-5 mt-5">
                    <p className="text-xs text-gray-500 mb-3">
                      After completing your PayPal payment, enter your transaction ID
                      from the PayPal confirmation email to unlock access.
                    </p>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={txnId}
                        onChange={(e) => { setTxnId(e.target.value); setError(""); }}
                        placeholder="e.g. 5TY05013RG002845M"
                        className="w-full px-4 py-3 text-sm border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
                        aria-label="PayPal Transaction ID"
                      />

                      {error && (
                        <p className="text-sm text-red-600">{error}</p>
                      )}

                      <button
                        onClick={handleVerify}
                        disabled={verifying || !txnId.trim()}
                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Verify payment and access Cryptex"
                      >
                        {verifying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Verifying…
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verify &amp; Access Cryptex
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Secure payment powered by PayPal. 30-day money-back guarantee.
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

