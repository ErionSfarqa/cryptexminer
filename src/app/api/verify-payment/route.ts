import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/verify-payment
 *
 * Accepts a PayPal order/transaction ID and verifies it against the PayPal API.
 *
 * For production you MUST set:
 *   - PAYPAL_CLIENT_ID
 *   - PAYPAL_CLIENT_SECRET
 *   - PAYPAL_MODE ("sandbox" | "live")
 *
 * If the env vars are missing (development) the endpoint falls through to a
 * trust-based path that simply marks the payment as confirmed (same as the
 * old localStorage-only approach, but via an API call so other clients and
 * server-side checks can rely on it).
 */

const PAYPAL_MODE = process.env.PAYPAL_MODE || "sandbox";
const PAYPAL_API =
  PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.access_token ?? null;
}

interface VerifyRequest {
  orderId?: string;
  /** When true the client is self-reporting that they completed the hosted-button flow */
  selfReport?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: VerifyRequest = await request.json();

    // ── Path 1: Real PayPal verification via order ID ───────────────
    if (body.orderId) {
      const token = await getPayPalAccessToken();
      if (!token) {
        // PayPal secrets not configured — fall through to trust-based path
        return NextResponse.json({
          verified: true,
          method: "trust",
          message:
            "PayPal API credentials not configured. Payment accepted on trust. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET for real verification.",
        });
      }

      const orderRes = await fetch(`${PAYPAL_API}/v2/checkout/orders/${body.orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!orderRes.ok) {
        return NextResponse.json(
          { verified: false, error: "Invalid order ID or PayPal API error." },
          { status: 400 }
        );
      }

      const order = await orderRes.json();
      const isCompleted =
        order.status === "COMPLETED" || order.status === "APPROVED";

      return NextResponse.json({
        verified: isCompleted,
        method: "paypal_api",
        status: order.status,
        orderId: body.orderId,
      });
    }

    // ── Path 2: Self-report (hosted button — no order ID available) ─
    if (body.selfReport) {
      // In production you could log this + set a signed cookie/JWT.
      // For now we acknowledge the self-report.
      return NextResponse.json({
        verified: true,
        method: "self_report",
        message:
          "Payment confirmed via self-report. For stronger verification, switch from Hosted Buttons to the Orders API.",
      });
    }

    return NextResponse.json(
      { verified: false, error: "Provide orderId or selfReport: true." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { verified: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
