// ============================================
// USER
// ============================================
export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "seller" | "customer" | "admin";
  createdAt: Date;
};

// ============================================
// SHOP
// ============================================
export type Shop = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  banner?: string;
  customDomain?: string;
  domainVerified: boolean;
  currency: string;
  isActive: boolean;
  createdAt: Date;
};

// ============================================
// PRODUCT
// ============================================
export type Product = {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  description?: string;
  images: string[];
  isActive: boolean;
  priceFrom: number;
  createdAt: Date;
  variants: Variant[];
  category?: Category;
};

// ============================================
// CATEGORY
// ============================================
export type Category = {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
};

// ============================================
// VARIANT
// ============================================
export type Variant = {
  id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  options: Record<string, string>; // { color: "Black", size: "42" }
};

// ============================================
// CART
// ============================================
export type CartItem = {
  variantId: string;
  productId: string;
  productName: string;
  variantOptions: Record<string, string>;
  price: number;
  quantity: number;
  image?: string;
};

export type Cart = {
  shopId: string;
  items: CartItem[];
  total: number;
};

// ============================================
// ORDER
// ============================================
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  variantOptions: Record<string, string>;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  id: string;
  shopId: string;
  customerId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  total: number;
  shippingAddress: Address;
  createdAt: Date;
};

// ============================================
// ADDRESS
// ============================================
export type Address = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
};

// Widgets types

export type Pro = {
  type: "image" | "pro";
  title?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
};

export type ShopTestimonial = {
  name: string;
  testimony: string;
  position?: string;
  rating?: number;
};
