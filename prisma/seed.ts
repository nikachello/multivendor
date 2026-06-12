import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  console.log("Cleaning up...");

  // Delete in dependency order (children before parents)
  await prisma.variantOptionValue.deleteMany();
  await prisma.productOptionType.deleteMany();
  await prisma.shopSection.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.optionValue.deleteMany();
  await prisma.optionType.deleteMany();
  await prisma.category.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding...");

  // ── USER ──────────────────────────────────────────────────────────────────
  const owner = await prisma.user.create({
    data: {
      email: "nika@niko-watches.com",
      name: "Nika",
      role: "seller",
      emailVerified: true,
    },
  });

  // ── SHOP ──────────────────────────────────────────────────────────────────
  const shop = await prisma.shop.create({
    data: {
      ownerId: owner.id,
      name: "Niko Watches",
      slug: "niko-watches",
      description: "Premium watches for modern lifestyle",
      currency: "USD",
      isActive: true,
    },
  });

  // ── OPTION TYPES (shop-level, reusable across products) ───────────────────
  const colorType = await prisma.optionType.create({
    data: { shopId: shop.id, name: "Color" },
  });
  const sizeType = await prisma.optionType.create({
    data: { shopId: shop.id, name: "Size" },
  });

  // ── OPTION VALUES ─────────────────────────────────────────────────────────
  const [black, silver, gold, white, roseGold, red, forestGreen, slateGrey] =
    await Promise.all([
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Black" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Silver" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Gold" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "White" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Rose Gold" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Red" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Forest Green" } }),
      prisma.optionValue.create({ data: { optionTypeId: colorType.id, value: "Slate Grey" } }),
    ]);

  const [size38, size42, size44, size45] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: sizeType.id, value: "38mm" } }),
    prisma.optionValue.create({ data: { optionTypeId: sizeType.id, value: "42mm" } }),
    prisma.optionValue.create({ data: { optionTypeId: sizeType.id, value: "44mm" } }),
    prisma.optionValue.create({ data: { optionTypeId: sizeType.id, value: "45mm" } }),
  ]);

  // ── CATEGORIES ────────────────────────────────────────────────────────────
  const luxuryCat = await prisma.category.create({
    data: {
      shopId: shop.id,
      name: "Luxury Watches",
      slug: "luxury-watches",
      description: "Premium collection",
      image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=600",
      isActive: true,
    },
  });

  const sportCat = await prisma.category.create({
    data: {
      shopId: shop.id,
      name: "Sport Watches",
      slug: "sport-watches",
      description: "Active lifestyle watches",
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600",
      isActive: true,
    },
  });

  // ── PRODUCTS ──────────────────────────────────────────────────────────────

  // P1: Royal Classic Watch
  const p1 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categoryId: luxuryCat.id,
      name: "Royal Classic Watch",
      slug: "royal-classic-watch",
      description:
        "An elegantly crafted timepiece with a steel case and sapphire crystal glass. Built to last, designed to impress.",
      priceFrom: 199,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600", sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1533139143976-30918502365b?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.productOptionType.createMany({
    data: [
      { productId: p1.id, optionTypeId: colorType.id, position: 0 },
      { productId: p1.id, optionTypeId: sizeType.id, position: 1 },
    ],
  });

  const [v1, v2, v3] = await Promise.all([
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-BLK-42", price: 199, stock: 5 } }),
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-SLV-42", price: 209, stock: 3 } }),
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-GLD-44", price: 249, stock: 2 } }),
  ]);

  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v1.id, optionValueId: black.id },
      { variantId: v1.id, optionValueId: size42.id },
      { variantId: v2.id, optionValueId: silver.id },
      { variantId: v2.id, optionValueId: size42.id },
      { variantId: v3.id, optionValueId: gold.id },
      { variantId: v3.id, optionValueId: size44.id },
    ],
  });

  // P2: Crystal Pearl Watch
  const p2 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categoryId: luxuryCat.id,
      name: "Crystal Pearl Watch",
      slug: "crystal-pearl-watch",
      description:
        "A refined luxury watch featuring a mother-of-pearl dial and premium leather strap. Timeless femininity meets precision engineering.",
      priceFrom: 289,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=600", sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.productOptionType.createMany({
    data: [
      { productId: p2.id, optionTypeId: colorType.id, position: 0 },
      { productId: p2.id, optionTypeId: sizeType.id, position: 1 },
    ],
  });

  const [v4, v5] = await Promise.all([
    prisma.variant.create({ data: { productId: p2.id, sku: "CP-WHT-38", price: 289, stock: 4 } }),
    prisma.variant.create({ data: { productId: p2.id, sku: "CP-ROS-38", price: 319, stock: 2 } }),
  ]);

  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v4.id, optionValueId: white.id },
      { variantId: v4.id, optionValueId: size38.id },
      { variantId: v5.id, optionValueId: roseGold.id },
      { variantId: v5.id, optionValueId: size38.id },
    ],
  });

  // P3: Sport Pro Watch
  const p3 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categoryId: sportCat.id,
      name: "Sport Pro Watch",
      slug: "sport-pro-watch",
      description:
        "Lightweight and durable, built for high-performance athletes. Water-resistant up to 100m with a built-in stopwatch.",
      priceFrom: 99,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600", sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.productOptionType.create({
    data: { productId: p3.id, optionTypeId: colorType.id, position: 0 },
  });

  const [v6, v7] = await Promise.all([
    prisma.variant.create({ data: { productId: p3.id, sku: "SP-BLK-42", price: 99, stock: 10 } }),
    prisma.variant.create({ data: { productId: p3.id, sku: "SP-RED-42", price: 99, stock: 7 } }),
  ]);

  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v6.id, optionValueId: black.id },
      { variantId: v7.id, optionValueId: red.id },
    ],
  });

  // P4: Trail Runner Watch
  const p4 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categoryId: sportCat.id,
      name: "Trail Runner Watch",
      slug: "trail-runner-watch",
      description:
        "Designed for the outdoors. GPS-ready casing, scratch-resistant glass, and an adjustable silicone strap for any terrain.",
      priceFrom: 129,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600", sortOrder: 0 },
          { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  await prisma.productOptionType.create({
    data: { productId: p4.id, optionTypeId: colorType.id, position: 0 },
  });

  const [v8, v9] = await Promise.all([
    prisma.variant.create({ data: { productId: p4.id, sku: "TR-GRN-45", price: 129, stock: 8 } }),
    prisma.variant.create({ data: { productId: p4.id, sku: "TR-GRY-45", price: 129, stock: 5 } }),
  ]);

  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v8.id, optionValueId: forestGreen.id },
      { variantId: v9.id, optionValueId: slateGrey.id },
    ],
  });

  // ── SHOP SECTIONS ─────────────────────────────────────────────────────────
  await prisma.shopSection.createMany({
    data: [
      {
        shopId: shop.id,
        type: "announcement",
        order: 0,
        props: { text: "Free shipping on orders over $50 🚚", bgColor: "#F5D7C7", textColor: "#000000" },
      },
      {
        shopId: shop.id,
        type: "navbar",
        order: 1,
        props: {
          items: [
            { id: "n1", type: "link", label: "Home", href: "/" },
            {
              id: "n2",
              type: "group",
              label: "Shop",
              children: [
                { id: "n3", type: "link", label: "Luxury Watches", href: "/collections/luxury-watches" },
                { id: "n4", type: "link", label: "Sport Watches", href: "/collections/sport-watches" },
              ],
            },
            { id: "n5", type: "link", label: "About", href: "/about" },
          ],
        },
      },
      {
        shopId: shop.id,
        type: "banner",
        order: 2,
        props: {
          title: "Timeless Craftsmanship",
          subtitle: "Discover our premium watch collection",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600",
          buttonText: "Shop Now",
          href: "/collections/luxury-watches",
        },
      },
      {
        shopId: shop.id,
        type: "categories",
        order: 3,
        props: { title: "Shop by Category", categoryIds: [], columns: 2 },
      },
      {
        shopId: shop.id,
        type: "collection",
        order: 4,
        props: { categoryId: luxuryCat.id },
      },
      {
        shopId: shop.id,
        type: "highlights",
        order: 5,
        props: {
          items: [
            {
              type: "text",
              title: "Free Shipping",
              description: "On all orders over $50. Fast, reliable delivery worldwide.",
            },
            {
              type: "image",
              imageUrl: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600",
            },
            {
              type: "text",
              title: "2-Year Warranty",
              description: "Every watch is covered by our comprehensive 2-year warranty.",
              buttonText: "Learn more",
              buttonUrl: "/warranty",
            },
          ],
        },
      },
      {
        shopId: shop.id,
        type: "testimonials",
        order: 6,
        props: {
          testimonials: [
            { name: "გიორგი მელაძე", position: "თბილისი", rating: 5, testimony: "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით. პროდუქტიც ზუსტად ისეთი იყო, როგორიც ფოტოებში ჩანდა." },
            { name: "ნინო კაპანაძე", position: "ონლაინ მყიდველი", rating: 4, testimony: "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი. აუცილებლად ისევ შევიძენ." },
            { name: "ლუკა ჯაფარიძე", position: "ბათუმი", rating: 5, testimony: "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე და პროდუქტი დროულად მივიღე." },
            { name: "თამარ აბაშიძე", position: "კოსმეტოლოგი", rating: 5, testimony: "პროდუქტის ხარისხმა მოლოდინს გადააჭარბა. ნამდვილად იგრძნობა ყურადღება დეტალების მიმართ." },
            { name: "სანდრო ბერიძე", position: "მომხმარებელი", rating: 4, testimony: "ფასი და ხარისხი იდეალურად არის დაბალანსებული. მხარდაჭერის გუნდმაც ძალიან სწრაფად მიპასუხა." },
          ],
        },
      },
      {
        shopId: shop.id,
        type: "collection",
        order: 7,
        props: { categoryId: sportCat.id },
      },
    ],
  });

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { shopId: shop.id, name: "გიორგი მელაძე", position: "თბილისი", rating: 5, testimony: "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით. პროდუქტიც ზუსტად ისეთი იყო, როგორიც ფოტოებში ჩანდა." },
      { shopId: shop.id, name: "ნინო კაპანაძე", position: "ონლაინ მყიდველი", rating: 4, testimony: "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი. აუცილებლად ისევ შევიძენ." },
      { shopId: shop.id, name: "ლუკა ჯაფარიძე", position: "ბათუმი", rating: 5, testimony: "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე და პროდუქტი დროულად მივიღე." },
      { shopId: shop.id, name: "თამარ აბაშიძე", position: "კოსმეტოლოგი", rating: 5, testimony: "პროდუქტის ხარისხმა მოლოდინს გადააჭარბა. ნამდვილად იგრძნობა ყურადღება დეტალების მიმართ." },
      { shopId: shop.id, name: "სანდრო ბერიძე", position: "მომხმარებელი", rating: 4, testimony: "ფასი და ხარისხი იდეალურად არის დაბალანსებული. მხარდაჭერის გუნდმაც ძალიან სწრაფად მიპასუხა." },
    ],
  });

  console.log(`✓ Shop: ${shop.name} (${shop.slug})`);
  console.log(`✓ Categories: Luxury Watches, Sport Watches`);
  console.log(`✓ Products: 4 (Royal Classic, Crystal Pearl, Sport Pro, Trail Runner)`);
  console.log(`✓ Variants: 9 total`);
  console.log(`✓ Sections: 8`);
  console.log(`✓ Testimonials: 5`);
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
