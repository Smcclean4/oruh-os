// components/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/home/dashboard" },
  { label: "Overlay Builder", href: "/home/overlaybuilder" },
  { label: "Widgets", href: "/home/widgets" },
  { label: "Integrations", href: "/home/integrations" },
  { label: "Settings", href: "/home/settings" },
];

export default function Sidebar({ isLive = true }: { isLive?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-line bg-bg-alt md:flex md:flex-col">
      <div className="border-b border-line px-6 py-5">
        <a href="/home">
          <span className="font-display text-2xl font-bold tracking-tight">
            Oruh<span className="text-magenta">Studio</span>
          </span>
        </a>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <a
              key={item.label}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-surface text-text" : "text-text-dim hover:bg-surface hover:text-text"
                }`}
            >
              {item.label}
            </a>
          );
        })}
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
  );
}