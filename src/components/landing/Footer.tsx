import Link from "next/link";
import { CryptexLogoFull } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="container-main px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" aria-hidden="true">
                <path d="M20 2L38 20L20 38L2 20L20 2Z" fill="url(#footer-logo-grad)" />
                <path d="M20 5L35 20L20 35L5 20L20 5Z" stroke="white" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
                <text x="20" y="20" textAnchor="middle" dominantBaseline="central" fill="white" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fontSize="16" letterSpacing="-0.5">C</text>
                <defs><linearGradient id="footer-logo-grad" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#1b6ef5"/><stop offset="1" stopColor="#8b5cf6"/></linearGradient></defs>
              </svg>
              <span className="font-heading text-xl font-bold text-white">Cryptex</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Next-generation crypto mining made simple. Mine, track, and manage your
              cryptocurrency from any device.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><Link href="/access" className="text-sm hover:text-white transition-colors">Get Access</Link></li>
              <li><Link href="/app/mine" className="text-sm hover:text-white transition-colors">Mine</Link></li>
              <li><Link href="/app/markets" className="text-sm hover:text-white transition-colors">Markets</Link></li>
              <li><Link href="/app/wallet" className="text-sm hover:text-white transition-colors">Wallet</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><Link href="/legal" className="text-sm hover:text-white transition-colors">Legal</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/#faq" className="text-sm hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <p className="text-sm leading-relaxed mb-3">
              Use the chat widget in the bottom-right corner for instant support.
            </p>
            <p className="text-sm">
              Email:{" "}
              <a href="mailto:support@cryptexminer.com" className="hover:text-white transition-colors">
                support@cryptexminer.com
              </a>
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> Cryptex is a cryptocurrency mining application.
            Mining results shown in the app may be simulated unless connected to a real mining backend.
            Cryptocurrency investments carry risk. Past performance is not indicative of future results.
            Always do your own research before investing.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-800 pt-6">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Cryptex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-gray-500 bg-gray-900 rounded-md border border-gray-800">
              <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="4" />
              </svg>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
