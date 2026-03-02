import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/landing/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — Cryptex",
  description: "Legal disclaimers and terms of service for Cryptex Miner.",
};

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-16 min-h-screen">
        <div className="container-main px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 mb-8">
            Legal Disclaimers
          </h1>

          <div className="prose prose-gray max-w-none space-y-8 text-sm text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Terms of Service</h2>
              <p>
                By accessing and using Cryptex (&ldquo;the Service&rdquo;), you agree to be bound by these terms.
                If you do not agree, do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Mining Disclaimer</h2>
              <p>
                Cryptex provides simulated mining functionality for demonstration purposes. Mining results, rates,
                and earnings displayed within the application are fictional and do not represent actual
                cryptocurrency mining operations unless the application is connected to a real mining backend
                or pool.
              </p>
              <p>
                Actual cryptocurrency mining involves computational resources, electricity costs, and market risks.
                Users are responsible for understanding these risks before engaging in any real mining activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Investment Disclaimer</h2>
              <p>
                Nothing in this application constitutes financial advice, investment advice, or any other form
                of professional advice. Market data displayed is provided by third-party APIs (Binance, TradingView)
                and may be delayed or inaccurate.
              </p>
              <p>
                Cryptocurrency investments carry significant risk, including the risk of total loss.
                Past performance is not indicative of future results. Always conduct your own research
                and consult with a qualified financial advisor before making investment decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Liability Limitation</h2>
              <p>
                Cryptex and its creators are not liable for any direct, indirect, incidental, consequential,
                or special damages arising from or related to your use of the Service. The Service is provided
                &ldquo;as is&rdquo; without warranties of any kind.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Payment & Refunds</h2>
              <p>
                All payments are processed through PayPal. By making a purchase, you agree to PayPal&apos;s
                Terms of Service and User Agreement. Refunds are available within 30 days of purchase.
                Contact support for refund requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-heading font-bold text-gray-900 mb-3">Contact</h2>
              <p>
                For legal inquiries or concerns, please contact us via the support chat widget or email
                at <a href="mailto:support@cryptexminer.com" className="text-brand-600 hover:underline">support@cryptexminer.com</a>.
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
