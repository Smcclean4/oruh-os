const tiers = [
  { name: "Creator", tag: "CORE MODULES", featured: false },
  { name: "Pro", tag: "+ AI CLIPS, CREATOR DASHBOARD", pro: true },
  { name: "Partner", tag: "+ WHITE-LABEL, PRIORITY SUPPORT", featured: true },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-[88px]">
      <div
        className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 items-center rounded-2xl border border-line p-8 sm:p-11"
        style={{
          background: "linear-gradient(150deg, #141827, #0F1220)",
        }}
      >
        <div>
          <h3 className="font-display text-2xl mb-3">
            Founding member pricing, locked for life.
          </h3>
          <p className="text-text-dim text-[14.5px] leading-[1.6] mb-5">
            Join before launch and your rate never goes up, even as we add
            more modules. First cohort also gets first access to new features
            and a direct line to the team building them.
          </p>
          <a
            href="#join"
            className="inline-block bg-gradient-to-br from-magenta to-[#C91E5C] text-white font-semibold px-6 py-3.5 rounded-lg text-[14.5px] hover:shadow-[0_4px_24px_rgba(255,45,120,0.4)] transition-shadow"
          >
            Reserve your spot
          </a>
        </div>
        <div>
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`flex justify-between items-center py-3.5 text-sm ${i !== tiers.length - 1 ? "border-b border-line" : ""
                }`}
            >
              <span
                className={`font-display font-semibold ${t.featured ? "text-amber" : t.pro ? "text-cyan" : "text-white"
                  }`}
              >
                {t.name}
              </span>
              <span className="font-mono text-[11px] text-text-faint">
                {t.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
