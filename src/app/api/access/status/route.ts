import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_COOKIE } from "../shared";
import { verifyCookie } from "@/lib/auth";

/**
 * GET /api/access/status
 *
 * Returns { purchased: true/false } after verifying the HMAC-signed cookie.
 * A forged or tampered cookie will return purchased: false.
 */
export async function GET(request: NextRequest) {
  const cookieValue = request.cookies.get(PURCHASE_COOKIE)?.value;

  if (!cookieValue) {
    return NextResponse.json({ purchased: false });
  }

  const { valid, txnId } = await verifyCookie(cookieValue);
  return NextResponse.json({ purchased: valid, txnId: valid ? txnId : undefined });
}
