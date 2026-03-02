import { NextRequest, NextResponse } from "next/server";
import { PURCHASE_COOKIE } from "../shared";

/**
 * POST /api/access/clear
 * Clears the purchase cookie (for dev/testing or support resets).
 */
export async function POST() {
  const res = NextResponse.json({ purchased: false, message: "Cookie cleared." });
  res.cookies.set(PURCHASE_COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
  });
  return res;
}
