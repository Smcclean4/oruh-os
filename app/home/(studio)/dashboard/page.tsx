"use client";

import { useEffect, useState } from "react";
import { eventColorClass, formatUptime } from "@/lib/studio/utils";

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
    <>
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
            href="/home/overlaybuilder"
            className="rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Open Overlay Builder →
          </a>
        </header>

        <main className="px-6 py-8 md:px-10">
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
            <div className="rounded-xl border border-line bg-surface p-6 lg:col-span-2">
              <h2 className="font-display text-lg font-semibold">Quick actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <a
                  href="/home/overlaybuilder"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-magenta/40"
                >
                  <p className="font-display text-sm font-semibold">Overlay Builder</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Arrange panels, alerts, and cameras on your canvas.
                  </p>
                </a>

                <a
                  href="/home/widgets"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-cyan/40"
                >
                  <p className="font-display text-sm font-semibold">Widgets</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Manage viewer counts, alerts, timers, and chat boxes.
                  </p>
                </a>

                <a
                  href="/home/integrations"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-amber/40"
                >
                  <p className="font-display text-sm font-semibold">Integrations</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Connect Twitch, YouTube, and OBS.
                  </p>
                </a>

                <a
                  href="/home/settings"
                  className="rounded-lg border border-line bg-bg-alt p-4 transition-colors hover:border-line"
                >
                  <p className="font-display text-sm font-semibold">Settings</p>
                  <p className="mt-1 text-xs leading-relaxed text-text-dim">
                    Channel details, account, and preferences.
                  </p>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-4">
                {integrations.map((i) => (
                  <span
                    key={i.name}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] ${i.connected ? "border-cyan/40 text-cyan" : "border-line text-text-dim"
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
    </>
  );
}