/**
 * HMAC-based cookie signing & verification.
 *
 * Uses Web Crypto API (crypto.subtle) so it works in BOTH:
 *  - Node.js route handlers (Node 18+)
 *  - Edge Runtime (Next.js middleware)
 *
 * Cookie value format:  token:timestamp:hmacHex
 *
 * This prevents:
 *  - Cookie forgery (need COOKIE_SECRET to produce valid HMAC)
 *  - DevTools "set cookie to true" bypass
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
 * Sign a cookie value: returns "token:timestamp:hmacHex".
 * If no token is provided, a random hex string is generated.
 */
export async function signCookie(token?: string): Promise<string> {
  const id = token || crypto.randomUUID().replace(/-/g, "");
  const timestamp = Date.now().toString();
  const payload = `${id}:${timestamp}`;
  const sig = await hmac(getSecret(), payload);
  return `${payload}:${sig}`;
}

/**
 * Verify a signed cookie value.
 * Returns { valid } if the HMAC matches.
 */
export async function verifyCookie(
  value: string,
): Promise<{ valid: boolean; txnId?: string }> {
  if (!value || typeof value !== "string") return { valid: false };

  const parts = value.split(":");
  if (parts.length !== 3) return { valid: false };

  const [token, timestamp, providedSig] = parts;
  if (!token || !timestamp || !providedSig) return { valid: false };

  const payload = `${token}:${timestamp}`;
  const expectedSig = await hmac(getSecret(), payload);

  // Length check first (avoids leaking length via timing)
  if (expectedSig.length !== providedSig.length) return { valid: false };

  // Constant-time-ish comparison (sufficient for server-side HMAC)
  let mismatch = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    mismatch |= expectedSig.charCodeAt(i) ^ providedSig.charCodeAt(i);
  }

  return mismatch === 0 ? { valid: true, txnId: token } : { valid: false };
}
