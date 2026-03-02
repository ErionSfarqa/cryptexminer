import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptexminer.com"),
  title: "Cryptex — Next-Gen Crypto Mining, Simplified",
  description:
    "Mine cryptocurrency effortlessly with Cryptex. Access from any browser on iOS, Android, macOS & Windows. Real-time market data, secure wallet integration, and intuitive mining controls.",
  keywords: [
    "crypto mining",
    "cryptocurrency",
    "bitcoin miner",
    "ethereum",
    "mining software",
    "cryptex",
  ],
  openGraph: {
    title: "Cryptex — Next-Gen Crypto Mining",
    description:
      "Mine cryptocurrency effortlessly. Available on all devices.",
    type: "website",
    url: "https://cryptexminer.com",
    images: [{ url: "/assets/cryptominer.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cryptex — Next-Gen Crypto Mining",
    description: "Mine cryptocurrency effortlessly. Available on all devices.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  other: {
    "theme-color": "#1b6ef5",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased">
        {children}

        {/* PayPal SDK — loaded once globally for hosted buttons */}
        <Script
          id="paypal-sdk"
          src="https://www.paypal.com/sdk/js?client-id=BAAG_G8uU08NOfUAHgVcL7RAHk5Bts9tXMeSYGjLm1AffxSQQ7obn7yrj8MLAA6J1iUFeAUvw38iPKQoiU&components=hosted-buttons&disable-funding=venmo&currency=USD"
          strategy="afterInteractive"
        />

        {/* OpenWidget Contact Support — appears on all pages, dedup + z-index fix */}
        <Script id="openwidget-config" strategy="afterInteractive">
          {`
            if(!window.__ow_loaded){
              window.__ow_loaded=true;
              window.__ow = window.__ow || {};
              window.__ow.organizationId = "f1af25cc-2461-4eb3-89e0-b73f253aeaf5";
              window.__ow.integration_name = "manual_settings";
              window.__ow.product_name = "openwidget";
              ;(function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[OpenWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.openwidget.com/openwidget.js",t.head.appendChild(n)}};!n.__ow.asyncInit&&e.init(),n.OpenWidget=n.OpenWidget||e}(window,document,[].slice))
            }
          `}
        </Script>
        <noscript>
          You need to{" "}
          <a
            href="https://www.openwidget.com/enable-javascript"
            rel="noopener nofollow"
          >
            enable JavaScript
          </a>{" "}
          to use the communication tool powered by{" "}
          <a
            href="https://www.openwidget.com/"
            rel="noopener nofollow"
            target="_blank"
          >
            OpenWidget
          </a>
        </noscript>
      </body>
    </html>
  );
}
