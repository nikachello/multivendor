import Banner from "@/components/storefront/Banner";
import CollectionContainer from "@/components/storefront/collection/CollectionContainer";
import ProsContainer from "@/components/storefront/widgets/pros-container/ProsContainer";
import Testimonials from "@/components/storefront/widgets/testimonials/Testimonials";
import {
  shops,
  categories,
  products,
  pros,
  shopTestimonials,
} from "@/lib/mock-data";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log(slug);

  // 1. find shop
  const shop = shops.find((s) => s.slug === slug);

  if (!shop) return <div>Shop not found</div>;

  const currency = shop.currency;

  // 2. shop data
  const shopCategories = categories.filter((c) => c.shopId === shop.id);

  const shopProducts = products.filter((p) => p.shopId === shop.id);

  // 3. pick collection (first one for now)
  const category = shopCategories[0];

  const collectionProducts = shopProducts.filter(
    (p) => p.categoryId === category.id
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        {/* <ShopInitializer shop={shop} /> */}
        <CollectionContainer
          category={category}
          products={collectionProducts}
          currency={currency}
        />
      </div>
      <Banner
        title="asdasd"
        image="/banner.jpg"
        subtitle="Discover curated products made for you"
      />
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <ProsContainer pros={pros} />
      </div>
      <Banner
        title="აწიე შოპინგის ხარისხი"
        image="/banner.jpg"
        buttonText="იშოპინგე"
        href="#"
      />
      <div>
        <Testimonials testimonials={shopTestimonials} />
      </div>
    </div>
  );
}
