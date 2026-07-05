import { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://multistore.ge";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/shop/",
      disallow: [
        "/dashboard/",
        "/admin/",
        "/onboarding",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/api/",
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
