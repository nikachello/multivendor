import { Shop, Product, Category, Variant } from "@/lib/types";

export const shops: Shop[] = [
  {
    id: "shop_1",
    ownerId: "user_1",
    name: "Niko Watches",
    slug: "niko-watches",
    description: "Premium watches for modern lifestyle",
    logo: "/logo.png",
    banner: "/banner.jpg",
    customDomain: "nikowatches.com",
    domainVerified: true,
    currency: "USD",
    isActive: true,
    createdAt: new Date(),
  },
];

export const categories: Category[] = [
  {
    id: "cat_1",
    shopId: "shop_1",
    name: "Luxury Watches",
    slug: "luxury-watches",
    description: "Premium collection",
    image: "/cat1.jpg",
    isActive: true,
    createdAt: new Date(),
  },
  {
    id: "cat_2",
    shopId: "shop_1",
    name: "Sport Watches",
    slug: "sport-watches",
    description: "Active lifestyle watches",
    image: "/cat2.jpg",
    isActive: true,
    createdAt: new Date(),
  },
];

const variants1: Variant[] = [
  {
    id: "v1",
    productId: "p1",
    sku: "NW-BLK-42",
    price: 199,
    stock: 5,
    image: "/watch-black.jpg",
    options: { color: "Black", size: "42mm" },
  },
  {
    id: "v2",
    productId: "p1",
    sku: "NW-SLV-42",
    price: 209,
    stock: 3,
    image: "/watch-silver.jpg",
    options: { color: "Silver", size: "42mm" },
  },
];

const variants2: Variant[] = [
  {
    id: "v3",
    productId: "p2",
    sku: "SW-BLK",
    price: 99,
    stock: 10,
    image: "/sport-black.jpg",
    options: { color: "Black" },
  },
];

export const products: Product[] = [
  {
    id: "p1",
    shopId: "shop_1",
    categoryId: "cat_1",
    name: "Royal Classic Watch",
    description: "Elegant luxury watch with steel body",
    images: ["/watch1.jpg", "/watch2.jpg"],
    isActive: true,
    priceFrom: 199,
    createdAt: new Date(),
    variants: variants1,
  },
  {
    id: "p1",
    shopId: "shop_1",
    categoryId: "cat_1",
    name: "Royal Classic Watch",
    description: "Elegant luxury watch with steel body",
    images: ["/watch1.jpg", "/watch2.jpg"],
    isActive: true,
    priceFrom: 199,
    createdAt: new Date(),
    variants: variants1,
  },
  {
    id: "p2",
    shopId: "shop_1",
    categoryId: "cat_2",
    name: "Sport Pro Watch",
    description: "Durable and lightweight sports watch",
    images: ["/sport1.jpg"],
    isActive: true,
    priceFrom: 99,
    createdAt: new Date(),
    variants: variants2,
  },
];
