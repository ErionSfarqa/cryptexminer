"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Payment gate hook.
 *
 * Checks purchase state via the HMAC-signed httpOnly cookie (server-side).
 * confirmPayment() calls the server to set the access cookie after PayPal payment.
 */
export function usePaywall() {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/access/status", { credentials: "same-origin" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setIsPaid(!!data.purchased);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Network error — deny access (server is authoritative)
      }

      if (!cancelled) {
        setIsPaid(false);
        setIsLoading(false);
      }
    }

    check();
    return () => { cancelled = true; };
  }, []);

  /**
   * Confirm payment. Calls the server to set the access cookie.
   * @returns { ok: boolean, error?: string }
   */
  const confirmPayment = useCallback(async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/access/confirm", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = await res.json();

      if (data.purchased) {
        setIsPaid(true);
        return { ok: true };
      }

      return { ok: false, error: data.error || "Could not confirm access." };
    } catch {
      return { ok: false, error: "Server unreachable. Please try again." };
    }
  }, []);

  const resetPayment = useCallback(() => {
    fetch("/api/access/clear", { method: "POST", credentials: "same-origin" }).catch(() => {});
    setIsPaid(false);
  }, []);

  return { isPaid, isLoading, confirmPayment, resetPayment };
}

