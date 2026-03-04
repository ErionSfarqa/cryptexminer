import { NextResponse } from "next/server";
import { PURCHASE_COOKIE, cookieOptions } from "../shared";
import { signCookie } from "@/lib/auth";

/**
 * POST /api/access/confirm
 *
 * Grants access after the user completes PayPal payment.
 * Sets an HMAC-signed httpOnly cookie so access cannot be forged via DevTools.
 */
export async function POST() {
  try {
    const signedValue = await signCookie();

    const res = NextResponse.json({
      purchased: true,
      message: "Access granted.",
    });

    res.cookies.set(PURCHASE_COOKIE, signedValue, cookieOptions);

    return res;
  } catch {
    return NextResponse.json(
      { purchased: false, error: "Could not grant access. Please try again." },
      { status: 500 },
    );
  }
}

