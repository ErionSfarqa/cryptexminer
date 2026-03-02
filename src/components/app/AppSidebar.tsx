"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CryptexLogo } from "@/components/ui/Logo";

const navItems = [
  {
    href: "/app/mine",
    label: "Mine",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    href: "/app/markets",
    label: "Markets",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    href: "/app/wallet",
    label: "Wallet",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-surface-200 h-screen sticky top-0" role="navigation" aria-label="App navigation">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-surface-200">
        <CryptexLogo className="h-8 w-8" />
        <span className="font-heading text-lg font-bold tracking-tight text-gray-900">
          Cryptex
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100"
                  : "text-gray-600 hover:bg-surface-50 hover:text-gray-900"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <span className={active ? "text-brand-600" : "text-gray-400"}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-surface-200">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-surface-50 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
