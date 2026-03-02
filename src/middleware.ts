import { NextRequest, NextResponse } from "next/server";
import { verifyCookie } from "@/lib/auth";

const PURCHASE_COOKIE = "cryptex_purchased";

/**
 * Middleware: protects /app/* routes with HMAC-signed cookie verification.
 *
 * The cookie value is "txnId:timestamp:hmacHex" — it cannot be forged
 * by setting document.cookie or using DevTools. The HMAC requires
 * COOKIE_SECRET which only the server knows.
 *
 * Unpurchased or tampered cookie → redirect to /access.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /app/* routes
  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const cookieValue = request.cookies.get(PURCHASE_COOKIE)?.value;

  if (!cookieValue) {
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    return NextResponse.redirect(url);
  }

  // Verify HMAC signature — tampered cookies are rejected
  const { valid } = await verifyCookie(cookieValue);

  if (!valid) {
    // Clear the invalid/tampered cookie and redirect
    const url = request.nextUrl.clone();
    url.pathname = "/access";
    const res = NextResponse.redirect(url);
    res.cookies.set(PURCHASE_COOKIE, "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
