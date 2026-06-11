import {
  Shop,
  Product,
  Category,
  Variant,
  Pro,
  ShopTestimonial,
} from "@/lib/types/data-types";
import { NavItem } from "@/lib/types/sections";

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

const variants_p1: Variant[] = [
  {
    id: "v1",
    productId: "p1",
    sku: "NW-BLK-42",
    price: 199,
    stock: 5,
    image: "/watch-black.jpg",
    options: { Color: "Black", Size: "42mm" },
  },
  {
    id: "v2",
    productId: "p1",
    sku: "NW-SLV-42",
    price: 209,
    stock: 3,
    image: "/watch-silver.jpg",
    options: { Color: "Silver", Size: "42mm" },
  },
  {
    id: "v3",
    productId: "p1",
    sku: "NW-GLD-44",
    price: 249,
    stock: 2,
    image: "/watch-gold.jpg",
    options: { Color: "Gold", Size: "44mm" },
  },
];

const variants_p2: Variant[] = [
  {
    id: "v4",
    productId: "p2",
    sku: "CP-WHT-38",
    price: 289,
    stock: 4,
    image: "/watch-white.jpg",
    options: { Color: "White", Size: "38mm" },
  },
  {
    id: "v5",
    productId: "p2",
    sku: "CP-ROS-38",
    price: 319,
    stock: 2,
    image: "/watch-rose.jpg",
    options: { Color: "Rose Gold", Size: "38mm" },
  },
];

const variants_p3: Variant[] = [
  {
    id: "v6",
    productId: "p3",
    sku: "SP-BLK-42",
    price: 99,
    stock: 10,
    image: "/sport-black.jpg",
    options: { Color: "Black" },
  },
  {
    id: "v7",
    productId: "p3",
    sku: "SP-RED-42",
    price: 99,
    stock: 7,
    image: "/sport-red.jpg",
    options: { Color: "Red" },
  },
];

const variants_p4: Variant[] = [
  {
    id: "v8",
    productId: "p4",
    sku: "TR-GRN-45",
    price: 129,
    stock: 8,
    image: "/trail-green.jpg",
    options: { Color: "Forest Green" },
  },
  {
    id: "v9",
    productId: "p4",
    sku: "TR-GRY-45",
    price: 129,
    stock: 5,
    image: "/trail-grey.jpg",
    options: { Color: "Slate Grey" },
  },
];

export const products: Product[] = [
  {
    id: "p1",
    shopId: "shop_1",
    categoryId: "cat_1",
    name: "Royal Classic Watch",
    description:
      "An elegantly crafted timepiece with a steel case and sapphire crystal glass. Built to last, designed to impress.",
    images: ["/watch1.jpg", "/watch2.jpg"],
    isActive: true,
    priceFrom: 199,
    createdAt: new Date(),
    variants: variants_p1,
  },
  {
    id: "p2",
    shopId: "shop_1",
    categoryId: "cat_1",
    name: "Crystal Pearl Watch",
    description:
      "A refined luxury watch featuring a mother-of-pearl dial and premium leather strap. Timeless femininity meets precision engineering.",
    images: ["/watch3.jpg", "/watch4.jpg"],
    isActive: true,
    priceFrom: 289,
    createdAt: new Date(),
    variants: variants_p2,
  },
  {
    id: "p3",
    shopId: "shop_1",
    categoryId: "cat_2",
    name: "Sport Pro Watch",
    description:
      "Lightweight and durable, built for high-performance athletes. Water-resistant up to 100m with a built-in stopwatch.",
    images: ["/sport1.jpg", "/sport2.jpg"],
    isActive: true,
    priceFrom: 99,
    createdAt: new Date(),
    variants: variants_p3,
  },
  {
    id: "p4",
    shopId: "shop_1",
    categoryId: "cat_2",
    name: "Trail Runner Watch",
    description:
      "Designed for the outdoors. GPS-ready casing, scratch-resistant glass, and an adjustable silicone strap for any terrain.",
    images: ["/trail1.jpg", "/trail2.jpg"],
    isActive: true,
    priceFrom: 129,
    createdAt: new Date(),
    variants: variants_p4,
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
    rating: 5,
    testimony:
      "ძალიან კმაყოფილი დავრჩი ხარისხით და მიწოდების სისწრაფით. პროდუქტიც ზუსტად ისეთი იყო, როგორიც ფოტოებში ჩანდა.",
  },
  {
    name: "ნინო კაპანაძე",
    position: "ონლაინ მყიდველი",
    rating: 4,
    testimony:
      "შეფუთვა პრემიუმ ხარისხის იყო და მომსახურებაც ძალიან ყურადღებიანი. აუცილებლად ისევ შევიძენ.",
  },
  {
    name: "ლუკა ჯაფარიძე",
    position: "ბათუმი",
    rating: 5,
    testimony:
      "საიტი ძალიან მოსახერხებელია, შეკვეთაც მარტივად გავაკეთე და პროდუქტი დროულად მივიღე.",
  },
  {
    name: "თამარ აბაშიძე",
    position: "კოსმეტოლოგი",
    rating: 5,
    testimony:
      "პროდუქტის ხარისხმა მოლოდინს გადააჭარბა. ნამდვილად იგრძნობა ყურადღება დეტალების მიმართ.",
  },
  {
    name: "სანდრო ბერიძე",
    position: "მომხმარებელი",
    rating: 4,
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
        label: "Luxury Watches",
        href: "/collections/luxury-watches",
      },
      {
        id: "4",
        type: "link",
        label: "Sport Watches",
        href: "/collections/sport-watches",
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
