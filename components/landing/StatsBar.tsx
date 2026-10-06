const stats = [
  { num: "0", label: "CREATORS ON THE WAITLIST" },
  { num: "0", label: "OVERLAYS RENDERED IN TESTING" },
  { num: "0", label: "TOOLS REPLACED WITH ONE LOGIN" },
  { num: "99.9%", label: "UPTIME TARGET AT LAUNCH" },
];

export default function StatsBar() {
  return (
    <div className="border-y border-line py-[34px]">
      <div className="flex flex-wrap justify-between gap-6">
        {stats.map((s) => (
          <div key={s.label}>
            <span className="font-mono text-[26px] font-semibold block">
              {s.num}
            </span>
            <span className="text-[12.5px] text-text-faint tracking-[0.5px] mt-1 block">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
