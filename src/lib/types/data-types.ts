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

export type Highlight = {
  type: "image" | "text";
  title?: string;
  description?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
};

// Legacy alias — keeps old imports compiling during migration
export type Pro = Highlight;
