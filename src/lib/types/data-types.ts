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

export type Pro = {
  type: "image" | "pro";
  title?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
};
