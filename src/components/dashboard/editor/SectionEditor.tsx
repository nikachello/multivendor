"use client";

import { useEffect, useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";

import { ShopSection } from "@/lib/types/store-section";
import { getThemeSectionMeta } from "@/themes/editorMeta";
import SortableSectionRow from "./SortableSectionRow";
import SectionSettingsPanel from "./SectionSettingsPanel";
import StorefrontPreview from "./StorefrontPreview";
import AddSectionPanel from "./AddSectionPanel";
import { saveSections } from "@/lib/actions/sections";
import { toast } from "sonner";
import { useT } from "@/i18n/context";
import ThemePanel from "./ThemePanel";
import CollectionPageSettings from "./CollectionPageSettings";
import { ThemeData } from "@/lib/actions/theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageType } from "@/themes/types";
import type { CollectionConfig } from "@/lib/db/queries";

type PagesSections = Record<PageType, ShopSection[]>;

type Props = {
  initialPagesSections: PagesSections;
  shopId: string;
  shopSlug: string;
  shopName: string;
  currency: string;
  categories: { id: string; name: string; slug?: string }[];
  pages: { slug: string; title: string }[];
  initialTheme: ThemeData;
  themeId: string;
  firstCategorySlug: string | null;
  firstProductSlug: string | null;
  initialCollectionConfig: Required<CollectionConfig>;
  optionTypeNames: string[];
};

export default function SectionEditor({
  initialPagesSections,
  shopId,
  shopSlug,
  categories,
  pages,
  initialTheme,
  themeId,
  firstCategorySlug,
  firstProductSlug,
  initialCollectionConfig,
  optionTypeNames,
}: Props) {
  const [pagesSections, setPagesSections] = useState<PagesSections>(initialPagesSections);
  const [activePage, setActivePage] = useState<PageType>("home");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPagesSections.home[0]?.id ?? null,
  );
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [pageSettingsOpen, setPageSettingsOpen] = useState(false);
  const t = useT();

  const PAGE_TABS: { label: string; value: PageType }[] = [
    { label: t("dashboard.editor.page_home"), value: "home" },
    { label: t("dashboard.editor.page_collection"), value: "collection" },
    { label: t("dashboard.editor.page_product"), value: "product" },
    { label: t("dashboard.editor.page_search"), value: "search" },
  ];

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const justSwitchedPage = useRef(false);

  const sections = pagesSections[activePage];

  function getPreviewUrl(page: PageType): string {
    switch (page) {
      case "home":
        return `/shop/${shopSlug}`;
      case "collection":
        return firstCategorySlug
          ? `/shop/${shopSlug}/collections/${firstCategorySlug}`
          : `/shop/${shopSlug}`;
      case "product":
        return firstProductSlug
          ? `/shop/${shopSlug}/product/${firstProductSlug}`
          : `/shop/${shopSlug}`;
      case "search":
        return `/shop/${shopSlug}/search`;
    }
  }

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "SECTION_CLICK") {
        setSelectedId(e.data.id);
      }
      if (e.data?.type === "PAGE_LOAD") {
        const pathname: string = e.data.pathname ?? "";
        let page: PageType | null = null;
        if (pathname === `/shop/${shopSlug}`) page = "home";
        else if (pathname.startsWith(`/shop/${shopSlug}/collections/`)) page = "collection";
        else if (pathname.startsWith(`/shop/${shopSlug}/product/`)) page = "product";
        else if (pathname.startsWith(`/shop/${shopSlug}/search`)) page = "search";
        if (page && page !== activePage) {
          justSwitchedPage.current = true;
          setActivePage(page);
          setSelectedId(null);
          setShowAddPanel(false);
        }
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [activePage, shopSlug]);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "SELECT_SECTION", id: selectedId },
      "*",
    );
  }, [selectedId]);

  // Auto-save when current page's sections change (skip on page switch)
  useEffect(() => {
    if (justSwitchedPage.current) {
      justSwitchedPage.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      setIframeLoading(true);
      const result = await saveSections(shopId, activePage, sections);
      if (result && !result.ok) {
        toast.error(result.error.message);
        setIframeLoading(false);
        return;
      }
      iframeRef.current?.contentWindow?.location.reload();
    }, 800);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections]);

  const selectedSection = sections.find((s) => s.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handlePageSwitch(page: PageType) {
    if (page === activePage) return;
    justSwitchedPage.current = true;
    setActivePage(page);
    setSelectedId(pagesSections[page][0]?.id ?? null);
    setShowAddPanel(false);
    setPageSettingsOpen(false);
    if (iframeRef.current) {
      iframeRef.current.src = getPreviewUrl(page);
    }
  }

  function setSections(updater: ShopSection[] | ((prev: ShopSection[]) => ShopSection[])) {
    setPagesSections((prev) => ({
      ...prev,
      [activePage]:
        typeof updater === "function" ? updater(prev[activePage]) : updater,
    }));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const activeSection = sections[oldIndex];
    const navbarIndex = sections.findIndex((s) => s.type === "navbar");

    if (
      activeSection.type !== "announcement" &&
      activeSection.type !== "navbar" &&
      newIndex <= navbarIndex
    ) {
      return;
    }

    const newSections = arrayMove(sections, oldIndex, newIndex);
    setSections(newSections);
    iframeRef.current?.contentWindow?.postMessage({
      type: "REORDER_SECTIONS",
      order: newSections.map((s) => s.id),
    });
  }

  function handleRemove(id: string) {
    const remaining = sections.filter((s) => s.id !== id);
    setSections(remaining);
    if (selectedId === id) {
      setSelectedId(remaining[0]?.id ?? null);
    }
  }

  function handlePropChange(key: string, value: unknown) {
    setSections((prev) =>
      prev.map((s) =>
        s.id === selectedId
          ? ({ ...s, props: { ...s.props, [key]: value } } as ShopSection)
          : s,
      ),
    );
  }

  function handleAddSection(type: string) {
    const meta = getThemeSectionMeta(themeId).find((m) => m.type === type);
    const newSection: ShopSection = {
      id: crypto.randomUUID(),
      type,
      props: meta?.defaultProps ?? {},
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedId(newSection.id);
    setShowAddPanel(false);
  }

  function handleAddNavbar() {
    const newSection = {
      id: crypto.randomUUID(),
      type: "navbar",
      props: { items: [], transparent: false },
    } as ShopSection;

    setSections((prev) => {
      const announcementIdx = prev.findIndex((s) => s.type === "announcement");
      if (announcementIdx >= 0) {
        const next = [...prev];
        next.splice(announcementIdx + 1, 0, newSection);
        return next;
      }
      return [newSection, ...prev];
    });
    setSelectedId(newSection.id);
    setShowAddPanel(false);
  }

  return (
    <div className="flex h-full bg-neutral-50 overflow-hidden">
      {/* ── LEFT: Section list ── */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-4 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-neutral-800">{t("dashboard.editor.title")}</h1>
            <p className="text-xs text-neutral-400 mt-0.5">{shopSlug}</p>
          </div>
          <a
            href={`/shop/${shopSlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
          >
            {t("dashboard.editor.live")}
          </a>
        </div>

        {/* Page picker */}
        <div className="px-3 pt-3 pb-2 border-b border-neutral-100">
          <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-2">
            {t("dashboard.editor.page_label")}
          </p>
          <div className="grid grid-cols-2 gap-1">
            {PAGE_TABS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handlePageSwitch(value)}
                className={`px-2 py-1.5 text-xs font-medium rounded transition-colors ${
                  activePage === value
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="sections" className="flex flex-col flex-1 min-h-0">
          <div className="px-3 pt-3 pb-0">
            <TabsList className="w-full">
              <TabsTrigger value="sections" className="flex-1">{t("dashboard.editor.tab_sections")}</TabsTrigger>
              <TabsTrigger value="theme" className="flex-1">{t("dashboard.editor.tab_theme")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sections" className="flex flex-col flex-1 min-h-0 mt-0">
            {activePage === "collection" && !firstCategorySlug && (
              <p className="mx-3 mt-3 px-3 py-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded">
                {t("dashboard.editor.no_categories")}
              </p>
            )}
            {activePage === "product" && !firstProductSlug && (
              <p className="mx-3 mt-3 px-3 py-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded">
                {t("dashboard.editor.no_products")}
              </p>
            )}
            <div className="flex-1 overflow-y-auto p-3">
              {/* Page-level settings button — collection only */}
              {activePage === "collection" && (
                <button
                  onClick={() => { setPageSettingsOpen(true); setSelectedId(null); }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 mb-2 rounded-lg text-xs font-medium transition-colors ${
                    pageSettingsOpen
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 border border-neutral-200"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                  </svg>
                  {t("dashboard.editor.filter_settings")}
                </button>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col gap-1">
                    {sections.map((section) => {
                      const sectionMeta = getThemeSectionMeta(themeId);
                      const label = sectionMeta.find((m) => m.type === section.type)?.label ?? section.type;
                      return (
                        <SortableSectionRow
                          key={section.id}
                          section={section}
                          label={label}
                          isSelected={selectedId === section.id}
                          onSelect={() => { setSelectedId(section.id); setPageSettingsOpen(false); }}
                          onRemove={() => handleRemove(section.id)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              {sections.length === 0 && (
                <p className="text-xs text-neutral-400 text-center py-6">
                  {t("dashboard.editor.no_sections")}
                </p>
              )}
            </div>

            {showAddPanel && (
              <AddSectionPanel
                addableMeta={getThemeSectionMeta(themeId).filter(
                  (m) =>
                    m.type !== "navbar" &&
                    (!m.pages || m.pages.includes(activePage)),
                )}
                onAdd={handleAddSection}
                onAddNavbar={handleAddNavbar}
                hasNavbar={sections.some((s) => s.type === "navbar")}
                onClose={() => setShowAddPanel(false)}
              />
            )}

            <div className="px-4 py-3 border-t border-neutral-100">
              <button
                onClick={() => setShowAddPanel((v) => !v)}
                className="w-full py-2 text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {t("dashboard.editor.add_section")}
              </button>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="flex-1 overflow-y-auto p-4 mt-0">
            <ThemePanel
              shopId={shopId}
              initialTheme={initialTheme}
              iframeRef={iframeRef}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* ── MIDDLE: Live preview ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-100">
        <div className="flex items-center justify-center py-2 border-b border-neutral-200 bg-white">
          <div className="flex border border-neutral-200">
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${viewMode === "desktop" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              {t("dashboard.editor.desktop")}
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-neutral-200 ${viewMode === "mobile" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              {t("dashboard.editor.mobile")}
            </button>
          </div>
        </div>
        <StorefrontPreview
          initialUrl={`/shop/${shopSlug}`}
          iframeRef={iframeRef}
          isLoading={iframeLoading}
          onLoad={() => setIframeLoading(false)}
          viewMode={viewMode}
        />
      </div>

      {/* ── RIGHT: Settings panel ── */}
      <div className="w-72 flex-shrink-0 bg-white border-l border-neutral-200 flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-neutral-100">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
            {t("dashboard.editor.settings")}
          </p>
        </div>
        {pageSettingsOpen ? (
          <CollectionPageSettings
            shopId={shopId}
            shopSlug={shopSlug}
            optionTypeNames={optionTypeNames}
            initial={initialCollectionConfig}
            onSaved={() => {
              setIframeLoading(true);
              iframeRef.current?.contentWindow?.location.reload();
            }}
          />
        ) : selectedSection ? (
          <SectionSettingsPanel
            section={selectedSection}
            shopId={shopId}
            categories={categories}
            pages={pages}
            sectionMeta={getThemeSectionMeta(themeId)}
            onChange={handlePropChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm p-8 text-center">
            {t("dashboard.editor.click_hint")}
          </div>
        )}
      </div>
    </div>
  );
}
