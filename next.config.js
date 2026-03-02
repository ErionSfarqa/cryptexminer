/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // wagmi v3 connectors import optional peer dependencies at the module level
    // (@coinbase/wallet-sdk, @metamask/sdk). These packages are NOT installed
    // because the project only uses injected + WalletConnect connectors.
    //
    // Previously these were handled with `config.externals.push(...)` which
    // marks them as runtime require() calls. This causes two problems:
    //   1. The packages don't exist → runtime crash if the code path is hit.
    //   2. It shifts server-side chunk boundaries non-deterministically,
    //      which on Windows causes stale chunk files (e.g. "./9276.js")
    //      due to file-locking during HMR.
    //
    // Fix: resolve them to `false` (webpack 5 empty-module alias).
    // This stubs them out at build time with no runtime side effects and
    // keeps the chunk graph stable across HMR cycles.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@coinbase/wallet-sdk": false,
      "@metamask/sdk": false,
    };
    return config;
  },
};

module.exports = nextConfig;
