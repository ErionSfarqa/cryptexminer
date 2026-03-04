"use client";

import { useEffect, useState } from "react";

/**
 * Legacy PayPal Hosted Button component (deprecated).
 * Prefer PayPalHostedButton with onApprove callback instead.
 */
export function PayPalButton({ onPaymentComplete }: { onPaymentComplete: () => void }) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered) return;

    const interval = setInterval(() => {
      if (typeof window !== "undefined" && (window as any).paypal?.HostedButtons) {
        (window as any).paypal
          .HostedButtons({
            hostedButtonId: "W7EWEEYZDF9KN",
            onApprove: () => {
              onPaymentComplete();
            },
          })
          .render("#paypal-container-W7EWEEYZDF9KN");
        setRendered(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [rendered, onPaymentComplete]);

  return (
    <div className="space-y-6">
      <div id="paypal-container-W7EWEEYZDF9KN" className="min-h-[150px]" />
    </div>
  );
}
