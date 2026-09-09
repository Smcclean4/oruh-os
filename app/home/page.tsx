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

const features = [
  {
    ch: "CH.01",
    title: "Overlay Builder",
    body: "Drag panels, alerts, and cameras onto a canvas that matches your stream 1:1. No code, no guessing at pixel positions.",
  },
  {
    ch: "CH.02",
    title: "Widgets",
    body: "Viewer counts, follower alerts, countdown timers, and chat boxes, live data, wired in once and forgotten.",
  },
  {
    ch: "CH.03",
    title: "Dashboard",
    body: "Every stream, every stat, one screen. Know what's working without tabbing through four different sites.",
  },
  {
    ch: "CH.04",
    title: "Integrations",
    body: "Twitch, YouTube, and OBS connect in one click. Oruh sits underneath your existing setup, not on top of it.",
  },
];

const segments = [
  {
    label: "SEGMENT 1",
    title: "Connect your channel",
    body: "Link Twitch, YouTube, or OBS. Oruh reads your stream key once and never asks again.",
  },
  {
    label: "SEGMENT 2",
    title: "Design your overlay",
    body: "Place widgets on the canvas the way you'd arrange furniture. Drag, resize, done.",
  },
  {
    label: "SEGMENT 3",
    title: "Go live",
    body: "Hit start. Your dashboard tracks viewers, alerts, and chat in real time while you focus on the show.",
  },
];

const chatPool = [
  "mara: this overlay 🔥",
  "dev_kai: clean setup",
  "lun4r: how'd you build this",
  "pix_ie: subbed instantly",
  "zeeko: the transitions!!",
  "ashv: following now",
];

// Rotating event pool — mixes alert types instead of just followers.
const eventPool = [
  { color: "cyan", text: "new follower · jules_r" },
  { color: "magenta", text: "new sub · kito_dev" },
  { color: "amber", text: "tip · $5 from nova_streams" },
  { color: "text", text: "raid incoming · remi.codes (38 viewers)" },
  { color: "cyan", text: "new follower · ashv_live" },
  { color: "magenta", text: "new sub · pix_ie" },
];

function formatUptime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export default function Home() {
  const [viewers, setViewers] = useState(1204);
  const [chatFeed, setChatFeed] = useState<{ id: number; text: string }[]>([
    { id: 0, text: chatPool[0] },
    { id: 1, text: chatPool[1] },
  ]);
  const [chatCounter, setChatCounter] = useState(2);

  const [eventIdx, setEventIdx] = useState(0);
  const [showEvent, setShowEvent] = useState(true);

  const [uptime, setUptime] = useState(5417); // starts mid-stream, ~1h30m
  const [bitrate, setBitrate] = useState(6800);

  const subGoal = 50;
  const [subCount, setSubCount] = useState(34);

  // Viewer count drifts up and down like a real live stream.
  useEffect(() => {
    const id = setInterval(() => {
      setViewers((v) => {
        const delta = Math.floor(Math.random() * 15) - 6;
        return Math.max(980, v + delta);
      });
    }, 1600);
    return () => clearInterval(id);
  }, []);

  // Chat messages cycle in and out.
  useEffect(() => {
    const id = setInterval(() => {
      setChatFeed((feed) => {
        const next = chatPool[chatCounter % chatPool.length];
        return [...feed.slice(-1), { id: chatCounter, text: next }];
      });
      setChatCounter((c) => c + 1);
    }, 2400);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatCounter]);

  // Event alert rotates through follower / sub / tip / raid.
  useEffect(() => {
    const id = setInterval(() => {
      setShowEvent(false);
      const timeout = setTimeout(() => {
        setEventIdx((i) => (i + 1) % eventPool.length);
        setShowEvent(true);
      }, 200);
      return () => clearTimeout(timeout);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  // Stream uptime clock, ticks every second.
  useEffect(() => {
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Bitrate wobbles slightly to feel like a live health readout.
  useEffect(() => {
    const id = setInterval(() => {
      setBitrate((b) => {
        const delta = Math.floor(Math.random() * 200) - 100;
        return Math.max(5800, Math.min(7200, b + delta));
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  // Subscriber goal creeps toward the target, then resets.
  useEffect(() => {
    const id = setInterval(() => {
      setSubCount((c) => (c >= subGoal ? 20 : c + 1));
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const event = eventPool[eventIdx];
  const eventColorClass =
    event.color === "cyan"
      ? "border-cyan/40 text-cyan"
      : event.color === "magenta"
        ? "border-magenta/40 text-magenta"
        : event.color === "amber"
          ? "border-amber/40 text-amber"
          : "border-line text-text";

  return (
    <main
      className={`${chakra.variable} ${inter.variable} ${jetbrains.variable} min-h-screen bg-bg text-text font-body antialiased`}
    >
      {/* Nav */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="font-display text-3xl font-bold tracking-tight">
            Oruh<span className="text-magenta">Studio</span>
          </span>
          <nav className="hidden items-center gap-8 text-sm text-text-dim md:flex">
            <a href="#features" className="hover:text-text transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-text transition-colors">
              How it works
            </a>
          </nav>
          <a
            href="/home/dashboard"
            className="rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Enter
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-amber">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-magenta motion-reduce:animate-none" />
            Studio online
          </div>
          <h1 className="font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Build the stream you see in your head.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-text-dim">
            Design overlays, wire up widgets, and walk into every stream with
            a setup that looks like you hired a broadcast team, because you
            built one.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <a
              href="/app"
              className="rounded-md bg-magenta px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
            >
              Enter the studio →
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-text-dim underline decoration-line underline-offset-4 hover:text-text"
            >
              See what's inside
            </a>
          </div>
        </div>

        {/* Signature element: live, animated broadcast monitor */}
        <div className="relative rounded-xl border border-line bg-surface p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded bg-magenta/10 px-2 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-magenta">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-magenta motion-reduce:animate-none" />
              Live
            </span>
            <span className="font-mono text-[11px] tabular-nums text-text-dim">
              {uptime > 0 ? formatUptime(uptime) : "00:00:00"}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-text-dim">
              {viewers.toLocaleString()} watching
            </span>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-surface-2 to-bg">
            {/* lower-third */}
            <div className="absolute bottom-4 left-4 rounded bg-bg/80 px-3 py-2 backdrop-blur-sm">
              <p className="font-display text-sm font-bold">you.exe</p>
              <p className="font-mono text-[10px] text-amber">
                building a control room
              </p>
            </div>

            {/* chat widget — messages float in and drift out */}
            <div className="absolute right-3 top-3 flex w-36 flex-col gap-1.5 rounded bg-bg/80 p-2 backdrop-blur-sm">
              {chatFeed.map((msg) => (
                <p
                  key={msg.id}
                  className="animate-floatIn truncate font-mono text-[9px] text-text-dim"
                >
                  {msg.text}
                </p>
              ))}
            </div>

            {/* rotating event alert — follower / sub / tip / raid */}
            {showEvent && (
              <div
                key={eventIdx}
                className={`animate-floatIn absolute left-1/2 top-6 -translate-x-1/2 rounded-md border bg-surface px-3 py-1.5 ${eventColorClass}`}
              >
                <p className="font-mono text-[10px] font-medium">{event.text}</p>
              </div>
            )}

            {/* stream health readout, bottom-right */}
            <div className="absolute bottom-4 right-3 flex items-center gap-1.5 rounded bg-bg/80 px-2 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-cyan motion-reduce:animate-none" />
              <span className="font-mono text-[9px] text-text-dim">
                {bitrate.toLocaleString()} kbps · 1080p60
              </span>
            </div>
          </div>

          {/* subscriber goal bar, below the monitor */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-text-dim">
              <span>Sub goal</span>
              <span className="tabular-nums">
                {subCount} / {subGoal}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, (subCount / subGoal) * 100)}%` }}
              />
            </div>
          </div>

          <p className="mt-3 text-center font-mono text-[11px] text-text-dim">
            live preview — overlay builder
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-line bg-bg-alt">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Everything your stream needs, wired together.
          </h2>
          <p className="mt-3 max-w-lg text-text-dim">
            Four channels, one control room. Nothing here is a separate app
            pretending to be part of the same product.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.ch} className="bg-surface p-6">
                <span className="font-mono text-xs text-magenta">{f.ch}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-dim">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Three segments. No dead air.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {segments.map((s) => (
            <div key={s.label}>
              <span className="font-mono text-xs uppercase tracking-widest text-amber">
                {s.label}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-dim">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA banner */}
      <section className="border-t border-line bg-gradient-to-b from-surface to-bg">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Ready to go live?
          </h2>
          <p className="mt-3 text-text-dim">
            No credit card. No control room required.
          </p>
          <a
            href="/app"
            className="mt-8 inline-block rounded-md bg-magenta px-8 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
          >
            Enter the studio →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-text-dim">
          <span>© {new Date().getFullYear()} Oruh</span>
          <span className="font-mono">built for streamers</span>
        </div>
      </footer>
    </main>
  );
}