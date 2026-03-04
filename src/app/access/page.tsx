"use client";

import { useCallback, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PayPalHostedButton } from "@/components/PayPalHostedButton";
import { usePaywall } from "@/lib/usePaywall";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AccessContent() {
  const { isPaid, isLoading, confirmPayment } = usePaywall();
  const router = useRouter();
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState("");

  /** Called automatically by the PayPal SDK after successful payment */
  const handlePaymentApproved = useCallback(async () => {
    setError("");
    setActivating(true);
    const result = await confirmPayment();
    if (result.ok) {
      router.push("/app/mine");
    } else {
      setActivating(false);
      setError(result.error || "Could not activate access. Please refresh and try again.");
    }
  }, [confirmPayment, router]);

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen bg-gradient-to-b from-surface-50 to-white">
        <div className="container-main px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-3">
                Access Cryptex
              </h1>
              <p className="text-gray-600 text-lg">
                Complete your purchase to unlock Cryptex instantly.
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="card p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Activating overlay — shown between PayPal approval and redirect */}
            {activating && (
              <div className="card p-8 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
                <p className="text-sm text-gray-600">Activating your license…</p>
              </div>
            )}

            {/* Payment card — visible when not yet purchased */}
            {!isPaid && !isLoading && !activating && (
              <div className="card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-surface-200">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">
                      Cryptex Miner — Lifetime License
                    </h2>
                    <p className="text-sm text-gray-500">One-time payment • Instant access</p>
                  </div>
                </div>

                {/* PayPal Button — onApprove fires automatically after successful payment */}
                <div>
                  <PayPalHostedButton
                    hostedButtonId="W7EWEEYZDF9KN"
                    onApprove={handlePaymentApproved}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 mt-4">{error}</p>
                )}

                <p className="text-xs text-gray-400 text-center mt-4">
                  Secure payment powered by PayPal. 30-day money-back guarantee.
                </p>
              </div>
            )}

            {/* License active badge — visible once purchased */}
            {isPaid && !isLoading && (
              <div className="card p-6 sm:p-8 border-emerald-200 bg-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-heading font-bold text-gray-900">License Active</h2>
                    <p className="text-sm text-gray-600">You have full access to Cryptex.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Web app access — visible once purchased */}
            {isPaid && !isLoading && (
              <div className="card p-6 sm:p-8 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-gray-900">Enter Cryptex</p>
                    <p className="text-sm text-gray-500">Open Cryptex directly in your browser.</p>
                  </div>
                  <Link href="/app/mine" className="btn-primary text-sm px-6 py-2.5 whitespace-nowrap">
                    Open Cryptex
                  </Link>
                </div>
              </div>
            )}

            {/* Back to home */}
            <div className="text-center pt-6">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function AccessPage() {
  return <AccessContent />;
}
