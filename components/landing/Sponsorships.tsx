import {
  DEAL_LABEL,
  PAYOUT_LABEL,
  formatDay,
  formatMoney,
  progress,
  seedSponsorships,
  summarize,
  todayISO,
} from "@/lib/studio/sponsorships";

const payoutTone: Record<string, string> = {
  pending: "text-amber",
  invoiced: "text-magenta",
  paid: "text-cyan",
};

export default function Sponsorships() {
  const deals = seedSponsorships();
  const stats = summarize(deals, todayISO());
  const preview = deals.slice(0, 3);

  return (
    <section id="sponsors" className="py-[88px]">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="mb-3.5 font-mono text-xs tracking-[1.5px] text-magenta">
            // SPONSORS
          </div>
          <h2 className="mb-3.5 font-display text-[26px] font-bold leading-[1.15] sm:text-[32px] lg:text-[36px]">
            The deal, the deliverable, and the payout. One ledger.
          </h2>
          <p className="mb-6 max-w-[460px] text-[15.5px] leading-[1.6] text-text-dim">
            Brand work used to live in a spreadsheet next to your stream deck.
            Oruh keeps every campaign beside the rest of the control room:
            what you still owe, what&apos;s late, and what a sponsor hasn&apos;t paid.
          </p>
          <ul className="mb-8 flex flex-col gap-3 text-[14px] text-text-dim">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
              Deliverables with deadlines, from first read to approved
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
              Payouts marked pending, invoiced, or paid
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-magenta" />
              A live total of money still outstanding
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#join"
              className="inline-block rounded-lg bg-gradient-to-br from-magenta to-[#C91E5C] px-6 py-3.5 text-[14.5px] font-semibold text-white transition-shadow hover:shadow-[0_4px_24px_rgba(255,45,120,0.4)]"
            >
              Reserve your spot
            </a>
            <a
              href="/home/sponsorships"
              className="text-[14px] font-medium text-text-dim underline decoration-line underline-offset-4 transition-colors hover:text-text"
            >
              Open the tracker
            </a>
          </div>
        </div>

        <div
          className="rounded-2xl border border-line p-5 sm:p-6"
          style={{ background: "linear-gradient(160deg, #141827, #0F1220)" }}
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[1.4px] text-text-faint">
                Sponsor ledger
              </p>
              <p className="mt-1 font-display text-2xl font-bold tabular-nums">
                {formatMoney(stats.outstanding)}
                <span className="ml-2 text-sm font-medium text-text-dim">outstanding</span>
              </p>
            </div>
            <p className="text-right font-mono text-[11px] leading-relaxed text-text-faint">
              {stats.openCount} open
              <br />
              {stats.lateCount} late
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {preview.map((deal) => {
              const done = deal.deliverables.filter((item) => item.status === "approved").length;
              const width = `${Math.round(progress(deal) * 100)}%`;
              return (
                <div key={deal.id} className="rounded-xl border border-line bg-bg/60 px-4 py-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-sm font-semibold">{deal.brand}</p>
                      <p className="mt-0.5 text-[12.5px] text-text-dim">{deal.campaign}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[13px] tabular-nums">{formatMoney(deal.value)}</p>
                      <p className={`mt-0.5 font-mono text-[10px] uppercase tracking-wider ${payoutTone[deal.payoutStatus]}`}>
                        {PAYOUT_LABEL[deal.payoutStatus]}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan"
                        style={{ width }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-text-faint">
                      {done}/{deal.deliverables.length} · {DEAL_LABEL[deal.status]} · {formatDay(deal.end)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
