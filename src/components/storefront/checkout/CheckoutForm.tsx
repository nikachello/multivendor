"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

type Props = {
  shopId: string;
  shopSlug: string;
  shopName: string;
  currency: string;
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
};

const EMPTY_FORM: FormData = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function CheckoutForm({ shopId, shopSlug, shopName, currency }: Props) {
  const { cart, clear } = useCart(shopId);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const items = cart?.items ?? [];
  const subtotal = cart?.total ?? 0;

  // Redirect-like empty cart message
  if (items.length === 0 && !submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-neutral-500 text-sm">Your cart is empty.</p>
        <Link
          href={`/shop/${shopSlug}`}
          className="text-sm underline underline-offset-4 hover:text-neutral-600 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  if (submitted) {
    return <OrderConfirmation shopSlug={shopSlug} shopName={shopName} name={form.fullName} />;
  }

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const required: (keyof FormData)[] = ["fullName", "email", "line1", "city", "postalCode", "country"];
    const next: Partial<FormData> = {};
    for (const key of required) {
      if (!form[key].trim()) next[key] = "Required";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Invalid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    clear();
    setSubmitted(true);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
      {/* ── LEFT: Form ── */}
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>

        {/* Contact */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            Contact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" error={errors.fullName}>
              <input
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="John Doe"
                className={inputCls(!!errors.fullName)}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="john@example.com"
                className={inputCls(!!errors.email)}
              />
            </Field>
            <Field label="Phone" hint="Optional">
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 555 000 0000"
                className={inputCls(false)}
              />
            </Field>
          </div>
        </section>

        {/* Shipping */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            Shipping address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Address" error={errors.line1} className="sm:col-span-2">
              <input
                value={form.line1}
                onChange={(e) => update("line1", e.target.value)}
                placeholder="123 Main St"
                className={inputCls(!!errors.line1)}
              />
            </Field>
            <Field label="Apartment, suite, etc." hint="Optional" className="sm:col-span-2">
              <input
                value={form.line2}
                onChange={(e) => update("line2", e.target.value)}
                placeholder="Apt 4B"
                className={inputCls(false)}
              />
            </Field>
            <Field label="City" error={errors.city}>
              <input
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="New York"
                className={inputCls(!!errors.city)}
              />
            </Field>
            <Field label="Postal code" error={errors.postalCode}>
              <input
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                placeholder="10001"
                className={inputCls(!!errors.postalCode)}
              />
            </Field>
            <Field label="Country" error={errors.country} className="sm:col-span-2">
              <input
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="United States"
                className={inputCls(!!errors.country)}
              />
            </Field>
          </div>
        </section>

        {/* Payment placeholder */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-4">
            Payment
          </h2>
          <div className="rounded border border-dashed border-neutral-200 bg-neutral-50 px-5 py-6 text-center text-sm text-neutral-400">
            Payment integration coming soon
          </div>
        </section>

        <button
          type="submit"
          className="w-full py-4 text-sm tracking-widest uppercase bg-[#C25447] text-white hover:opacity-90 transition-opacity"
        >
          Place Order
        </button>
      </form>

      {/* ── RIGHT: Order summary ── */}
      <aside className="lg:col-span-2">
        <div className="sticky top-6 space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-500">
            Order summary
          </h2>

          <ul className="divide-y divide-neutral-100">
            {items.map((item) => (
              <li key={item.variantId} className="flex gap-4 py-4">
                <div className="relative w-14 h-14 flex-shrink-0 bg-neutral-100 overflow-hidden">
                  {item.image ? (
                    <Image src={item.image} alt={item.productName} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-neutral-100" />
                  )}
                  {/* Quantity badge */}
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-neutral-600 text-white text-[10px] flex items-center justify-center font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{item.productName}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {Object.values(item.variantOptions).join(" · ")}
                  </p>
                </div>
                <p className="text-sm text-neutral-900 whitespace-nowrap">
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-semibold text-neutral-900 text-base pt-2 border-t border-neutral-100">
              <span>Total</span>
              <span>{currency} {subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ── Small reusable field wrapper ──
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
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-medium text-neutral-700">{label}</label>
        {hint && <span className="text-xs text-neutral-400">{hint}</span>}
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
      {children}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full border px-3 py-2.5 text-sm outline-none transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-500"
      : "border-neutral-200 focus:border-neutral-500"
  }`;
}

// ── Success screen ──
function OrderConfirmation({
  shopSlug,
  shopName,
  name,
}: {
  shopSlug: string;
  shopName: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center max-w-md mx-auto">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
        <svg className="w-7 h-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Order placed!</h1>
        <p className="mt-2 text-neutral-500 text-sm">
          Thank you{name ? `, ${name.split(" ")[0]}` : ""}. We{"'"}ll send a confirmation to your email shortly.
        </p>
      </div>
      <Link
        href={`/shop/${shopSlug}`}
        className="px-8 py-3 text-sm tracking-widest uppercase bg-black text-white hover:opacity-80 transition-opacity"
      >
        Continue shopping
      </Link>
    </div>
  );
}
