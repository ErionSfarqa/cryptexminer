"use client";

import { useEffect, useRef, useState, useId } from "react";

interface PayPalHostedButtonProps {
  hostedButtonId: string;
}

/**
 * Reusable PayPal Hosted Button renderer.
 *
 * - Waits for window.paypal SDK (loaded globally in layout.tsx)
 * - Uses a unique container ID per instance (safe for multiple on one page)
 * - Guards against double-render with a ref
 * - Cleans up container innerHTML on unmount
 * - Shows loading spinner while waiting
 * - Shows error if SDK fails to load within timeout
 */
export function PayPalHostedButton({ hostedButtonId }: PayPalHostedButtonProps) {
  const reactId = useId();
  const containerId = `paypal-hb-${reactId.replace(/:/g, "")}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (renderedRef.current) return;

    let attempts = 0;
    const maxAttempts = 50; // 50 × 300ms = 15 seconds

    const interval = setInterval(() => {
      attempts++;

      if (
        typeof window !== "undefined" &&
        (window as any).paypal?.HostedButtons &&
        containerRef.current
      ) {
        renderedRef.current = true;
        clearInterval(interval);
        (window as any).paypal
          .HostedButtons({ hostedButtonId })
          .render(`#${containerId}`);
        setLoading(false);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        setLoading(false);
        setError(true);
      }
    }, 300);

    return () => {
      clearInterval(interval);
      // Clean up PayPal iframe on unmount so remounts work
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      renderedRef.current = false;
    };
  }, [hostedButtonId, containerId]);

  return (
    <div className="paypal-hosted-btn-wrapper relative w-full min-h-[150px]">
      {/* Always-present container for PayPal to render into */}
      <div ref={containerRef} id={containerId} className="w-full" />

      {/* Loading overlay */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-brand-500 rounded-full animate-spin" />
            <span className="text-sm">Loading PayPal…</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center max-w-xs">
            <p className="font-medium mb-1">PayPal could not be loaded</p>
            <p className="text-red-500 text-xs">
              Please refresh the page or try again later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
