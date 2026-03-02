"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PayPalHostedButton } from "@/components/PayPalHostedButton";
import { usePaywall } from "@/lib/usePaywall";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

function AccessContent() {
  const { isPaid, isLoading, confirmPayment } = usePaywall();
  const { addToast } = useToast();
  const router = useRouter();
  const [txnId, setTxnId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

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
      addToast("Payment verified! Redirecting to Cryptex…", "success");
      router.push("/app/mine");
    } else {
      setError(result.error || "Verification failed.");
      addToast(result.error || "Could not verify payment.", "error");
    }
  };

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
                Purchase a license, then verify your payment to access Cryptex.
              </p>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="card p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Payment card — visible when not yet purchased */}
            {!isPaid && !isLoading && (
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

                {/* Step 1: Pay with PayPal */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">1</span>
                    Complete Payment
                  </h3>
                  <PayPalHostedButton hostedButtonId="W7EWEEYZDF9KN" />
                </div>

                {/* Step 2: Enter transaction ID */}
                <div className="border-t border-surface-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">2</span>
                    Verify Your Payment
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Enter the transaction ID from your PayPal confirmation email to unlock access.
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

            {/* Info */}
            <div className="card p-6 bg-surface-50 mt-6">
              <h3 className="font-heading font-bold text-gray-900 mb-3">How It Works</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>1.</strong> Complete your payment using the PayPal button above.</p>
                <p><strong>2.</strong> Check your email for the PayPal confirmation receipt.</p>
                <p><strong>3.</strong> Copy the transaction ID and paste it above to verify.</p>
                <p><strong>4.</strong> Access Cryptex in your browser — no install needed.</p>
              </div>
            </div>

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
  return (
    <ToastProvider>
      <AccessContent />
    </ToastProvider>
  );
}

