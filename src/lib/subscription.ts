export function isProShop(subscriptionPaidUntil: Date | null | undefined): boolean {
  if (!subscriptionPaidUntil) return false;
  return new Date(subscriptionPaidUntil) > new Date();
}

export const FREE_PRODUCT_LIMIT = 5;
export const FREE_TESTIMONIAL_LIMIT = 5;
export const FREE_THEME = "minimal";
