# Cryptex Miner

Next-generation crypto mining app built with Next.js 14, TypeScript, and TailwindCSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Landing Page** — Premium marketing page with live crypto tickers, TradingView charts, testimonials, FAQ
- **Payment Gate** — PayPal hosted button integration with download unlock flow
- **Mine** — Simulated multi-coin mining with session stats and persistence
- **Markets** — Real-time Binance 24hr tickers, sortable table, search, TradingView chart
- **Wallet** — Connect wallet simulation (MetaMask, WalletConnect, etc.), withdraw flow with validation
- **Responsive** — Desktop sidebar + mobile bottom nav

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Binance REST API (public endpoints)
- TradingView Widgets
- PayPal Hosted Buttons
- OpenWidget (support chat)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx         # Landing page
│   ├── download/        # Payment + download page
│   ├── app/             # Gated app shell
│   │   ├── mine/        # Mining page
│   │   ├── markets/     # Markets page
│   │   └── wallet/      # Wallet page
│   ├── legal/           # Legal disclaimers
│   └── privacy/         # Privacy policy
├── components/          # React components
│   ├── landing/         # Landing page sections
│   ├── app/             # App shell (sidebar, bottom nav)
│   └── ui/              # Shared UI (modal, toast, skeleton, logo)
└── lib/                 # Utilities
    ├── binance.ts       # Binance API client with caching
    ├── usePaywall.ts    # Payment gate hook
    ├── useDeviceDetect.ts
    └── utils.ts
```

## Deployment

Ready for Vercel/Netlify:

```bash
npm run build
npm start
```
