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
import { AddableSectionType, sectionDefaults } from "@/lib/editor-schema";
import SortableSectionRow from "./SortableSectionRow";
import SectionSettingsPanel from "./SectionSettingsPanel";
import StorefrontPreview from "./StorefrontPreview";
import AddSectionPanel from "./AddSectionPanel";
import { saveSections } from "@/lib/actions/sections";
import { toast } from "sonner";
import ThemePanel from "./ThemePanel";
import { ThemeData } from "@/lib/actions/theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {
  initialSections: ShopSection[];
  shopId: string;
  shopSlug: string;
  shopName: string;
  currency: string;
  categories: { id: string; name: string }[];
  initialTheme: ThemeData;
};

export default function SectionEditor({
  initialSections,
  shopId,
  shopSlug,
  categories,
  initialTheme,
}: Props) {
  const [sections, setSections] = useState<ShopSection[]>(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSections[0]?.id ?? null,
  );
  const [saved, setSaved] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "SECTION_CLICK") setSelectedId(e.data.id);
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    iframeRef.current?.contentWindow?.postMessage(
      { type: "SELECT_SECTION", id: selectedId },
      "*",
    );
  }, [selectedId]);

  const selectedSection = sections.find((s) => s.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIframeLoading(true);
      const result = await saveSections(shopId, sections);
      if (result && !result.ok) {
        toast.error(result.error.message);
        setIframeLoading(false);
        return;
      }
      iframeRef.current?.contentWindow?.location.reload();
    }, 800);

    return () => clearTimeout(timer);
  }, [sections]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const activeSection = sections[oldIndex];
    const navbarIndex = sections.findIndex((s) => s.type === "navbar");

    // Only announcement is allowed above the navbar.
    // All other draggable sections must stay below it.
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

  function handleAddSection(type: AddableSectionType) {
    // crypto.randomUUID() generates a unique id — built into modern browsers and Node 14.17+
    const newSection = {
      id: crypto.randomUUID(),
      type,
      props: sectionDefaults[type],
    } as ShopSection;

    setSections((prev) => [...prev, newSection]);
    setSelectedId(newSection.id);
    setShowAddPanel(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* ── LEFT: Section list ── */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-neutral-200 flex flex-col">
        <div className="px-4 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-neutral-800">Editor</h1>
            <p className="text-xs text-neutral-400 mt-0.5">{shopSlug}</p>
          </div>

          <a
            href={`/shop/${shopSlug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
          >
            Live ↗
          </a>
        </div>

        <Tabs defaultValue="sections" className="flex flex-col flex-1 min-h-0">
          <div className="px-3 pt-3 pb-0">
            <TabsList className="w-full">
              <TabsTrigger value="sections" className="flex-1">Sections</TabsTrigger>
              <TabsTrigger value="theme" className="flex-1">Theme</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sections" className="flex flex-col flex-1 min-h-0 mt-0">
            <div className="flex-1 overflow-y-auto p-3">
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
                    {sections.map((section) => (
                      <SortableSectionRow
                        key={section.id}
                        section={section}
                        isSelected={selectedId === section.id}
                        onSelect={() => setSelectedId(section.id)}
                        onRemove={() => handleRemove(section.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            {showAddPanel && (
              <AddSectionPanel
                onAdd={handleAddSection}
                onClose={() => setShowAddPanel(false)}
              />
            )}

            <div className="px-4 py-3 border-t border-neutral-100">
              <button
                onClick={() => setShowAddPanel((v) => !v)}
                className="w-full py-2 text-sm font-medium border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors flex items-center justify-center gap-1.5"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add section
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
              Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-neutral-200 ${viewMode === "mobile" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900"}`}
            >
              Mobile
            </button>
          </div>
        </div>
        <StorefrontPreview
          shopSlug={shopSlug}
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
            Settings
          </p>
        </div>
        {selectedSection ? (
          <SectionSettingsPanel
            section={selectedSection}
            shopId={shopId}
            categories={categories}
            onChange={handlePropChange}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-400 text-sm p-8 text-center">
            Click a section in the preview or sidebar to edit it
          </div>
        )}
      </div>
    </div>
  );
}
