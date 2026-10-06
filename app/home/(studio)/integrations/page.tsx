"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import { SiTwitch, SiYoutube, SiDiscord, SiKick } from "react-icons/si";
import {
  Plug,
  Gift,
  Check,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// ---------- Integration types & data ----------

type ConnectionStatus = "connected" | "error" | "disconnected";

// lucide-react and react-icons expose slightly different prop types
// (LucideIcon vs IconType) — this union covers both so one icon field
// can hold either family without a wrapper component.
type IntegrationIcon = IconType | React.ComponentType<{ size?: number; className?: string }>;

interface IntegrationDef {
  id: string;
  label: string;
  icon: IntegrationIcon;
  colorClass: string;
  desc: string;
  status: ConnectionStatus;
  lastSynced?: string; // mock until real data is wired
  scopes: string[];
  powers: string[]; // which widget types this integration feeds
}

// Mock connection state — swap for real data once OAuth/webhooks are wired.
const INTEGRATIONS: IntegrationDef[] = [
  {
    id: "twitch",
    label: "Twitch",
    icon: SiTwitch,
    colorClass: "magenta",
    desc: "Chat, follows, subs, raids and bits via EventSub.",
    status: "connected",
    lastSynced: "2 min ago",
    scopes: ["chat:read", "channel:read:subscriptions", "bits:read"],
    powers: ["Chat Feed", "Recent Follower", "Alert Box", "Follower Goal"],
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: SiYoutube,
    colorClass: "cyan",
    desc: "Live chat and membership events.",
    status: "disconnected",
    scopes: ["youtube.readonly"],
    powers: ["Chat Feed", "Alert Box"],
  },
  {
    id: "kick",
    label: "Kick",
    icon: SiKick,
    colorClass: "amber",
    desc: "Chat and follower events.",
    status: "error",
    lastSynced: "3 hours ago",
    scopes: ["chat:read"],
    powers: ["Chat Feed", "Recent Follower"],
  },
  {
    id: "discord",
    label: "Discord",
    icon: SiDiscord,
    colorClass: "cyan",
    desc: "Send stream-live notifications to a server channel.",
    status: "disconnected",
    scopes: ["webhook"],
    powers: ["Text / Ticker"],
  },
  {
    id: "streamelements",
    label: "StreamElements",
    icon: Gift, // no brand mark available in react-icons/si — generic icon
    colorClass: "amber",
    desc: "Donation and tip events.",
    status: "connected",
    lastSynced: "5 min ago",
    scopes: ["tips:read"],
    powers: ["Donation Ticker", "Follower Goal"],
  },
];

// Maps a token name to concrete utility classes — Tailwind needs
// full class strings statically discoverable (no dynamic `text-${x}`).
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

function statusMeta(status: ConnectionStatus) {
  switch (status) {
    case "connected":
      return { label: "Connected", icon: Check, className: "text-cyan" };
    case "error":
      return { label: "Needs reconnect", icon: AlertCircle, className: "text-magenta" };
    default:
      return { label: "Not connected", icon: X, className: "text-text-dim" };
  }
}

export default function IntegrationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(INTEGRATIONS[0]?.id ?? null);

  const selected = INTEGRATIONS.find((i) => i.id === selectedId) || null;

  const connectedCount = INTEGRATIONS.filter((i) => i.status === "connected").length;

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-10">
          <div className="flex items-center gap-3">
            <Plug size={20} className="text-magenta" />
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Integrations</h1>
            <span className="rounded border border-line px-2 py-0.5 font-mono text-[11px] text-text-dim">
              {connectedCount}/{INTEGRATIONS.length} connected
            </span>
          </div>
        </header>

        {/* Body */}
        <main className="flex flex-1 overflow-hidden">
          {/* Integration list */}
          <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {INTEGRATIONS.map((integration) => {
                const Icon = integration.icon;
                const c = colorClasses(integration.colorClass);
                const status = statusMeta(integration.status);
                const StatusIcon = status.icon;
                const isSelected = integration.id === selectedId;
                return (
                  <button
                    key={integration.id}
                    onClick={() => setSelectedId(integration.id)}
                    className={`group flex flex-col gap-3 rounded-lg border bg-surface p-3.5 text-left transition-colors ${isSelected ? "border-cyan/50 ring-1 ring-cyan/20" : "border-line hover:border-cyan/30"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${c.bg}`}>
                        <Icon size={15} className={c.text} />
                      </div>
                      <div className={`flex items-center gap-1 font-mono text-[11px] ${status.className}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </div>

                    <div>
                      <p className="font-display text-sm font-semibold">{integration.label}</p>
                      <p className="text-xs leading-snug text-text-dim">{integration.desc}</p>
                    </div>

                    {integration.lastSynced && (
                      <p className="border-t border-line pt-2.5 font-mono text-[11px] text-text-dim">
                        Synced {integration.lastSynced}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel — mirrors the Overlay Builder / Widgets side panel */}
          <div className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-l border-line px-4 py-6">
            <div>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-text-dim">Details</p>

              {!selected ? (
                <p className="text-xs leading-relaxed text-text-dim">
                  Select an integration to view connection details.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <selected.icon size={15} className={colorClasses(selected.colorClass).text} />
                    <span className="font-display text-sm font-semibold">{selected.label}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-text-dim">{selected.desc}</p>

                  <div>
                    <p className="mb-1.5 text-xs text-text-dim">Status</p>
                    {(() => {
                      const status = statusMeta(selected.status);
                      const StatusIcon = status.icon;
                      return (
                        <div className={`flex items-center gap-1.5 font-mono text-xs ${status.className}`}>
                          <StatusIcon size={13} />
                          {status.label}
                          {selected.lastSynced && (
                            <span className="text-text-dim">· {selected.lastSynced}</span>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs text-text-dim">Permissions</p>
                    <div className="flex flex-col gap-1">
                      {selected.scopes.map((scope) => (
                        <div
                          key={scope}
                          className="rounded-md border border-line px-2 py-1 font-mono text-[11px] text-text-dim"
                        >
                          {scope}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1.5 text-xs text-text-dim">Powers</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.powers.map((widget) => (
                        <span
                          key={widget}
                          className="rounded-full border border-line px-2 py-0.5 font-mono text-[11px] text-text-dim"
                        >
                          {widget}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 border-t border-line pt-4">
                    {selected.status === "connected" ? (
                      <button className="flex-1 rounded-md border border-line py-2 font-mono text-xs text-text-dim hover:text-text">
                        Disconnect
                      </button>
                    ) : (
                      <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-magenta py-2 font-mono text-xs font-semibold text-bg transition-transform hover:scale-[1.03]">
                        Connect
                      </button>
                    )}
                    {selected.status === "error" && (
                      <button className="flex items-center justify-center gap-1.5 rounded-md border border-cyan/50 px-3 py-2 font-mono text-xs text-cyan">
                        <RefreshCw size={12} />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
    </>
  );
}