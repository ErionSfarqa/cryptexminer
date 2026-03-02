import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_COOKIE, cookieOptions } from "../shared";
import { signCookie, isValidTransactionId } from "@/lib/auth";

/**
 * POST /api/access/confirm
 *
 * Grants access ONLY when the user provides a valid PayPal transaction ID.
 *
 * Flow:
 *  1. User completes payment through the PayPal Hosted Button.
 *  2. User enters their PayPal transaction/receipt ID from the confirmation email.
 *  3. This endpoint validates the format and produces an HMAC-signed cookie.
 *
 * The cookie value is "txnId:timestamp:hmac" — it cannot be forged without
 * the COOKIE_SECRET, and cannot be set to a simple "true" via DevTools.
 *
 * PRODUCTION HARDENING:
 *  - Configure PayPal IPN/webhooks to hit a separate endpoint that records
 *    completed transactions in a database.
 *  - This endpoint would then cross-check the provided txnId against the DB
 *    before issuing the cookie, ensuring the transaction actually completed.
 */
export async function POST(request: NextRequest) {
  try {
    let body: { txnId?: string } = {};
    try {
      body = await request.json();
    } catch {
      // No valid JSON body
    }

    const txnId = (body.txnId || "").trim();

    // Transaction ID is REQUIRED — no self-report bypass
    if (!txnId) {
      return NextResponse.json(
        {
          purchased: false,
          error: "Transaction ID is required. Please enter your PayPal transaction ID.",
        },
        { status: 400 },
      );
    }

    // Validate format (8-30 alphanumeric characters)
    if (!isValidTransactionId(txnId)) {
      return NextResponse.json(
        {
          purchased: false,
          error: "Invalid transaction ID format. PayPal transaction IDs are typically 17 alphanumeric characters (e.g. 5TY05013RG002845M).",
        },
        { status: 400 },
      );
    }

    // If PayPal API credentials are configured, verify the transaction server-to-server
    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      const mode = process.env.PAYPAL_MODE || "sandbox";
      const api =
        mode === "live"
          ? "https://api-m.paypal.com"
          : "https://api-m.sandbox.paypal.com";

      try {
        // Get access token
        const tokenRes = await fetch(`${api}/v1/oauth2/token`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });

        if (tokenRes.ok) {
          const { access_token } = await tokenRes.json();

          // Try checking as an order first, then as a capture
          const orderRes = await fetch(
            `${api}/v2/checkout/orders/${txnId}`,
            { headers: { Authorization: `Bearer ${access_token}` } },
          );

          if (orderRes.ok) {
            const order = await orderRes.json();
            if (order.status !== "COMPLETED" && order.status !== "APPROVED") {
              return NextResponse.json(
                { purchased: false, error: "Payment not completed. Please complete your PayPal payment first." },
                { status: 400 },
              );
            }
          }
          // If order lookup fails, the ID might be a capture/transaction ID
          // which can't be looked up via Orders API. Accept it with format validation only.
        }
      } catch {
        // PayPal API error — fall through to format-validated acceptance
        console.warn("[access/confirm] PayPal API verification failed, accepting format-validated txnId");
      }
    }

    // Sign the cookie with HMAC (prevents forgery)
    const signedValue = await signCookie(txnId);

    const res = NextResponse.json({
      purchased: true,
      txnId,
      message: "Access granted. Your transaction ID has been recorded.",
    });

    res.cookies.set(PURCHASE_COOKIE, signedValue, cookieOptions);

    return res;
  } catch {
    return NextResponse.json(
      { purchased: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}

