"use client";

import { useState } from "react";
import { Chakra_Petch, Inter, JetBrains_Mono } from "next/font/google";
import {
  Settings as SettingsIcon,
  User,
  Monitor,
  Bell,
  ShieldAlert,
  Save,
  Camera,
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

const RESOLUTIONS = ["1920x1080", "1280x720", "2560x1440"];
const TIMEZONES = ["Pacific Time (PT)", "Mountain Time (MT)", "Central Time (CT)", "Eastern Time (ET)", "UTC"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${checked ? "bg-cyan" : "bg-line"
        }`}
    >
      <span
        className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-bg transition-transform duration-200 ease-out"
        style={{ transform: checked ? "translateX(16px)" : "translateX(0px)" }}
      />
    </button>
  );
}

function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon size={16} className="text-magenta" />
        <h2 className="font-display text-sm font-semibold">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-text-dim">{label}</label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-text-dim">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-line bg-bg-alt px-3 py-2 text-sm text-text outline-none focus:border-cyan/50";

export default function SettingsPage() {
  const [isLive] = useState(true);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  // Account
  const [displayName, setDisplayName] = useState("Ede");
  const [email, setEmail] = useState("ede@example.com");

  // Stream defaults
  const [resolution, setResolution] = useState("1920x1080");
  const [defaultOverlay, setDefaultOverlay] = useState("Main Stream");
  const [timezone, setTimezone] = useState("Pacific Time (PT)");

  // Notifications
  const [notifyDisconnect, setNotifyDisconnect] = useState(true);
  const [notifySaved, setNotifySaved] = useState(false);
  const [notifyDigest, setNotifyDigest] = useState(true);

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
            <SettingsIcon size={20} className="text-magenta" />
            <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Settings</h1>
          </div>

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] ${saveState === "saved" ? "bg-cyan" : "bg-magenta"
              }`}
          >
            <Save size={14} />
            {saveState === "saved" ? "Saved" : "Save changes"}
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-10">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            <SettingsCard title="Account" icon={User}>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-bg-alt text-text-dim">
                  <Camera size={18} />
                </div>
                <button className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-text-dim hover:text-text">
                  Change avatar
                </button>
              </div>

              <Field label="Display name">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <button className="w-fit rounded-md border border-line px-3 py-1.5 font-mono text-[11px] text-text-dim hover:text-text">
                Change password
              </button>
            </SettingsCard>

            <SettingsCard title="Stream defaults" icon={Monitor}>
              <Field label="Default overlay resolution">
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className={inputClass}
                >
                  {RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Default overlay">
                <input
                  value={defaultOverlay}
                  onChange={(e) => setDefaultOverlay(e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Time zone">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className={inputClass}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </Field>
            </SettingsCard>

            <SettingsCard title="Notifications" icon={Bell}>
              <ToggleRow
                label="Integration disconnected"
                desc="Alert me when a connected platform loses connection."
                checked={notifyDisconnect}
                onChange={setNotifyDisconnect}
              />
              <ToggleRow
                label="Overlay saved"
                desc="Confirm each time an overlay is saved."
                checked={notifySaved}
                onChange={setNotifySaved}
              />
              <ToggleRow
                label="Weekly digest"
                desc="Summary email of stream activity and stats."
                checked={notifyDigest}
                onChange={setNotifyDigest}
              />
            </SettingsCard>

            <SettingsCard title="Danger zone" icon={ShieldAlert}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm">Disconnect all integrations</p>
                  <p className="text-xs text-text-dim">
                    Revokes access for every connected platform.
                  </p>
                </div>
                <button className="rounded-md border border-magenta/50 px-3 py-1.5 font-mono text-[11px] text-magenta hover:bg-magenta/10">
                  Disconnect all
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
                <div>
                  <p className="text-sm">Delete account</p>
                  <p className="text-xs text-text-dim">
                    Permanently deletes your account, overlays, and widget data.
                  </p>
                </div>
                <button className="rounded-md border border-magenta/50 px-3 py-1.5 font-mono text-[11px] text-magenta hover:bg-magenta/10">
                  Delete account
                </button>
              </div>
            </SettingsCard>
          </div>
        </main>
      </div>
    </div>
  );
}