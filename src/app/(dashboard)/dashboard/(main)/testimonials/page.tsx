import { getShop } from "@/lib/auth/get-shop";
import { getTestimonialsByShop } from "@/lib/db/queries";
import { getProductsByShop } from "@/lib/db/queries";
import TestimonialsClient from "./TestimonialsClient";

export default async function TestimonialsPage() {
  const shop = await getShop();

  const [testimonialsResult, productsResult] = await Promise.all([
    getTestimonialsByShop(shop.id),
    getProductsByShop(shop.id),
  ]);

  const testimonials = testimonialsResult.ok ? testimonialsResult.data : [];
  const products = productsResult.ok
    ? productsResult.data.map((p) => ({ id: p.id, name: p.name }))
    : [];

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-400 mt-0.5">{testimonials.length} total</p>
        </div>
      </div>
      <TestimonialsClient
        testimonials={testimonials}
        products={products}
        shopId={shop.id}
      />
    </div>
  );
}
