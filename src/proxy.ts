import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = (req.headers.get("host") ?? "").split(":")[0];
  const hasSession = req.cookies.has(SESSION_COOKIE);

  // www → non-www canonical redirect
  if (host === `www.${ROOT_DOMAIN}`) {
    const url = req.nextUrl.clone();
    url.host = ROOT_DOMAIN;
    return NextResponse.redirect(url, 301);
  }

  // Subdomain routing: slug.multistore.ge → /shop/slug/...
  if (
    host !== ROOT_DOMAIN &&
    host !== `www.${ROOT_DOMAIN}` &&
    host.endsWith(`.${ROOT_DOMAIN}`)
  ) {
    const slug = host.replace(`.${ROOT_DOMAIN}`, "");
    const url = req.nextUrl.clone();
    url.pathname = `/shop/${slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/dashboard") && !hasSession)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
