"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  Blocks,
  Plus,
  ChevronRight,
} from "lucide-react";
import { WIDGET_TYPES, colorClasses } from "@/lib/widgets/types";

// Mock until overlays are queryable from Prisma — same pattern as the
// dashboard's recent-activity feed.
const USAGE: Record<string, string[]> = {
  alert: ["Main Stream"],
  goal: ["Main Stream", "Just Chatting"],
  chat: [],
  recent: [],
  donation: ["Just Chatting"],
  webcam: ["Main Stream"],
  text: [],
};

const CATEGORY_FILTER = [
  { id: "all", label: "All" },
  { id: "magenta", label: "Alerts" },
  { id: "cyan", label: "Feeds" },
  { id: "amber", label: "Goals" },
] as const;

export default function WidgetsPage() {
  const [activeColor, setActiveColor] = useState<(typeof CATEGORY_FILTER)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered =
    activeColor === "all"
      ? WIDGET_TYPES
      : WIDGET_TYPES.filter((w) => w.colorClass === activeColor);

  const selected = WIDGET_TYPES.find((w) => w.id === selectedId) || null;

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <Blocks size={20} className="text-magenta" />
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Widgets</h1>
            <span className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-text-dim">
              {WIDGET_TYPES.length} types
            </span>
          </div>
        </header>

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
            <div className="mb-5 flex gap-2 border-b border-line pb-4">
              {CATEGORY_FILTER.map((cat) => {
                const active = activeColor === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveColor(cat.id)}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${active
                      ? "border-cyan/50 bg-cyan/10 text-cyan"
                      : "border-line text-text-dim hover:text-text"
                      }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((type: (typeof WIDGET_TYPES)[number]) => {
                const Icon = type.icon;
                const c = colorClasses(type.colorClass);
                const usage = USAGE[String(type.id)] ?? [];

                return (
                  <div
                    key={type.id}
                    className={`group flex flex-col gap-3 rounded-lg border border-line bg-surface p-3.5 transition-colors hover:${c.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${c.bg}`}>
                        <Icon size={15} className={c.text} />
                      </div>

                      <a
                        href={`/home/overlaybuilder?addWidget=${type.id}`}
                        className="flex items-center gap-1 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-text-dim opacity-0 transition-opacity group-hover:opacity-100 hover:text-text"
                      >
                        <Plus size={12} />
                        Add
                      </a>
                    </div>

                    <div>
                      <p className="font-display text-sm font-semibold">{type.label}</p>
                      <p className="text-xs leading-snug text-text-dim">{type.desc}</p>
                    </div>

                    <button
                      onClick={() => setSelectedId(type.id)}
                      className="flex items-center justify-between border-t border-line pt-2.5 font-mono text-[11px] text-text-dim hover:text-text"
                    >
                      <span>{usage.length > 0 ? `Used in ${usage.length}` : "Not placed yet"}</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="flex w-64 shrink-0 flex-col gap-6 overflow-y-auto border-l border-line px-4 py-6">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">
                Details
              </p>

              {!selected ? (
                <p className="text-xs leading-relaxed text-text-dim">
                  Select a widget to see where it's placed and edit its config.
                </p>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <selected.icon size={15} className={colorClasses(selected.colorClass).text} />
                    <span className="font-display text-sm font-semibold">{selected.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-text-dim">{selected.desc}</p>

                  <div>
                    <p className="mb-1.5 text-xs text-text-dim">Placed on</p>
                    {(USAGE[selected.id] ?? []).length === 0 ? (
                      <p className="text-xs text-text-dim">Not placed on any overlay.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {(USAGE[selected.id] ?? []).map((name) => (
                          <div key={name} className="rounded-md border border-line px-2 py-1 text-xs">
                            {name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <a
                    href={`/home/overlaybuilder?addWidget=${selected.id}`}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-magenta px-3 py-2 font-mono text-xs font-semibold text-bg transition-transform hover:scale-[1.03]"
                  >
                    <LayoutTemplate size={13} />
                    Add to overlay
                  </a>
                </div>
              )}
            </div>
          </aside>
        </main>
    </>
  );
}