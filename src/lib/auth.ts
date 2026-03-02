/**
 * HMAC-based cookie signing & verification.
 *
 * Uses Web Crypto API (crypto.subtle) so it works in BOTH:
 *  - Node.js route handlers (Node 18+)
 *  - Edge Runtime (Next.js middleware)
 *
 * Cookie value format:  txnId:timestamp:hmacHex
 *
 * This prevents:
 *  - Cookie forgery (need COOKIE_SECRET to produce valid HMAC)
 *  - DevTools "set cookie to true" bypass
 *  - Replay from a different transaction (txnId is bound)
 */

const DEV_SECRET = "cryptex-dev-secret-do-not-use-in-production";

function getSecret(): string {
  const secret = process.env.COOKIE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[auth] COOKIE_SECRET is not set! Using dev fallback — NOT SAFE FOR PRODUCTION.");
    }
    return DEV_SECRET;
  }
  return secret;
}

/** Helper: hex-encode an ArrayBuffer */
function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Import HMAC key from secret string */
async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

/**
 * Produce an HMAC-SHA256 hex signature for `data`.
 */
async function hmac(secret: string, data: string): Promise<string> {
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toHex(sig);
}

/**
 * Sign a cookie value: returns "txnId:timestamp:hmacHex".
 */
export async function signCookie(txnId: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${txnId}:${timestamp}`;
  const sig = await hmac(getSecret(), payload);
  return `${payload}:${sig}`;
}

/**
 * Verify a signed cookie value.
 * Returns { valid, txnId } if the HMAC matches.
 */
export async function verifyCookie(
  value: string,
): Promise<{ valid: boolean; txnId?: string }> {
  if (!value || typeof value !== "string") return { valid: false };

  const parts = value.split(":");
  if (parts.length !== 3) return { valid: false };

  const [txnId, timestamp, providedSig] = parts;
  if (!txnId || !timestamp || !providedSig) return { valid: false };

  const payload = `${txnId}:${timestamp}`;
  const expectedSig = await hmac(getSecret(), payload);

  // Length check first (avoids leaking length via timing)
  if (expectedSig.length !== providedSig.length) return { valid: false };

  // Constant-time-ish comparison (sufficient for server-side HMAC)
  let mismatch = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    mismatch |= expectedSig.charCodeAt(i) ^ providedSig.charCodeAt(i);
  }

  return mismatch === 0 ? { valid: true, txnId } : { valid: false };
}

/**
 * Validate that a string looks like a real PayPal transaction ID.
 *
 * PayPal transaction IDs are typically 17 uppercase alphanumeric characters
 * (e.g. "5TY05013RG002845M"), but can vary. We accept 8–30 alphanumeric
 * chars to account for different PayPal transaction/receipt ID formats.
 */
export function isValidTransactionId(txnId: string): boolean {
  return /^[A-Za-z0-9]{8,30}$/.test(txnId);
}
