"use client";

import Link from "next/link";
import { CryptexLogo } from "@/components/ui/Logo";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-surface-200/50"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-main px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <CryptexLogo className="h-8 w-8" />
            <span className="font-heading text-lg font-bold tracking-tight text-gray-900">
              Cryptex
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#crypto-sea" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Markets
            </Link>
            <Link href="/#install" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Get Started
            </Link>
            <Link href="/#support" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </Link>
            <Link href="/#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </Link>
            <Link href="/legal" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Legal
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/access" className="btn-primary text-sm px-5 py-2.5">
              Get Access
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 -mr-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-surface-200 bg-white py-4 space-y-1 animate-fade-in">
            {[
              { href: "/#crypto-sea", label: "Markets" },
              { href: "/#install", label: "Get Started" },
              { href: "/#support", label: "Support" },
              { href: "/#faq", label: "FAQ" },
              { href: "/legal", label: "Legal" },
              { href: "/access", label: "Get Access" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-surface-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
