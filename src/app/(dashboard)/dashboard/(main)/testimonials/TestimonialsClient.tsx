"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialActive,
  type TestimonialInput,
} from "@/lib/actions/testimonials";
import { useT } from "@/i18n/context";

type Testimonial = {
  id: string;
  name: string;
  position: string | null;
  testimony: string;
  rating: number | null;
  isActive: boolean;
  productId: string | null;
};

type Product = { id: string; name: string };

type Props = {
  testimonials: Testimonial[];
  products: Product[];
  shopId: string;
  atLimit: boolean;
  isPro: boolean;
  freeLimit: number;
};

const EMPTY_FORM: TestimonialInput & { id?: string } = {
  name: "",
  position: "",
  testimony: "",
  rating: 5,
  isActive: true,
  productId: null,
};

function StarRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-xl leading-none ${star <= value ? "text-yellow-400" : "text-gray-200"} hover:text-yellow-400 transition-colors`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function Stars({ value, noRating }: { value: number | null; noRating?: string }) {
  if (!value) return <span className="text-gray-300 text-xs">{noRating ?? "No rating"}</span>;
  return (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(value)}
      <span className="text-gray-200">{"★".repeat(5 - value)}</span>
    </span>
  );
}

function productName(productId: string | null, products: Product[]) {
  if (!productId) return null;
  return products.find((p) => p.id === productId)?.name ?? "Unknown product";
}

export default function TestimonialsClient({
  testimonials: initial,
  products,
  shopId,
  atLimit,
  isPro,
  freeLimit,
}: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initial);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<TestimonialInput & { id?: string }>(
    EMPTY_FORM,
  );
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const t = useT();

  const isAtLimit = !isPro && testimonials.length >= freeLimit;

  function openAdd() {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(item: Testimonial) {
    setForm({
      id: item.id,
      name: item.name,
      position: item.position ?? "",
      testimony: item.testimony,
      rating: item.rating ?? 5,
      isActive: item.isActive,
      productId: item.productId ?? null,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(EMPTY_FORM);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.testimony.trim()) {
      toast.error(t("dashboard.testimonials.required_error"));
      return;
    }
    setSaving(true);
    const input: TestimonialInput = {
      name: form.name.trim(),
      position: form.position?.trim() || undefined,
      testimony: form.testimony.trim(),
      rating: form.rating ?? undefined,
      isActive: form.isActive,
      productId: form.productId || null,
    };

    const result = form.id
      ? await updateTestimonial(shopId, form.id, input)
      : await createTestimonial(shopId, input);

    setSaving(false);
    if (!result.ok) {
      toast.error(t("dashboard.testimonials.save_failed"));
      return;
    }
    const saved = result.data;
    if (form.id) {
      setTestimonials((prev) =>
        prev.map((row) => (row.id === saved.id ? saved : row)),
      );
    } else {
      setTestimonials((prev) => [...prev, saved]);
    }
    toast.success(form.id ? t("dashboard.testimonials.updated") : t("dashboard.testimonials.added"));
    closeModal();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setDeleteId(null);
    const result = await deleteTestimonial(shopId, idToDelete);
    if (!result.ok) {
      toast.error(t("dashboard.testimonials.delete_failed"));
      return;
    }
    setTestimonials((prev) => prev.filter((row) => row.id !== idToDelete));
    toast.success(t("dashboard.testimonials.deleted"));
  }

  async function handleToggle(item: Testimonial) {
    setTogglingId(item.id);
    setTestimonials((prev) =>
      prev.map((row) =>
        row.id === item.id ? { ...row, isActive: !item.isActive } : row,
      ),
    );
    const result = await toggleTestimonialActive(shopId, item.id, !item.isActive);
    setTogglingId(null);
    if (!result.ok) {
      setTestimonials((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, isActive: item.isActive } : row,
        ),
      );
      toast.error(t("dashboard.testimonials.update_failed"));
    }
  }

  const deleteTarget = testimonials.find((t) => t.id === deleteId);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        {isAtLimit && (
          <p className="text-xs text-gray-500">
            {t("dashboard.testimonials.limit_reached").replace("{limit}", String(freeLimit))}{" "}
            <a href="/dashboard/billing" className="underline font-medium text-gray-700 hover:text-gray-900">
              {t("dashboard.testimonials.upgrade_prompt")}
            </a>
          </p>
        )}
        <div className="ml-auto">
          <button
            onClick={isAtLimit ? undefined : openAdd}
            disabled={isAtLimit}
            className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("dashboard.testimonials.add")}
          </button>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-lg py-14 text-center">
          <p className="text-sm font-medium text-gray-500">
            {t("dashboard.testimonials.no_data")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {t("dashboard.testimonials.no_data_desc")}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t("dashboard.testimonials.col_name")}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t("dashboard.testimonials.col_testimony")}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t("dashboard.testimonials.col_rating")}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t("dashboard.testimonials.col_product")}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {t("dashboard.testimonials.col_active")}
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.name}
                    </p>
                    {item.position && (
                      <p className="text-xs text-gray-400">{item.position}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.testimony}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Stars value={item.rating} noRating={t("dashboard.testimonials.no_rating")} />
                  </td>
                  <td className="px-4 py-3">
                    {item.productId ? (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {productName(item.productId, products)}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{t("dashboard.testimonials.shop_level")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggle(item)}
                      disabled={togglingId === item.id}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        item.isActive ? "bg-gray-900" : "bg-gray-200"
                      } ${togglingId === item.id ? "opacity-50" : ""}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          item.isActive ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1 rounded hover:bg-gray-100"
                      >
                        {t("dashboard.testimonials.edit")}
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                      >
                        {t("dashboard.testimonials.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col gap-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                {form.id ? t("dashboard.testimonials.modal_edit") : t("dashboard.testimonials.modal_add")}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={handleSave}
              className="px-6 py-5 flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    {t("dashboard.testimonials.label_name")}
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder={t("dashboard.testimonials.placeholder_name")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    {t("dashboard.testimonials.label_position")}
                  </label>
                  <input
                    value={form.position ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, position: e.target.value }))
                    }
                    placeholder={t("dashboard.testimonials.placeholder_position")}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {t("dashboard.testimonials.label_testimony")}
                </label>
                <textarea
                  value={form.testimony}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, testimony: e.target.value }))
                  }
                  placeholder={t("dashboard.testimonials.placeholder_testimony")}
                  rows={3}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm resize-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {t("dashboard.testimonials.label_rating")}
                </label>
                <StarRow
                  value={form.rating ?? 5}
                  onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-700">
                  {t("dashboard.testimonials.label_product")}
                </label>
                <select
                  value={form.productId ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      productId: e.target.value || null,
                    }))
                  }
                  className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 shadow-sm bg-white"
                >
                  <option value="">
                    {t("dashboard.testimonials.option_shop")}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400">
                  {t("dashboard.testimonials.hint")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({ ...f, isActive: !f.isActive }))
                  }
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    form.isActive ? "bg-gray-900" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {form.isActive ? t("dashboard.testimonials.visible") : t("dashboard.testimonials.hidden")}
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 -mx-6 px-6 mt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1.5 bg-gray-900 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                >
                  {saving
                    ? t("dashboard.testimonials.saving")
                    : form.id
                      ? t("dashboard.testimonials.save_changes")
                      : t("dashboard.testimonials.add_btn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {t("dashboard.testimonials.delete_confirm")}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-900">
                  {deleteTarget?.name}
                </span>{" "}
                {t("dashboard.testimonials.delete_body")}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 bg-red-500 text-white text-[13px] font-medium rounded-lg shadow-sm hover:bg-red-600 transition-all"
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
