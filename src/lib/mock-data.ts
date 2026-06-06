import {
  Shop,
  Product,
  Category,
  Variant,
  Pro,
  ShopTestimonial,
} from "@/lib/types/data-types";
import { NavItem } from "./types/sections";

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
    id: "p2",
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
    id: "p3",
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

export const pros: Pro[] = [
  {
    type: "pro",
    title: "1. ხარისხი",
    description:
      "ჩვენთან არის უმაღლესი ხარისხი, რომლის შეძენისას გარანტიები გექნებათ",
  },
  {
    type: "image",
    imageUrl: "/banner.jpg",
  },
  {
    type: "pro",
    title: "1. ხარისხი",
    description:
      "ჩვენთან არის უმაღლესი ხარისხი, რომლის შეძენისას გარანტიები გექნებათ",
    buttonText: "ნახეთ ყველაფერი",
    buttonUrl: "/all",
  },
];

export const shopTestimonials: ShopTestimonial[] = [
  {
    name: "გიორგი მელაძე",
    position: "თბილისი",
    testimony:
      "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით. პროდუქტიც ზუსტად ისეთი იყო, როგორიც ფოტოებში ჩანდა.",
  },
  {
    name: "ნინო კაპანაძე",
    position: "ონლაინ მყიდველი",
    testimony:
      "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი. აუცილებლად ისევ შევიძენ.",
  },
  {
    name: "ლუკა ჯაფარიძე",
    position: "ბათუმი",
    testimony:
      "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე და პროდუქტი დროულად მივიღე.",
  },
  {
    name: "თამარ აბაშიძე",
    position: "კოსმეტოლოგი",
    testimony:
      "პროდუქტის ხარისხმა მოლოდინს გადააჭარბა. ნამდვილად იგრძნობა ყურადღება დეტალების მიმართ.",
  },
  {
    name: "სანდრო ბერიძე",
    position: "მომხმარებელი",
    testimony:
      "ფასი და ხარისხი იდეალურად არის დაბალანსებული. მხარდაჭერის გუნდმაც ძალიან სწრაფად მიპასუხა.",
  },
  {
    name: "ანა დოლიძე",
    position: "ქუთაისი",
    testimony:
      "ერთ-ერთი საუკეთესო ონლაინ შოპინგ გამოცდილება რაც მქონია. ყველაფერი ძალიან პროფესიონალურად იყო გაკეთებული.",
  },
];

export const mainMenu: NavItem[] = [
  {
    id: "1",
    type: "link",
    label: "Home",
    href: "/",
  },
  {
    id: "2",
    type: "group",
    label: "Shop",
    children: [
      {
        id: "3",
        type: "link",
        label: "Watches",
        href: "/watches",
      },
      {
        id: "4",
        type: "link",
        label: "Accessories",
        href: "/accessories",
      },
    ],
  },
  {
    id: "5",
    type: "link",
    label: "About",
    href: "/about",
  },
];
