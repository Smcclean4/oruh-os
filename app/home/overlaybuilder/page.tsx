"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import type { LucideIcon } from "lucide-react";
import {
  LayoutTemplate,
  AlertTriangle,
  MessageSquare,
  Target,
  UserPlus,
  DollarSign,
  Video,
  Type as TypeIcon,
  Save,
  Eye,
  EyeOff,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
} from "lucide-react";
import Sidebar from "../components/nav";

const chakra = Chakra_Petch({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-chakra",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
});

// ---------- Overlay builder types & data ----------

interface WidgetTypeDef {
  id: string;
  label: string;
  icon: LucideIcon;
  colorClass: string; // tailwind text/border color token, e.g. "magenta"
  w: number;
  h: number;
  desc: string;
}

interface PlacedWidget {
  id: string;
  typeId: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  x: number;
  y: number;
  w: number;
  h: number;
  opacity: number;
}

interface DragState {
  id: string;
  offsetX: number;
  offsetY: number;
}

interface ResizeState {
  id: string;
  startClientX: number;
  startClientY: number;
  startW: number;
  startH: number;
}

const WIDGET_TYPES: WidgetTypeDef[] = [
  { id: "alert", label: "Alert Box", icon: AlertTriangle, colorClass: "magenta", w: 220, h: 70, desc: "New follower / sub pop-up" },
  { id: "chat", label: "Chat Feed", icon: MessageSquare, colorClass: "cyan", w: 200, h: 240, desc: "Live chat overlay" },
  { id: "goal", label: "Follower Goal", icon: Target, colorClass: "amber", w: 260, h: 60, desc: "Progress bar toward a goal" },
  { id: "recent", label: "Recent Follower", icon: UserPlus, colorClass: "magenta", w: 220, h: 56, desc: "Latest follower ticker" },
  { id: "donation", label: "Donation Ticker", icon: DollarSign, colorClass: "amber", w: 240, h: 56, desc: "Scrolling donation feed" },
  { id: "webcam", label: "Webcam Frame", icon: Video, colorClass: "cyan", w: 220, h: 165, desc: "Border frame for cam" },
  { id: "text", label: "Text / Ticker", icon: TypeIcon, colorClass: "cyan", w: 260, h: 44, desc: "Custom scrolling text" },
];

const CANVAS_W = 960;
const CANVAS_H = 540;

let idCounter = 1;
const nextId = () => `w${idCounter++}`;

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

// Maps a token name to the concrete utility classes, since Tailwind needs
// full class strings to be statically discoverable (no dynamic `text-${x}`).
function colorClasses(colorClass: string) {
  switch (colorClass) {
    case "magenta":
      return { text: "text-magenta", border: "border-magenta/50", bg: "bg-magenta/10", solidBg: "bg-magenta" };
    case "amber":
      return { text: "text-amber", border: "border-amber/50", bg: "bg-amber/10", solidBg: "bg-amber" };
    default:
      return { text: "text-cyan", border: "border-cyan/50", bg: "bg-cyan/10", solidBg: "bg-cyan" };
  }
}

export default function OverlayBuilderPage() {
  const [isLive] = useState(true);
  const [overlayName, setOverlayName] = useState("Untitled Overlay");
  const [widgets, setWidgets] = useState<PlacedWidget[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const selected = widgets.find((w) => w.id === selectedId) || null;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const typeId = e.dataTransfer.getData("widgetType");
    const type = WIDGET_TYPES.find((t) => t.id === typeId);
    if (!type || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left - type.w / 2;
    const dropY = e.clientY - rect.top - type.h / 2;
    const newWidget: PlacedWidget = {
      id: nextId(),
      typeId: type.id,
      label: type.label,
      icon: type.icon,
      colorClass: type.colorClass,
      x: clamp(dropX, 0, CANVAS_W - type.w),
      y: clamp(dropY, 0, CANVAS_H - type.h),
      w: type.w,
      h: type.h,
      opacity: 100,
    };
    setWidgets((prev) => [...prev, newWidget]);
    setSelectedId(newWidget.id);
  };

  const startMove = (e: React.MouseEvent<HTMLDivElement>, widget: PlacedWidget) => {
    e.stopPropagation();
    setSelectedId(widget.id);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = {
      id: widget.id,
      offsetX: e.clientX - rect.left - widget.x,
      offsetY: e.clientY - rect.top - widget.y,
    };
  };

  const startResize = (e: React.MouseEvent<HTMLDivElement>, widget: PlacedWidget) => {
    e.stopPropagation();
    setSelectedId(widget.id);
    resizeRef.current = {
      id: widget.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startW: widget.w,
      startH: widget.h,
    };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragRef.current && canvasRef.current) {
        const { id, offsetX, offsetY } = dragRef.current;
        const rect = canvasRef.current.getBoundingClientRect();
        setWidgets((prev) =>
          prev.map((w) =>
            w.id === id
              ? {
                ...w,
                x: clamp(e.clientX - rect.left - offsetX, 0, CANVAS_W - w.w),
                y: clamp(e.clientY - rect.top - offsetY, 0, CANVAS_H - w.h),
              }
              : w,
          ),
        );
      }
      if (resizeRef.current) {
        const { id, startClientX, startClientY, startW, startH } = resizeRef.current;
        const dx = e.clientX - startClientX;
        const dy = e.clientY - startClientY;
        setWidgets((prev) =>
          prev.map((w) =>
            w.id === id
              ? {
                ...w,
                w: clamp(startW + dx, 60, CANVAS_W - w.x),
                h: clamp(startH + dy, 32, CANVAS_H - w.y),
              }
              : w,
          ),
        );
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const updateSelected = (patch: Partial<PlacedWidget>) => {
    if (!selectedId) return;
    setWidgets((prev) => prev.map((w) => (w.id === selectedId ? { ...w, ...patch } : w)));
  };

  const deleteWidget = useCallback((id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const duplicateWidget = (widget: PlacedWidget) => {
    const copy: PlacedWidget = {
      ...widget,
      id: nextId(),
      x: clamp(widget.x + 20, 0, CANVAS_W - widget.w),
      y: clamp(widget.y + 20, 0, CANVAS_H - widget.h),
    };
    setWidgets((prev) => [...prev, copy]);
    setSelectedId(copy.id);
  };

  const reorder = (id: string, dir: "up" | "down") => {
    setWidgets((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx === -1) return prev;
      const swapWith = dir === "up" ? idx + 1 : idx - 1;
      if (swapWith < 0 || swapWith >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
      return next;
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        deleteWidget(selectedId);
      }
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, deleteWidget]);

  const handleSave = () => {
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 1800);
  };

  return (
    <div
      className={`${chakra.variable} ${inter.variable} ${jetbrains.variable} flex min-h-screen bg-bg font-body text-text antialiased`}
    >
      <Sidebar isLive={isLive} />

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <LayoutTemplate size={20} className="text-magenta" />
            <input
              value={overlayName}
              onChange={(e) => setOverlayName(e.target.value)}
              className="bg-transparent font-display text-xl font-bold tracking-tight outline-none sm:text-2xl"
            />
            <span className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-text-dim">
              1920×1080
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreviewMode((p) => !p)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-colors ${previewMode ? "border-cyan/50 text-cyan" : "border-line text-text-dim hover:text-text"
                }`}
            >
              {previewMode ? <Eye size={14} /> : <EyeOff size={14} />}
              {previewMode ? "Previewing" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] ${saveState === "saved" ? "bg-cyan" : "bg-magenta"
                }`}
            >
              <Save size={14} />
              {saveState === "saved" ? "Saved" : "Save overlay"}
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex flex-1 overflow-hidden">
          {/* Widget library */}
          {!previewMode && (
            <div className="w-56 shrink-0 overflow-y-auto border-r border-line px-4 py-6">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">Widgets</p>
              <div className="flex flex-col gap-2">
                {WIDGET_TYPES.map((type) => {
                  const Icon = type.icon;
                  const c = colorClasses(type.colorClass);
                  return (
                    <div
                      key={type.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("widgetType", type.id)}
                      title={`Drag onto canvas: ${type.label}`}
                      className="flex cursor-grab items-start gap-2.5 rounded-lg border border-line bg-surface p-2.5"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${c.bg}`}>
                        <Icon size={14} className={c.text} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold">{type.label}</p>
                        <p className="text-xs leading-snug text-text-dim">{type.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Canvas */}
          <div className="flex flex-1 items-center justify-center overflow-auto bg-bg p-6">
            <div
              ref={canvasRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={previewMode ? undefined : handleDrop}
              onMouseDown={() => setSelectedId(null)}
              style={{ width: CANVAS_W, height: CANVAS_H }}
              className={`relative shrink-0 rounded-md border border-line ${previewMode ? "bg-black" : "bg-surface bg-[size:32px_32px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
                }`}
            >
              {widgets.length === 0 && (
                <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line text-sm text-text-dim">
                  <LayoutTemplate size={22} className="text-line" />
                  Drag a widget here to build your overlay
                </div>
              )}

              {widgets.map((w) => {
                const Icon = w.icon;
                const isSelected = w.id === selectedId;
                const c = colorClasses(w.colorClass);
                return (
                  <div
                    key={w.id}
                    onMouseDown={(e) => !previewMode && startMove(e, w)}
                    style={{ left: w.x, top: w.y, width: w.w, height: w.h, opacity: w.opacity / 100 }}
                    className={`absolute flex select-none items-center gap-2 rounded-md border-[1.5px] px-2.5 ${c.bg} ${isSelected && !previewMode ? "border-cyan ring-2 ring-cyan/20" : c.border
                      } ${previewMode ? "cursor-default" : "cursor-grab"}`}
                  >
                    <Icon size={14} className={`shrink-0 ${c.text}`} />
                    <span className="truncate font-display text-xs font-semibold">{w.label}</span>

                    {!previewMode && isSelected && (
                      <div
                        onMouseDown={(e) => startResize(e, w)}
                        className="absolute -bottom-1 -right-1 h-2.5 w-2.5 cursor-nwse-resize rounded-sm bg-cyan"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Properties panel */}
          {!previewMode && (
            <div className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-l border-line px-4 py-6">
              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">Properties</p>

                {!selected ? (
                  <p className="text-xs leading-relaxed text-text-dim">
                    Select a widget on the canvas to edit its position, size and opacity.
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <selected.icon size={15} className={colorClasses(selected.colorClass).text} />
                      <span className="font-display text-sm font-semibold">{selected.label}</span>
                    </div>

                    <PropRow label="X">
                      <NumberField
                        value={Math.round(selected.x)}
                        onChange={(v) => updateSelected({ x: clamp(v, 0, CANVAS_W - selected.w) })}
                      />
                    </PropRow>
                    <PropRow label="Y">
                      <NumberField
                        value={Math.round(selected.y)}
                        onChange={(v) => updateSelected({ y: clamp(v, 0, CANVAS_H - selected.h) })}
                      />
                    </PropRow>
                    <PropRow label="Width">
                      <NumberField
                        value={Math.round(selected.w)}
                        onChange={(v) => updateSelected({ w: clamp(v, 60, CANVAS_W - selected.x) })}
                      />
                    </PropRow>
                    <PropRow label="Height">
                      <NumberField
                        value={Math.round(selected.h)}
                        onChange={(v) => updateSelected({ h: clamp(v, 32, CANVAS_H - selected.y) })}
                      />
                    </PropRow>

                    <div>
                      <p className="mb-1.5 text-xs text-text-dim">Opacity — {selected.opacity}%</p>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={selected.opacity}
                        onChange={(e) => updateSelected({ opacity: Number(e.target.value) })}
                        className="w-full accent-cyan"
                      />
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <IconBtn title="Bring forward" onClick={() => reorder(selected.id, "up")}>
                        <ChevronUp size={14} />
                      </IconBtn>
                      <IconBtn title="Send backward" onClick={() => reorder(selected.id, "down")}>
                        <ChevronDown size={14} />
                      </IconBtn>
                      <IconBtn title="Duplicate" onClick={() => duplicateWidget(selected)}>
                        <Copy size={14} />
                      </IconBtn>
                      <IconBtn title="Delete" danger onClick={() => deleteWidget(selected.id)}>
                        <Trash2 size={14} />
                      </IconBtn>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">
                  Layers ({widgets.length})
                </p>
                {widgets.length === 0 ? (
                  <p className="text-xs text-text-dim">No widgets placed yet.</p>
                ) : (
                  <div className="flex flex-col-reverse gap-1">
                    {widgets.map((w) => {
                      const Icon = w.icon;
                      const isSelected = w.id === selectedId;
                      const c = colorClasses(w.colorClass);
                      return (
                        <div
                          key={w.id}
                          onClick={() => setSelectedId(w.id)}
                          className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs ${isSelected ? "border-cyan/50 bg-cyan/10" : "border-transparent hover:bg-surface"
                            }`}
                        >
                          <Icon size={12} className={c.text} />
                          <span className="truncate">{w.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2.5">
      <span className="text-xs text-text-dim">{label}</span>
      {children}
    </div>
  );
}

function NumberField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-[72px] rounded-md border border-line bg-bg-alt px-2 py-1 font-mono text-xs text-text outline-none"
    />
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`flex flex-1 items-center justify-center rounded-md border border-line py-1.5 ${danger ? "text-magenta" : "text-text-dim hover:text-text"
        }`}
    >
      {children}
    </button>
  );
}