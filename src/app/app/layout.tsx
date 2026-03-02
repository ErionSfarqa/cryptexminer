"use client";

import { AppSidebar } from "@/components/app/AppSidebar";
import { BottomNav } from "@/components/app/BottomNav";
import { ToastProvider } from "@/components/ui/Toast";
import { WalletProvider } from "@/components/WalletProvider";
import { usePaywall } from "@/lib/usePaywall";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

/**
 * Client-side fallback paywall gate.
 * The primary protection is in middleware.ts (cookie-based redirect).
 * This component provides a secondary check for edge cases where
 * the middleware might not fire (e.g. client-side navigation).
 */
function PaywallGate({ children }: { children: React.ReactNode }) {
  const { isPaid, isLoading } = usePaywall();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isPaid) {
      router.replace("/access");
    }
  }, [isPaid, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface-50 px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-heading font-bold text-gray-900 mb-2">
            Unlock Cryptex
          </h2>
          <p className="text-gray-600 mb-6">
            Complete payment to access the Cryptex mining app.
          </p>
          <Link href="/access" className="btn-primary w-full justify-center">
            Unlock Cryptex
          </Link>
          <Link href="/" className="block mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <ToastProvider>
        <PaywallGate>
          <div className="flex h-screen bg-surface-50">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </PaywallGate>
      </ToastProvider>
    </WalletProvider>
  );
}
