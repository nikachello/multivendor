"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, Eye, EyeOff, Trash2, Pencil, X, Check, Plus, ExternalLink } from "lucide-react";
import { generateLegalPages, createPage, updatePage, deletePage } from "@/lib/actions/pages";
import { slugify } from "@/lib/slugify";

type Page = {
  id: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
};

type Props = {
  shopId: string;
  shopSlug: string;
  initialPages: Page[];
};

export default function PagesManager({ shopId, shopSlug, initialPages }: Props) {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newContent, setNewContent] = useState("");
  const [saving, setSaving] = useState(false);

  const storeBase = `/shop/${shopSlug}/p`;

  async function handleGenerate() {
    setGenerating(true);
    const result = await generateLegalPages(shopId);
    setGenerating(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    const { created, skipped } = result.data;
    if (created === 0) {
      toast.info("All legal pages already exist.");
    } else {
      toast.success(`Created ${created} page${created !== 1 ? "s" : ""}${skipped > 0 ? ` (${skipped} already existed)` : ""}.`);
    }
    // Reload pages from server via router refresh is not available here — use window.location.reload or revalidatePath
    // Instead we refetch inline by triggering a page reload
    window.location.reload();
  }

  function startEdit(page: Page) {
    setEditingId(page.id);
    setEditTitle(page.title);
    setEditContent(page.content);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function handleSaveEdit(pageId: string) {
    setSaving(true);
    const result = await updatePage(pageId, { title: editTitle, content: editContent });
    setSaving(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    setPages((prev) => prev.map((p) => p.id === pageId ? { ...p, title: editTitle, content: editContent } : p));
    setEditingId(null);
    toast.success("Page saved.");
  }

  async function handleTogglePublished(page: Page) {
    const result = await updatePage(page.id, { isPublished: !page.isPublished });
    if (!result.ok) { toast.error(result.error.message); return; }
    setPages((prev) => prev.map((p) => p.id === page.id ? { ...p, isPublished: !page.isPublished } : p));
    toast.success(page.isPublished ? "Page unpublished." : "Page published.");
  }

  async function handleDelete(pageId: string) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    const result = await deletePage(pageId);
    if (!result.ok) { toast.error(result.error.message); return; }
    setPages((prev) => prev.filter((p) => p.id !== pageId));
    toast.success("Page deleted.");
  }

  async function handleCreate() {
    setSaving(true);
    const result = await createPage(shopId, { title: newTitle, slug: newSlug, content: newContent });
    setSaving(false);
    if (!result.ok) { toast.error(result.error.message); return; }
    setPages((prev) => [...prev, result.data as Page]);
    setShowNew(false);
    setNewTitle(""); setNewSlug(""); setNewContent("");
    toast.success("Page created.");
  }

  function deriveSlug(title: string) {
    return slugify(title);
  }

  return (
    <div className="space-y-6">
      {/* Actions bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <FileText className="w-4 h-4" />
          {generating ? "Generating…" : "Generate Legal Pages"}
        </button>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* New page form */}
      {showNew && (
        <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700">New Page</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Title</label>
              <input
                value={newTitle}
                onChange={(e) => { setNewTitle(e.target.value); setNewSlug(deriveSlug(e.target.value)); }}
                placeholder="About Us"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Slug</label>
              <input
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="about-us"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Content (HTML)</label>
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={6}
              placeholder="<p>Write your page content here…</p>"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400 resize-y"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={saving || !newTitle || !newSlug}
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Creating…" : "Create Page"}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pages list */}
      {pages.length === 0 && !showNew ? (
        <div className="border border-dashed border-gray-200 rounded-xl py-12 text-center">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No pages yet</p>
          <p className="text-xs text-gray-400">Click "Generate Legal Pages" to create Privacy Policy, Terms, and more in one click.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
              {editingId === page.id ? (
                <div className="p-5 space-y-4">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:border-gray-400"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={14}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-gray-400 resize-y"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(page.id)}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-900 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button onClick={cancelEdit} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:border-gray-400 transition-colors">
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{page.title}</p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{storeBase}/{page.slug}</p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${page.isPublished ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {page.isPublished ? "Published" : "Hidden"}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`${storeBase}/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View page"
                      className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => startEdit(page)} title="Edit" className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleTogglePublished(page)} title={page.isPublished ? "Unpublish" : "Publish"} className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded">
                      {page.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(page.id)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pages.length > 0 && (
        <p className="text-xs text-gray-400">
          Link to these pages from your store navigation via the <span className="font-medium text-gray-600">Navigation</span> editor.
        </p>
      )}
    </div>
  );
}
