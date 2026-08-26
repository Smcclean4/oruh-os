const modules = [
  {
    tag: "OVERLAYS",
    title: "Premium OBS overlays",
    copy: "Motion-designed overlays that move like your brand, not a marketplace template.",
  },
  // {
  //   tag: "WIDGETS",
  //   title: "Live widgets",
  //   copy: "Alerts, goal bars, and stat trackers that update themselves the second something happens.",
  // },
  {
    tag: "WEBSITE",
    title: "Stream websites",
    copy: "A real site that's actually yours; schedule, socials, merch, and one link for everything.",
  },
  // {
  //   tag: "CLIP AI",
  //   title: "AI clip generator",
  //   copy: "Catches your best moments as they happen and cuts them into clips ready to post.",
  // },
  // {
  //   tag: "COMMUNITY",
  //   title: "Community games",
  //   copy: "Chat games and challenges your viewers can drop into mid-stream, no extra app required.",
  // },
  // {
  //   tag: "DISCORD",
  //   title: "Discord bot",
  //   copy: "Roles, alerts, and community tools synced straight from your stream, automatically.",
  // },
  {
    tag: "DASHBOARD",
    title: "Creator dashboard",
    copy: "One home base for your stats, deliverables, deadlines, and every sponsorship payout. No spreadsheet required.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-[88px]">
      <div className="max-w-[560px] mb-12">
        <div className="font-mono text-xs tracking-[1.5px] text-magenta mb-3.5">
          // MODULES
        </div>
        <h2 className="font-display text-[26px] sm:text-[32px] lg:text-[36px] font-bold leading-[1.15] mb-3.5">
          Every module a streamer actually needs. Already wired together.
        </h2>
        <p className="text-text-dim text-[15.5px] leading-[1.6]">
          No more juggling five subscriptions and three Discord bots that
          don&apos;t talk to each other. Toggle on what you need, it all
          shares the same data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-[14px] overflow-hidden">
        {modules.map((m) => (
          <div
            key={m.tag}
            className="bg-bg-alt hover:bg-surface transition-colors px-[26px] py-7"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11.5px] tracking-[1.2px] text-text-faint">
                {m.tag}
              </span>
              <span className="w-[34px] h-[18px] rounded-full bg-magenta/[0.18] border border-magenta-dim relative flex-shrink-0">
                <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-magenta shadow-[0_0_6px_#FF2D78]" />
              </span>
            </div>
            <h3 className="font-display text-[17px] font-semibold mb-2">
              {m.title}
            </h3>
            <p className="text-[13.5px] text-text-dim leading-[1.55]">
              {m.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
