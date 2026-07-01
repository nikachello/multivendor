import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "better-auth.session_token";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  const host = (req.headers.get("host") ?? "").split(":")[0];
  const pathname = url.pathname;
  const hasSession = req.cookies.has(SESSION_COOKIE);

  const isRoot = host === ROOT_DOMAIN;
  const isWWW = host === `www.${ROOT_DOMAIN}`;
  const isSubdomain =
    host.endsWith(`.${ROOT_DOMAIN}`) &&
    !isRoot &&
    !isWWW;

  // 1. WWW → root (ONLY if not already root)
  if (isWWW) {
    url.hostname = ROOT_DOMAIN;
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  // 2. Subdomain routing → /shop/:slug
  if (isSubdomain) {
    const slug = host.replace(`.${ROOT_DOMAIN}`, "");

    // prevent rewrite loop if already inside /shop/slug
    if (pathname.startsWith(`/shop/${slug}`)) {
      return NextResponse.next();
    }

    url.pathname = `/shop/${slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 3. Auth guard
  if (pathname.startsWith("/dashboard") && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|svg|ico)).*)"],
};
