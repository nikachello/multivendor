import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default async function Proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isDashboard = pathname.startsWith("/dashboard");

  if (isAuthRoute || isDashboard) {
    const session = await auth.api.getSession({ headers: req.headers });

    if (isDashboard && !session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
