type TrackItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

function fbq(...args: unknown[]) {
  if (typeof window !== "undefined" && window.fbq) window.fbq(...args);
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) window.gtag(...args);
}

export function trackViewContent(item: TrackItem, currency: string) {
  fbq("track", "ViewContent", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price,
    currency,
  });
  gtag("event", "view_item", {
    currency,
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, price: item.price }],
  });
}

export function trackAddToCart(item: TrackItem, currency: string) {
  fbq("track", "AddToCart", {
    content_ids: [item.id],
    content_name: item.name,
    content_type: "product",
    value: item.price * (item.quantity ?? 1),
    currency,
    quantity: item.quantity ?? 1,
  });
  gtag("event", "add_to_cart", {
    currency,
    value: item.price * (item.quantity ?? 1),
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity ?? 1 }],
  });
}

export function trackInitiateCheckout(value: number, currency: string, numItems: number) {
  fbq("track", "InitiateCheckout", { value, currency, num_items: numItems });
  gtag("event", "begin_checkout", { currency, value });
}

export function trackPurchase(orderId: string, value: number, currency: string, items: TrackItem[]) {
  fbq("track", "Purchase", {
    value,
    currency,
    content_ids: items.map((i) => i.id),
    num_items: items.reduce((sum, i) => sum + (i.quantity ?? 1), 0),
    order_id: orderId,
  });
  gtag("event", "purchase", {
    transaction_id: orderId,
    value,
    currency,
    items: items.map((i) => ({
      item_id: i.id,
      item_name: i.name,
      price: i.price,
      quantity: i.quantity ?? 1,
    })),
  });
}

// conversionTarget = "AW-XXXXXXXXX/CONVERSION_LABEL"
export function trackGoogleAdsConversion(conversionTarget: string, value: number, currency: string, orderId: string) {
  gtag("event", "conversion", {
    send_to: conversionTarget,
    value,
    currency,
    transaction_id: orderId,
  });
}
