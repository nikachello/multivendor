import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

// Better Auth prepends __Secure- when BETTER_AUTH_URL uses https://
const SESSION_COOKIE = "__Secure-better-auth.session_token";
const SESSION_COOKIE_PLAIN = "better-auth.session_token";
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "multistore.ge";

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();

  const host = (req.headers.get("host") ?? "").split(":")[0];
  const pathname = url.pathname;
  const hasSession = req.cookies.has(SESSION_COOKIE) || req.cookies.has(SESSION_COOKIE_PLAIN);

  const isWWW = host === `www.${ROOT_DOMAIN}`;
  const isSubdomain =
    host.endsWith(`.${ROOT_DOMAIN}`) &&
    host !== ROOT_DOMAIN &&
    !isWWW;

  // Subdomain routing → /shop/:slug
  if (isSubdomain) {
    const slug = host.replace(`.${ROOT_DOMAIN}`, "");

    // prevent rewrite loop if already inside /shop/slug
    if (pathname.startsWith(`/shop/${slug}`)) {
      return NextResponse.next();
    }

    url.pathname = `/shop/${slug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // Custom domain routing — host is not on ROOT_DOMAIN at all
  const isRootDomain = host === ROOT_DOMAIN || isWWW || host.endsWith(`.${ROOT_DOMAIN}`);
  if (!isRootDomain) {
    try {
      const shop = await prisma.shop.findFirst({
        where: { customDomain: host },
        select: { slug: true },
      });
      if (shop && !pathname.startsWith(`/shop/${shop.slug}`)) {
        url.pathname = `/shop/${shop.slug}${pathname === "/" ? "" : pathname}`;
        return NextResponse.rewrite(url);
      }
    } catch {
      // DB lookup failed — fall through
    }
  }

  // Auth guard
  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) && !hasSession) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
