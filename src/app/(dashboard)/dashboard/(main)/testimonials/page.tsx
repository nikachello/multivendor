import type { Metadata } from "next";
import { getShop } from "@/lib/auth/get-shop";
import { getTestimonialsByShop, getProductsByShop } from "@/lib/db/queries";
import TestimonialsClient from "./TestimonialsClient";
import { isProShop, FREE_TESTIMONIAL_LIMIT } from "@/lib/subscription";
import { getDict } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const d = await getDict();
  return { title: d.dashboard.testimonials.title };
}

export default async function TestimonialsPage() {
  const shop = await getShop();
  const isPro = isProShop(shop.subscriptionPaidUntil);

  const [testimonialsResult, productsResult, d] = await Promise.all([
    getTestimonialsByShop(shop.id),
    getProductsByShop(shop.id),
    getDict(),
  ]);

  const testimonials = testimonialsResult.ok ? testimonialsResult.data : [];
  const products = productsResult.ok
    ? productsResult.data.data.map((p) => ({ id: p.id, name: p.name }))
    : [];

  const atLimit = !isPro && testimonials.length >= FREE_TESTIMONIAL_LIMIT;
  const t = d.dashboard.testimonials;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{testimonials.length} {t.total}</p>
        </div>
      </div>
      <TestimonialsClient
        testimonials={testimonials}
        products={products}
        shopId={shop.id}
        atLimit={atLimit}
        isPro={isPro}
        freeLimit={FREE_TESTIMONIAL_LIMIT}
      />
    </div>
  );
}
