"use client";

import { useEffect, useState } from "react";

/**
 * PayPal Hosted Button component.
 * Embeds the PayPal snippet and provides a "Continue" button
 * that sets the server-side purchase cookie.
 *
 * PRODUCTION NOTE:
 * For production, configure PayPal IPN/webhooks to record transactions
 * server-side. The /api/access/confirm endpoint can then verify against
 * that record before issuing the cookie.
 */
export function PayPalButton({ onPaymentComplete }: { onPaymentComplete: () => void }) {
  const [rendered, setRendered] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (rendered) return;

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).paypal?.HostedButtons) {
        (window as any).paypal
          .HostedButtons({
            hostedButtonId: "W7EWEEYZDF9KN",
          })
          .render("#paypal-container-W7EWEEYZDF9KN");
        setRendered(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [rendered]);

  const handleContinue = async () => {
    setConfirming(true);
    try {
      await onPaymentComplete();
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="paypal-container-W7EWEEYZDF9KN" className="min-h-[150px]" />

      {/* Post-payment continue button */}
      <div className="border-t border-surface-200 pt-4">
        <p className="text-xs text-gray-500 mb-3">
          After completing your payment through PayPal above, click Continue to access Cryptex.
        </p>
        <button
          onClick={handleContinue}
          disabled={confirming}
          className="btn-primary w-full"
          aria-label="Continue to Cryptex after payment"
        >
          {confirming ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming…
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Continue to Cryptex
            </>
          )}
        </button>
      </div>
    </div>
  );
}
