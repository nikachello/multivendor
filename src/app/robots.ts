import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/shop/", disallow: ["/editor", "/api/"] },
    sitemap: "/sitemap.xml",
  };
}
