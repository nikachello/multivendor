"use client";

import { useState, useMemo, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { createOrder, initiateBogPayment, cancelPendingBogOrder } from "@/lib/actions/order";
import { validateCoupon } from "@/lib/actions/coupons";
import { trackInitiateCheckout } from "@/lib/tracking";
import { recordEvent } from "@/lib/actions/analytics";
import { useAnalyticsSession } from "@/hooks/useAnalyticsSession";
import { orderSchema } from "@/lib/validations/order";
import { GEORGIA_CITIES } from "@/lib/constants/georgia-cities";
import { useT } from "@/i18n/context";

type ShippingZone = { city_en: string; city_ka: string; rate: number };

type Props = {
  shopId: string;
  shopSlug: string;
  shopBase?: string;
  shopName: string;
  currency: string;
  defaultShippingRate: number;
  freeThreshold: number;
  shippingZones: ShippingZone[];
  hasBogPayment?: boolean;
};

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postalCode: string;
  country: string;
  notes: string;
};

const EMPTY_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "Georgia",
  notes: "",
};

export default function CheckoutForm({
  shopId,
  shopSlug,
  shopBase,
  currency,
  defaultShippingRate,
  freeThreshold,
  shippingZones,
  hasBogPayment,
}: Props) {
  const base = shopBase !== undefined ? shopBase : `/shop/${shopSlug}`;
  const t = useT();
  const couponFieldId = useId();
  const couponErrorId = useId();
  const router = useRouter();
  const { cart } = useCart(shopId);
  const sessionId = useAnalyticsSession();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bog">("cod");

  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(subtotal, currency, items.reduce((s, i) => s + i.quantity, 0));
      if (sessionId) recordEvent(shopId, "checkout", sessionId, undefined, subtotal);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shippingCost = useMemo(() => {
    if (freeThreshold > 0 && subtotal >= freeThreshold) return 0;
    const zone = shippingZones.find((z) => z.city_en === form.city);
    return zone ? zone.rate : defaultShippingRate;
  }, [form.city, subtotal, shippingZones, defaultShippingRate, freeThreshold]);

  const discount = couponApplied?.discount ?? 0;
  const total = subtotal - discount + shippingCost;

  if (items.length === 0 && !submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-neutral-500 text-sm">{t("checkout.empty_cart")}</p>
        <Link
          href={base || "/"}
          className="text-sm underline underline-offset-4 hover:text-neutral-600 transition-colors"
        >
          {t("checkout.continue_shopping")}
        </Link>
      </div>
    );
  }

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  }

  function validate(): boolean {
    const result = orderSchema.safeParse(form);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors({
      fullName: fieldErrors.fullName?.[0],
      email: fieldErrors.email?.[0],
      line1: fieldErrors.line1?.[0],
      city: fieldErrors.city?.[0],
    });
    return false;
  }

  async function handleApplyCoupon() {
    const code = couponInput.trim();
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    const result = await validateCoupon(shopId, code, subtotal);
    setCouponLoading(false);
    if (!result.ok) {
      setCouponError(result.error.message);
      return;
    }
    setCouponApplied({ code: result.data.coupon.code, discount: result.data.discount });
    setCouponInput("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    if (paymentMethod === "bog") {
      const orderResult = await createOrder(shopId, items, form, couponApplied?.code, true);
      if (!orderResult?.ok) {
        setLoading(false);
        setServerError(orderResult?.error.message ?? t("checkout.generic_error"));
        return;
      }
      const bogResult = await initiateBogPayment(shopId, orderResult.data.id);
      if (!bogResult?.ok) {
        await cancelPendingBogOrder(orderResult.data.id, shopId);
        setLoading(false);
        setServerError(t("checkout.generic_error"));
        return;
      }
      setSubmitted(true);
      window.location.href = bogResult.data.redirectUrl;
      return;
    }

    const result = await createOrder(shopId, items, form, couponApplied?.code);

    if (!result?.ok) {
      setLoading(false);
      setServerError(result?.error.message ?? t("checkout.generic_error"));
      return;
    }

    if (sessionId) recordEvent(shopId, "purchase", sessionId, undefined, result.data.total).catch(() => {});
    setSubmitted(true);
    router.push(`${base}/order/${result.data.id}`);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* ── LEFT: Form ── */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">{t("checkout.title")}</h1>

        {serverError && (
          <div role="alert" className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            {t("checkout.contact")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("checkout.full_name")} error={errors.fullName}>
              {(id) => (
                <input
                  id={id}
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="John Doe"
                  className={inputCls(!!errors.fullName)}
                />
              )}
            </Field>
            <Field label={t("checkout.email")} error={errors.email}>
              {(id) => (
                <input
                  id={id}
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputCls(!!errors.email)}
                />
              )}
            </Field>
            <Field label={t("checkout.phone")} hint={t("checkout.optional")}>
              {(id) => (
                <input
                  id={id}
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+995 555 00 00 00"
                  className={inputCls(false)}
                />
              )}
            </Field>
          </div>
        </section>

        {/* Shipping address */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            {t("checkout.shipping_address")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={t("checkout.address")} error={errors.line1} className="sm:col-span-2">
              {(id) => (
                <input
                  id={id}
                  autoComplete="address-line1"
                  value={form.line1}
                  onChange={(e) => update("line1", e.target.value)}
                  placeholder={t("checkout.address_placeholder")}
                  className={inputCls(!!errors.line1)}
                />
              )}
            </Field>
            <Field label={t("checkout.address_line2")} hint={t("checkout.optional")} className="sm:col-span-2">
              {(id) => (
                <input
                  id={id}
                  autoComplete="address-line2"
                  value={form.line2}
                  onChange={(e) => update("line2", e.target.value)}
                  placeholder={t("checkout.address_line2_placeholder")}
                  className={inputCls(false)}
                />
              )}
            </Field>
            <Field label={t("checkout.city")} error={errors.city} className="sm:col-span-2">
              {(id) => (
                <select
                  id={id}
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputCls(!!errors.city)}
                >
                  <option value="">{t("checkout.select_city")}</option>
                  {GEORGIA_CITIES.map((c) => (
                    <option key={c.name_en} value={c.name_en}>
                      {c.name_ka}
                    </option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        </section>

        {/* Delivery note */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            {t("checkout.note")}
          </h2>
          <Field label={t("checkout.delivery_note")} hint={t("checkout.optional")}>
            {(id) => (
              <textarea
                id={id}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder={t("checkout.delivery_note_placeholder")}
                rows={3}
                maxLength={500}
                className="w-full border border-neutral-200 focus:border-neutral-500 px-3 py-2.5 text-sm outline-none transition-colors bg-white resize-none"
              />
            )}
          </Field>
        </section>

        {/* Coupon */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            {t("checkout.discount_code")}
          </h2>
          {couponApplied ? (
            <div className="flex items-center justify-between rounded border border-green-200 bg-green-50 px-4 py-3 text-sm">
              <span className="text-green-700">
                <span className="font-mono font-medium">{couponApplied.code}</span>
                {" "}— {currency} {couponApplied.discount.toFixed(2)} {t("checkout.discount_off")}
              </span>
              <button
                type="button"
                onClick={() => setCouponApplied(null)}
                className="text-green-500 hover:text-green-700 transition-colors text-xs underline"
              >
                {t("checkout.remove")}
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <label htmlFor={couponFieldId} className="sr-only">{t("checkout.discount_code")}</label>
              <input
                id={couponFieldId}
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleApplyCoupon())}
                placeholder={t("checkout.enter_code")}
                aria-describedby={couponError ? couponErrorId : undefined}
                aria-invalid={!!couponError}
                className="flex-1 border border-neutral-200 focus:border-neutral-500 px-3 py-2.5 text-sm outline-none transition-colors bg-white font-mono"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="px-4 py-2.5 border border-neutral-300 text-sm text-neutral-700 hover:border-neutral-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {couponLoading ? "…" : t("checkout.apply")}
              </button>
            </div>
          )}
          {couponError && <p id={couponErrorId} role="alert" className="text-xs text-red-500 mt-1.5">{couponError}</p>}
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            {t("checkout.payment")}
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-3 border border-neutral-200 rounded px-4 py-3 cursor-pointer hover:border-neutral-400 transition-colors">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="accent-black"
              />
              <span className="text-sm text-neutral-700">{t("checkout.cash_on_delivery")}</span>
            </label>
            {hasBogPayment && (
              <label className="flex items-center gap-3 border border-neutral-200 rounded px-4 py-3 cursor-pointer hover:border-neutral-400 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="bog"
                  checked={paymentMethod === "bog"}
                  onChange={() => setPaymentMethod("bog")}
                  className="accent-black"
                />
                <span className="text-sm text-neutral-700">Bank of Georgia — Online Payment</span>
              </label>
            )}
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-sm tracking-widest uppercase bg-[#C25447] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? t("checkout.placing_order") : t("checkout.place_order")}
        </button>
      </form>

      {/* ── RIGHT: Order summary ── */}
      <aside className="lg:col-span-2">
        <div className="sticky top-6 space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
            {t("checkout.order_summary")}
          </h2>

          <ul className="divide-y divide-neutral-100">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-4">
                <div className="relative w-14 h-14 flex-shrink-0 bg-neutral-100 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-600 text-white text-[10px] flex items-center justify-center font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{item.productName}</p>
                  {Object.values(item.variantOptions).length > 0 && (
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {Object.values(item.variantOptions).join(" · ")}
                    </p>
                  )}
                </div>
                <p className="text-sm text-neutral-900 whitespace-nowrap">
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>{t("checkout.subtotal")}</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t("checkout.discount")} ({couponApplied?.code})</span>
                <span>− {currency} {discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-500">
              <span>{t("checkout.shipping")}</span>
              {shippingCost === 0 ? (
                <span className="text-green-600">{t("checkout.free")}</span>
              ) : (
                <span>{currency} {shippingCost.toFixed(2)}</span>
              )}
            </div>
            {freeThreshold > 0 && subtotal < freeThreshold && (
              <p className="text-xs text-neutral-500">
                {t("checkout.free_shipping_hint", { amount: `${currency} ${(freeThreshold - subtotal).toFixed(2)}` })}
              </p>
            )}
            <div className="flex justify-between font-semibold text-neutral-900 text-base pt-2 border-t border-neutral-100">
              <span>{t("checkout.total")}</span>
              <span>{currency} {total.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Final prices are confirmed when your order is placed.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: (id: string) => React.ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-medium text-neutral-700">{label}</label>
        {error
          ? <span role="alert" className="text-xs text-red-500">{error}</span>
          : hint && <span className="text-xs text-neutral-500">{hint}</span>
        }
      </div>
      {children(id)}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border px-3 py-2.5 text-sm outline-none transition-colors bg-white ${
    hasError
      ? "border-red-300 focus:border-red-500"
      : "border-neutral-200 focus:border-neutral-500"
  }`;
}
