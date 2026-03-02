/**
 * Shared cookie configuration for the purchase gate.
 *
 * Cookie value is an HMAC-signed token: "txnId:timestamp:hmacHex"
 * so it cannot be forged by setting it in DevTools.
 *
 * Sign/verify functions live in @/lib/auth.ts (Web Crypto API —
 * works in both Node.js route handlers and Edge middleware).
 */

export const PURCHASE_COOKIE = "cryptex_purchased";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365, // 1 year
};
