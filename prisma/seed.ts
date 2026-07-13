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
  await prisma.shopSection.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.optionValue.deleteMany();
  await prisma.optionType.deleteMany();
  await prisma.product.deleteMany();
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
      categories: { connect: { id: luxuryCat.id } },
      name: "Royal Classic Watch",
      slug: "royal-classic-watch",
      description: "An elegantly crafted timepiece with a steel case and sapphire crystal glass. Built to last, designed to impress.",
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

  const p1Color = await prisma.optionType.create({ data: { productId: p1.id, name: "Color", position: 0 } });
  const p1Size  = await prisma.optionType.create({ data: { productId: p1.id, name: "Size",  position: 1 } });
  const [p1Black, p1Silver, p1Gold] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: p1Color.id, value: "Black" } }),
    prisma.optionValue.create({ data: { optionTypeId: p1Color.id, value: "Silver" } }),
    prisma.optionValue.create({ data: { optionTypeId: p1Color.id, value: "Gold" } }),
  ]);
  const [p1S42, p1S44] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: p1Size.id, value: "42mm" } }),
    prisma.optionValue.create({ data: { optionTypeId: p1Size.id, value: "44mm" } }),
  ]);

  const [v1, v2, v3] = await Promise.all([
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-BLK-42", price: 199, stock: 5 } }),
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-SLV-42", price: 209, stock: 3 } }),
    prisma.variant.create({ data: { productId: p1.id, sku: "NW-GLD-44", price: 249, stock: 2 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v1.id, optionValueId: p1Black.id }, { variantId: v1.id, optionValueId: p1S42.id },
      { variantId: v2.id, optionValueId: p1Silver.id }, { variantId: v2.id, optionValueId: p1S42.id },
      { variantId: v3.id, optionValueId: p1Gold.id },  { variantId: v3.id, optionValueId: p1S44.id },
    ],
  });

  // P2: Crystal Pearl Watch
  const p2 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categories: { connect: { id: luxuryCat.id } },
      name: "Crystal Pearl Watch",
      slug: "crystal-pearl-watch",
      description: "A refined luxury watch featuring a mother-of-pearl dial and premium leather strap.",
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

  const p2Color = await prisma.optionType.create({ data: { productId: p2.id, name: "Color", position: 0 } });
  const p2Size  = await prisma.optionType.create({ data: { productId: p2.id, name: "Size",  position: 1 } });
  const [p2White, p2RoseGold] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: p2Color.id, value: "White" } }),
    prisma.optionValue.create({ data: { optionTypeId: p2Color.id, value: "Rose Gold" } }),
  ]);
  const p2S38 = await prisma.optionValue.create({ data: { optionTypeId: p2Size.id, value: "38mm" } });

  const [v4, v5] = await Promise.all([
    prisma.variant.create({ data: { productId: p2.id, sku: "CP-WHT-38", price: 289, stock: 4 } }),
    prisma.variant.create({ data: { productId: p2.id, sku: "CP-ROS-38", price: 319, stock: 2 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v4.id, optionValueId: p2White.id },   { variantId: v4.id, optionValueId: p2S38.id },
      { variantId: v5.id, optionValueId: p2RoseGold.id }, { variantId: v5.id, optionValueId: p2S38.id },
    ],
  });

  // P3: Sport Pro Watch
  const p3 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categories: { connect: { id: sportCat.id } },
      name: "Sport Pro Watch",
      slug: "sport-pro-watch",
      description: "Lightweight and durable, built for high-performance athletes. Water-resistant up to 100m.",
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

  const p3Color = await prisma.optionType.create({ data: { productId: p3.id, name: "Color", position: 0 } });
  const [p3Black, p3Red] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: p3Color.id, value: "Black" } }),
    prisma.optionValue.create({ data: { optionTypeId: p3Color.id, value: "Red" } }),
  ]);

  const [v6, v7] = await Promise.all([
    prisma.variant.create({ data: { productId: p3.id, sku: "SP-BLK-42", price: 99, stock: 10 } }),
    prisma.variant.create({ data: { productId: p3.id, sku: "SP-RED-42", price: 99, stock: 7 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v6.id, optionValueId: p3Black.id },
      { variantId: v7.id, optionValueId: p3Red.id },
    ],
  });

  // P4: Trail Runner Watch
  const p4 = await prisma.product.create({
    data: {
      shopId: shop.id,
      categories: { connect: { id: sportCat.id } },
      name: "Trail Runner Watch",
      slug: "trail-runner-watch",
      description: "Designed for the outdoors. GPS-ready casing, scratch-resistant glass, adjustable silicone strap.",
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

  const p4Color = await prisma.optionType.create({ data: { productId: p4.id, name: "Color", position: 0 } });
  const [p4ForestGreen, p4SlateGrey] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: p4Color.id, value: "Forest Green" } }),
    prisma.optionValue.create({ data: { optionTypeId: p4Color.id, value: "Slate Grey" } }),
  ]);

  const [v8, v9] = await Promise.all([
    prisma.variant.create({ data: { productId: p4.id, sku: "TR-GRN-45", price: 129, stock: 8 } }),
    prisma.variant.create({ data: { productId: p4.id, sku: "TR-GRY-45", price: 129, stock: 5 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: v8.id, optionValueId: p4ForestGreen.id },
      { variantId: v9.id, optionValueId: p4SlateGrey.id },
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
              id: "n2", type: "group", label: "Shop",
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
        shopId: shop.id, type: "categories", order: 3,
        props: { title: "Shop by Category", categoryIds: [], columns: 2 },
      },
      { shopId: shop.id, type: "collection", order: 4, props: { categoryId: luxuryCat.id } },
      {
        shopId: shop.id, type: "highlights", order: 5,
        props: {
          items: [
            { type: "text", title: "Free Shipping", description: "On all orders over $50. Fast, reliable delivery worldwide." },
            { type: "image", imageUrl: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=600" },
            { type: "text", title: "2-Year Warranty", description: "Every watch is covered by our comprehensive 2-year warranty.", buttonText: "Learn more", buttonUrl: "/warranty" },
          ],
        },
      },
      {
        shopId: shop.id, type: "testimonials", order: 6,
        props: {
          testimonials: [
            { name: "გიორგი მელაძე", position: "თბილისი", rating: 5, testimony: "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით." },
            { name: "ნინო კაპანაძე", position: "ონლაინ მყიდველი", rating: 4, testimony: "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი." },
            { name: "ლუკა ჯაფარიძე", position: "ბათუმი", rating: 5, testimony: "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე." },
          ],
        },
      },
      { shopId: shop.id, type: "collection", order: 7, props: { categoryId: sportCat.id } },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      { shopId: shop.id, name: "გიორგი მელაძე", position: "თბილისი", rating: 5, testimony: "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით. პროდუქტიც ზუსტად ისეთი იყო, როგორიც ფოტოებში ჩანდა." },
      { shopId: shop.id, name: "ნინო კაპანაძე", position: "ონლაინ მყიდველი", rating: 4, testimony: "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი. აუცილებლად ისევ შევიძენ." },
      { shopId: shop.id, name: "ლუკა ჯაფარიძე", position: "ბათუმი", rating: 5, testimony: "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე და პროდუქტი დროულად მივიღე." },
    ],
  });

  console.log(`✓ Shop: ${shop.name} (${shop.slug})`);
  console.log(`✓ Products: 4 (Royal Classic, Crystal Pearl, Sport Pro, Trail Runner)`);

  // ══════════════════════════════════════════════════════════════════════════
  // DEMO SHOP — Zari (Georgian fashion, Maison theme)
  // ══════════════════════════════════════════════════════════════════════════

  const zariOwner = await prisma.user.create({
    data: { email: "owner@zari.ge", name: "Zari", role: "seller", emailVerified: true },
  });

  const zari = await prisma.shop.create({
    data: {
      ownerId: zariOwner.id,
      name: "Zari",
      slug: "zari",
      description: "ხელნაკეთი ქართული ფეშენ-ბრენდი. ლინენი, ტყავი, ბუნებრივი ქსოვილები.",
      currency: "GEL",
      isActive: true,
      themeId: "maison",
      shippingRate: 8,
      freeThreshold: 200,
    },
  });

  // ── Categories ────────────────────────────────────────────────────────────
  const aNewCat = await prisma.category.create({
    data: { shopId: zari.id, name: "ახალი კოლექცია", slug: "axali-kolekcia", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600", isActive: true },
  });
  const aDressCat = await prisma.category.create({
    data: { shopId: zari.id, name: "კაბები", slug: "kabebi", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", isActive: true },
  });
  const aBagCat = await prisma.category.create({
    data: { shopId: zari.id, name: "ჩანთები", slug: "chantebi", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", isActive: true },
  });
  const aJacketCat = await prisma.category.create({
    data: { shopId: zari.id, name: "ჟაკეტები", slug: "zhaketebi", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", isActive: true },
  });

  // ── P1: სელის კაბა ────────────────────────────────────────────────────────
  const ap1 = await prisma.product.create({
    data: {
      shopId: zari.id,
      categories: { connect: [{ id: aDressCat.id }, { id: aNewCat.id }] },
      name: "სელის კაბა",
      slug: "selis-kaba",
      description: "ზაფხულის კოლექციის სელის კაბა, კომფორტული ჭრით. ბუნებრივი ქსოვილი, ადვილი მოვლა.",
      priceFrom: 240,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", sortOrder: 0, isMain: true },
          { url: "https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  const ap1Size  = await prisma.optionType.create({ data: { productId: ap1.id, name: "ზომა", position: 0 } });
  const ap1Color = await prisma.optionType.create({ data: { productId: ap1.id, name: "ფერი", position: 1 } });
  const [ap1S, ap1M, ap1L] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap1Size.id, value: "S" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap1Size.id, value: "M" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap1Size.id, value: "L" } }),
  ]);
  const [ap1Natural, ap1Black, ap1Ivory] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap1Color.id, value: "ნატურალური" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap1Color.id, value: "შავი" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap1Color.id, value: "ივორი" } }),
  ]);

  const [av1, av2, av3, av4, av5, av6] = await Promise.all([
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-NAT-S", price: 240, stock: 4 } }),
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-NAT-M", price: 240, stock: 6 } }),
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-NAT-L", price: 240, stock: 3 } }),
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-BLK-S", price: 240, stock: 5 } }),
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-BLK-M", price: 240, stock: 4 } }),
    prisma.variant.create({ data: { productId: ap1.id, sku: "AA-SD-IVO-M", price: 255, stock: 2 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: av1.id, optionValueId: ap1Natural.id }, { variantId: av1.id, optionValueId: ap1S.id },
      { variantId: av2.id, optionValueId: ap1Natural.id }, { variantId: av2.id, optionValueId: ap1M.id },
      { variantId: av3.id, optionValueId: ap1Natural.id }, { variantId: av3.id, optionValueId: ap1L.id },
      { variantId: av4.id, optionValueId: ap1Black.id },   { variantId: av4.id, optionValueId: ap1S.id },
      { variantId: av5.id, optionValueId: ap1Black.id },   { variantId: av5.id, optionValueId: ap1M.id },
      { variantId: av6.id, optionValueId: ap1Ivory.id },   { variantId: av6.id, optionValueId: ap1M.id },
    ],
  });

  // ── P2: ტყავის ჩანთა ─────────────────────────────────────────────────────
  const ap2 = await prisma.product.create({
    data: {
      shopId: zari.id,
      categories: { connect: [{ id: aBagCat.id }, { id: aNewCat.id }] },
      name: "ტყავის ჩანთა",
      slug: "tyavis-chanta",
      description: "ხელით ნაკეთი ნატურალური ტყავის ჩანთა. გამძლე, სტილური, შესაფერისი ყოველდღიური გამოყენებისთვის.",
      priceFrom: 320,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", sortOrder: 0, isMain: true },
          { url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  const ap2Color = await prisma.optionType.create({ data: { productId: ap2.id, name: "ფერი", position: 0 } });
  const [ap2Natural, ap2Black, ap2Camel] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap2Color.id, value: "ნატურალური" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap2Color.id, value: "შავი" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap2Color.id, value: "კამელი" } }),
  ]);

  const [av7, av8, av9] = await Promise.all([
    prisma.variant.create({ data: { productId: ap2.id, sku: "AA-BG-NAT", price: 320, stock: 5 } }),
    prisma.variant.create({ data: { productId: ap2.id, sku: "AA-BG-BLK", price: 320, stock: 4 } }),
    prisma.variant.create({ data: { productId: ap2.id, sku: "AA-BG-CAM", price: 340, stock: 3 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: av7.id, optionValueId: ap2Natural.id },
      { variantId: av8.id, optionValueId: ap2Black.id },
      { variantId: av9.id, optionValueId: ap2Camel.id },
    ],
  });

  // ── P3: შალის ჟაკეტი ─────────────────────────────────────────────────────
  const ap3 = await prisma.product.create({
    data: {
      shopId: zari.id,
      categories: { connect: [{ id: aJacketCat.id }] },
      name: "შალის ჟაკეტი",
      slug: "shalis-zhaketi",
      description: "შემოდგომა-ზამთრის კოლექციის ჟაკეტი ბუნებრივი შალისგან. თბილი, მსუბუქი, კლასიკური ჭრა.",
      priceFrom: 180,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600", sortOrder: 0, isMain: true },
          { url: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600", sortOrder: 1 },
        ],
      },
    },
  });

  const ap3Size  = await prisma.optionType.create({ data: { productId: ap3.id, name: "ზომა", position: 0 } });
  const ap3Color = await prisma.optionType.create({ data: { productId: ap3.id, name: "ფერი", position: 1 } });
  const [ap3S, ap3M, ap3L] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap3Size.id, value: "S" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap3Size.id, value: "M" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap3Size.id, value: "L" } }),
  ]);
  const [ap3Camel, ap3Black] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap3Color.id, value: "კამელი" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap3Color.id, value: "შავი" } }),
  ]);

  const [av10, av11, av12, av13] = await Promise.all([
    prisma.variant.create({ data: { productId: ap3.id, sku: "AA-JK-CAM-S", price: 180, stock: 3 } }),
    prisma.variant.create({ data: { productId: ap3.id, sku: "AA-JK-CAM-M", price: 180, stock: 5 } }),
    prisma.variant.create({ data: { productId: ap3.id, sku: "AA-JK-BLK-M", price: 180, stock: 4 } }),
    prisma.variant.create({ data: { productId: ap3.id, sku: "AA-JK-BLK-L", price: 180, stock: 3 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: av10.id, optionValueId: ap3Camel.id }, { variantId: av10.id, optionValueId: ap3S.id },
      { variantId: av11.id, optionValueId: ap3Camel.id }, { variantId: av11.id, optionValueId: ap3M.id },
      { variantId: av12.id, optionValueId: ap3Black.id }, { variantId: av12.id, optionValueId: ap3M.id },
      { variantId: av13.id, optionValueId: ap3Black.id }, { variantId: av13.id, optionValueId: ap3L.id },
    ],
  });

  // ── P4: ლინენის კოსტუმი ──────────────────────────────────────────────────
  const ap4 = await prisma.product.create({
    data: {
      shopId: zari.id,
      categories: { connect: [{ id: aDressCat.id }] },
      name: "ლინენის კოსტუმი",
      slug: "linenis-kostumi",
      description: "ბრიუკი + პიჯაკი ბუნებრივი ლინენისგან. ზაფხულის ოფისული და თავისუფალი სტილი ერთში.",
      priceFrom: 310,
      isActive: true,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600", sortOrder: 0, isMain: true },
        ],
      },
    },
  });

  const ap4Size = await prisma.optionType.create({ data: { productId: ap4.id, name: "ზომა", position: 0 } });
  const [ap4S, ap4M, ap4L] = await Promise.all([
    prisma.optionValue.create({ data: { optionTypeId: ap4Size.id, value: "S" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap4Size.id, value: "M" } }),
    prisma.optionValue.create({ data: { optionTypeId: ap4Size.id, value: "L" } }),
  ]);

  const [av14, av15, av16] = await Promise.all([
    prisma.variant.create({ data: { productId: ap4.id, sku: "AA-LS-S", price: 310, stock: 3 } }),
    prisma.variant.create({ data: { productId: ap4.id, sku: "AA-LS-M", price: 310, stock: 4 } }),
    prisma.variant.create({ data: { productId: ap4.id, sku: "AA-LS-L", price: 310, stock: 2 } }),
  ]);
  await prisma.variantOptionValue.createMany({
    data: [
      { variantId: av14.id, optionValueId: ap4S.id },
      { variantId: av15.id, optionValueId: ap4M.id },
      { variantId: av16.id, optionValueId: ap4L.id },
    ],
  });

  // ── Sections ──────────────────────────────────────────────────────────────
  await prisma.shopSection.createMany({
    data: [
      {
        shopId: zari.id, type: "announcement", pageType: "home", order: 0,
        props: { text: "უფასო მიწოდება ₾200-დან · თბილისი · 1–2 სამუშაო დღე", bgColor: "#1f1b16", textColor: "#c9b99a" },
      },
      {
        shopId: zari.id, type: "navbar", pageType: "home", order: 1,
        props: {
          items: [
            {
              id: "an1", type: "group", label: "კოლექცია",
              children: [
                { id: "an2", type: "link", label: "ახალი კოლექცია", href: "/collections/axali-kolekcia" },
                { id: "an3", type: "link", label: "კაბები", href: "/collections/kabebi" },
                { id: "an4", type: "link", label: "ჩანთები", href: "/collections/chantebi" },
                { id: "an5", type: "link", label: "ჟაკეტები", href: "/collections/zhaketebi" },
              ],
            },
            { id: "an6", type: "link", label: "ბრენდის შესახებ", href: "/about" },
          ],
          transparent: false,
        },
      },
      {
        shopId: zari.id, type: "banner", pageType: "home", order: 2,
        props: {
          variant: "cover",
          title: "ახალი კოლექცია",
          subtitle: "ზაფხული 2026 — ბუნებრივი ქსოვილები, ხელნაკეთი ესთეტიკა",
          image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600",
          buttonText: "ნახე კოლექცია",
          href: "/collections/axali-kolekcia",
          overlay: true,
        },
      },
      {
        shopId: zari.id, type: "categories", pageType: "home", order: 3,
        props: { title: "კატეგორიები", categoryIds: [], columns: 4 },
      },
      { shopId: zari.id, type: "collection", pageType: "home", order: 4, props: { title: "პოპულარული", categoryId: null } },
      {
        shopId: zari.id, type: "highlights", pageType: "home", order: 5,
        props: {
          items: [
            { type: "text", title: "ხელნაკეთი ნაწარმი", description: "თითოეული ნაწარმი შეიქმნება ხელით, ქართული ტრადიციის გათვალისწინებით." },
            { type: "image", imageUrl: "https://images.unsplash.com/photo-1605289982774-9a6fef564df8?w=800" },
            { type: "text", title: "უფასო დაბრუნება", description: "14 დღის განმავლობაში შეგიძლია პროდუქტის დაბრუნება.", buttonText: "გაიგე მეტი", buttonUrl: "/returns" },
          ],
        },
      },
      {
        shopId: zari.id, type: "testimonials", pageType: "home", order: 6,
        props: {
          testimonials: [
            { name: "ნინო ბერიძე", position: "თბილისი", rating: 5, testimony: "სელის კაბა სრულყოფილია — ზუსტი ჭრა, ლამაზი ქსოვილი." },
            { name: "თამარ ქავთარაძე", position: "ქუთაისი", rating: 5, testimony: "ტყავის ჩანთა ყოველდღე მაქვს. ხარისხი გამოიყოფა." },
            { name: "გიორგი მაისურაძე", position: "ბათუმი", rating: 5, testimony: "შალის ჟაკეტი ბოლო ზამთარს ყოფდა. Zari-ს ნაწარმი ყველაზე ლამაზი ჩუქრია." },
          ],
        },
      },
    ],
  });

  await prisma.shopSection.createMany({
    data: [
      {
        shopId: zari.id, type: "navbar", pageType: "collection", order: 0,
        props: {
          items: [{ id: "ac1", type: "group", label: "კოლექცია", children: [{ id: "ac2", type: "link", label: "ახალი კოლექცია", href: "/collections/axali-kolekcia" }] }],
          transparent: false,
        },
      },
      {
        shopId: zari.id, type: "navbar", pageType: "product", order: 0,
        props: {
          items: [{ id: "ap1n", type: "group", label: "კოლექცია", children: [{ id: "ap2n", type: "link", label: "კაბები", href: "/collections/kabebi" }] }],
          transparent: false,
        },
      },
    ],
  });

  await prisma.testimonial.createMany({
    data: [
      { shopId: zari.id, name: "ნინო ბერიძე", position: "თბილისი", rating: 5, testimony: "სელის კაბა სრულყოფილია — ზუსტი ჭრა, ლამაზი ქსოვილი. ყველა კომპლიმენტს ვიღებ." },
      { shopId: zari.id, name: "თამარ ქავთარაძე", position: "ქუთაისი", rating: 5, testimony: "ტყავის ჩანთა ყოველდღე მაქვს. ხარისხი გამოიყოფა — ნახევარ წელიწადში ახალი ჩანს." },
      { shopId: zari.id, name: "გიორგი მაისურაძე", position: "ბათუმი", rating: 5, testimony: "შალის ჟაკეტი ბოლო ზამთარს ყოფდა. Zari-ს ნაწარმი ყველაზე ლამაზი ჩუქრია." },
    ],
  });

  console.log(`✓ Demo shop: ${zari.name} (${zari.slug})`);
  console.log("Seed complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
