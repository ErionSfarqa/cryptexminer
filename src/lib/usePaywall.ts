"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Payment gate hook.
 *
 * Checks purchase state via the HMAC-signed httpOnly cookie (server-side).
 * localStorage is NOT used — prevents client-side bypass.
 *
 * confirmPayment(txnId) requires a PayPal transaction ID.
 * The server validates the format and HMAC-signs the cookie.
 * Without a valid transaction ID, access is denied.
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
   * Confirm payment by providing a PayPal transaction ID.
   * The server validates the format and HMAC-signs the cookie.
   *
   * @param txnId REQUIRED PayPal transaction/receipt ID
   * @returns { ok: boolean, error?: string }
   */
  const confirmPayment = useCallback(async (txnId: string): Promise<{ ok: boolean; error?: string }> => {
    if (!txnId || !txnId.trim()) {
      return { ok: false, error: "Transaction ID is required." };
    }

    try {
      const res = await fetch("/api/access/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ txnId: txnId.trim() }),
      });
      const data = await res.json();

      if (data.purchased) {
        setIsPaid(true);
        return { ok: true };
      }

      return { ok: false, error: data.error || "Could not verify payment." };
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

