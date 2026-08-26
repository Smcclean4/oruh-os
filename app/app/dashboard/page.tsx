"use client";

import { useEffect, useState } from "react";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";

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

const navItems = [
  { label: "Dashboard", href: "/app", active: true },
  { label: "Overlay Builder", href: "/app/overlay-builder", active: false },
  { label: "Widgets", href: "/app/widgets", active: false },
  { label: "Integrations", href: "/app/integrations", active: false },
  { label: "Settings", href: "/app/settings", active: false },
];

const integrations = [
  { name: "Twitch", connected: true },
  { name: "YouTube", connected: true },
  { name: "OBS", connected: false },
];

const eventFeed = [
  { color: "cyan", text: "new follower · jules_r", time: "2m" },
  { color: "magenta", text: "new sub · kito_dev", time: "6m" },
  { color: "amber", text: "tip · $5 from nova_streams", time: "14m" },
  { color: "text", text: "raid incoming · remi.codes (38 viewers)", time: "22m" },
  { color: "cyan", text: "new follower · ashv_live", time: "31m" },
];

function formatUptime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function eventColorClass(color: string) {
  if (color === "cyan") return "border-cyan/40 text-cyan";
  if (color === "magenta") return "border-magenta/40 text-magenta";
  if (color === "amber") return "border-amber/40 text-amber";
  return "border-line text-text";
}

export default function DashboardPage() {
  // Placeholder data — swap for real session / stream state once
  // verification and the streaming provider connections are wired up.
  const [isLive] = useState(true);
  const [viewers, setViewers] = useState(1204);
  const [uptime, setUptime] = useState(5417);
  const [bitrate, setBitrate] = useState(6800);
  const [followers] = useState(3820);

  const subGoal = 50;
  const [subCount, setSubCount] = useState(34);

  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 15) - 6;
        return Math.max(980, v + delta);
      });
    }, 1600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setBitrate((b) => {
        const delta = Math.floor(Math.random() * 200) - 100;
        return Math.max(5800, Math.min(7200, b + delta));
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSubCount((c) => (c >= subGoal ? 20 : c + 1));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`${chakra.variable} ${inter.variable} ${jetbrains.variable} flex min-h-screen bg-bg font-body text-text antialiased`}
    >
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-line bg-bg-alt md:flex md:flex-col">
        <div className="border-b border-line px-6 py-5">
          <span className="font-display text-2xl font-bold tracking-tight">
            Oruh<span className="text-magenta">Studio</span>
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${item.active
                ? "bg-surface text-text"
                : "text-text-dim hover:bg-surface hover:text-text"
                }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="border-t border-line px-6 py-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${isLive ? "animate-blink bg-magenta motion-reduce:animate-none" : "bg-text-dim"
                }`}
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
              {isLive ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-line px-6 py-5 md:px-10">
          <div>
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
              Welcome back
            </h1>
            <p className="mt-0.5 font-mono text-[11px] text-text-dim">
              {isLive ? `streaming · ${formatUptime(uptime)}` : "not currently streaming"}
            </p>
          </div>
          <a
            href="/app/overlay-builder"
            className="rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Open Overlay Builder →
          </a>
        </header>

        <main className="px-6 py-8 md:px-10">
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
                Viewers
              </p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {viewers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
                Followers
              </p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {followers.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
                Bitrate
              </p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {bitrate.toLocaleString()}
                <span className="ml-1 text-base font-medium text-text-dim">kbps</span>
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">
                Sub goal
              </p>
              <p className="mt-2 font-display text-3xl font-bold tabular-nums">
                {subCount}
                <span className="ml-1 text-base font-medium text-text-dim">/ {subGoal}</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, (subCount / subGoal) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Quick actions */}
            <div className="rounded-xl border border-line bg-surface p-6 lg:col-span-2">
              <h2 className="font-display text-lg font-semibold">Quick actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href="/app/overlay-builder"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-magenta/40"
                >
                  <p className="font-display text-sm font-semibold">Overlay Builder</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Arrange panels, alerts, and cameras on your canvas.
                  </p>
                </a>
                <a
                  href="/app/widgets"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-cyan/40"
                >
                  <p className="font-display text-sm font-semibold">Widgets</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Manage viewer counts, alerts, timers, and chat boxes.
                  </p>
                </a>
                <a
                  href="/app/integrations"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-amber/40"
                >
                  <p className="font-display text-sm font-semibold">Integrations</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Connect Twitch, YouTube, and OBS.
                  </p>
                </a>
                <a
                  href="/app/settings"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-line"
                >
                  <p className="font-display text-sm font-semibold">Settings</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Channel details, account, and preferences.
                  </p>
                </a>
              </div>

              {/* Integration status strip */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
                {integrations.map((i) => (
                  <span
                    key={i.name}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] ${i.connected
                      ? "border-cyan/40 text-cyan"
                      : "border-line text-text-dim"
                      }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${i.connected ? "bg-cyan" : "bg-text-dim"
                        }`}
                    />
                    {i.name} {i.connected ? "connected" : "not connected"}
                  </span>
                ))}
              </div>
            </div>

            {/* Event feed */}
            <div className="rounded-xl border border-line bg-surface p-6">
              <h2 className="font-display text-lg font-semibold">Recent activity</h2>
              <div className="mt-4 flex flex-col gap-2">
                {eventFeed.map((e, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-md border bg-bg-alt px-3 py-2 ${eventColorClass(
                      e.color,
                    )}`}
                  >
                    <span className="font-mono text-[11px]">{e.text}</span>
                    <span className="font-mono text-[10px] text-text-dim">{e.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}