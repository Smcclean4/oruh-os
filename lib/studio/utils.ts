export function formatUptime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function eventColorClass(color: string) {
  if (color === "cyan") return "border-cyan/40 text-cyan";
  if (color === "magenta") return "border-magenta/40 text-magenta";
  if (color === "amber") return "border-amber/40 text-amber";
  return "border-line text-text";
}
