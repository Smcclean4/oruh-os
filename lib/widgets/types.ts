import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  MessageSquare,
  Target,
  UserPlus,
  DollarSign,
  Video,
  Type as TypeIcon,
} from "lucide-react";

export interface WidgetTypeDef {
  id: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  w: number;
  h: number;
  desc: string;
}

export const WIDGET_TYPES: WidgetTypeDef[] = [
  { id: "alert", label: "Alert Box", icon: AlertTriangle, colorClass: "magenta", w: 220, h: 70, desc: "New follower / sub pop-up" },
  { id: "chat", label: "Chat Feed", icon: MessageSquare, colorClass: "cyan", w: 200, h: 240, desc: "Live chat overlay" },
  { id: "goal", label: "Follower Goal", icon: Target, colorClass: "amber", w: 260, h: 60, desc: "Progress bar toward a goal" },
  { id: "recent", label: "Recent Follower", icon: UserPlus, colorClass: "magenta", w: 220, h: 56, desc: "Latest follower ticker" },
  { id: "donation", label: "Donation Ticker", icon: DollarSign, colorClass: "amber", w: 240, h: 56, desc: "Scrolling donation feed" },
  { id: "webcam", label: "Webcam Frame", icon: Video, colorClass: "cyan", w: 220, h: 165, desc: "Border frame for cam" },
  { id: "text", label: "Text / Ticker", icon: TypeIcon, colorClass: "cyan", w: 260, h: 44, desc: "Custom scrolling text" },
];

// Maps a token name to concrete utility classes — Tailwind needs
// full class strings statically discoverable (no dynamic `text-${x}`).
export function colorClasses(colorClass: string) {
  switch (colorClass) {
    case "magenta":
      return { text: "text-magenta", border: "border-magenta/50", bg: "bg-magenta/10", solidBg: "bg-magenta" };
    case "amber":
      return { text: "text-amber", border: "border-amber/50", bg: "bg-amber/10", solidBg: "bg-amber" };
    default:
      return { text: "text-cyan", border: "border-cyan/50", bg: "bg-cyan/10", solidBg: "bg-cyan" };
  }
}