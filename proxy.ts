import { type NextRequest, NextResponse } from "next/server";

/** The resume classifier is a standalone app; legacy chatbot pages need no guest account. */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/ping" || pathname.startsWith("/ping/")) {
    return new Response("pong", { status: 200 });
  }

  // Let a stale template client safely learn there is no session instead of
  // parsing the classifier page's redirect as a JSON session response.
  if (pathname === "/api/auth/session") {
    return NextResponse.json(null);
  }

  // Send stale template links to the classifier instead of trying to create a
  // database-backed guest user in the unused chatbot flow.
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/login", "/register", "/chat/:path*", "/api/auth/:path*"],
};
