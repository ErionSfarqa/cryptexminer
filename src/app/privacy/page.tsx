import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Cryptex",
  description: "Privacy policy for Cryptex Miner.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen">
        <div className="container-main px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Overview</h2>
              <p>
                At Cryptex, we respect your privacy. This policy outlines what information we collect,
                how we use it, and how we protect it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Payment information:</strong> Processed securely through PayPal. We do not
                  store credit card numbers, bank accounts, or other financial details.
                </li>
                <li>
                  <strong>Usage data:</strong> Anonymous analytics about how you use the app
                  (pages viewed, features used) to improve the experience.
                </li>
                <li>
                  <strong>Device information:</strong> Operating system and browser type to provide
                  the best download experience.
                </li>
                <li>
                  <strong>Local storage:</strong> Mining session data, wallet connections, and payment
                  status are stored locally on your device.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To process your purchase and provide access to the application.</li>
                <li>To improve the product and user experience.</li>
                <li>To provide customer support when you reach out.</li>
                <li>To prevent fraud and ensure security.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>PayPal:</strong> Payment processing. Subject to PayPal&apos;s privacy policy.</li>
                <li><strong>Binance API:</strong> Market data. No personal data is shared with Binance.</li>
                <li><strong>TradingView:</strong> Chart widgets. Subject to TradingView&apos;s terms.</li>
                <li><strong>OpenWidget:</strong> Customer support chat. Subject to OpenWidget&apos;s privacy policy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information.
                Payment processing is handled entirely by PayPal using 256-bit SSL encryption.
                Application data stored locally on your device is not transmitted to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Access your personal data.</li>
                <li>Request deletion of your data.</li>
                <li>Opt out of analytics tracking.</li>
                <li>Request a copy of your data in a portable format.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Contact</h2>
              <p>
                For privacy-related inquiries, contact us at{" "}
                <a href="mailto:privacy@cryptexminer.com" className="text-brand-600 hover:underline">
                  privacy@cryptexminer.com
                </a>{" "}
                or use the support chat widget.
              </p>
            </section>

            <p className="text-xs text-gray-400 pt-4 border-t border-surface-200">
              Last updated: March 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
