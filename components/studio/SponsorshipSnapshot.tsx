"use client";

import Link from "next/link";
import { formatDay, formatMoney, isLate, summarize } from "@/lib/studio/sponsorships";
import { useSponsorships } from "./useSponsorships";

export default function SponsorshipSnapshot() {
  const { deals, today } = useSponsorships();
  const stats = summarize(deals, today);
  const upcoming = deals
    .flatMap((deal) =>
      deal.deliverables
        .filter((item) => item.status !== "approved")
        .map((item) => ({ ...item, brand: deal.brand })),
    )
    .sort((a, b) => a.due.localeCompare(b.due))
    .slice(0, 3);

  return (
    <section className="mt-8 rounded-xl border border-line bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Sponsorships</h2>
          <p className="mt-1 text-xs text-text-dim">
            Deliverables still open, and money that hasn&apos;t landed yet.
          </p>
        </div>
        <Link
          href="/home/sponsorships"
          className="rounded-md border border-line px-3 py-1.5 text-xs font-medium text-text-dim transition-colors hover:border-magenta/40 hover:text-text"
        >
          Open tracker
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-bg-alt px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">Outstanding</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums">{formatMoney(stats.outstanding)}</p>
        </div>
        <div className="rounded-lg border border-line bg-bg-alt px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">Open deliverables</p>
          <p className="mt-1 font-display text-xl font-bold tabular-nums">{stats.openCount}</p>
        </div>
        <div className="rounded-lg border border-line bg-bg-alt px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim">Late</p>
          <p className={`mt-1 font-display text-xl font-bold tabular-nums ${stats.lateCount > 0 ? "text-amber" : ""}`}>
            {stats.lateCount}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {upcoming.map((item) => {
          const late = today ? isLate(item, today) : false;
          return (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-md border border-line bg-bg-alt px-3 py-2">
              <span className="truncate text-sm">
                <span className="text-text-dim">{item.brand}</span>
                <span className="mx-2 text-text-faint">·</span>
                {item.title}
              </span>
              <span className={`shrink-0 font-mono text-[10px] uppercase tracking-wider ${late ? "text-amber" : "text-text-dim"}`}>
                {late ? "Late · " : ""}
                {formatDay(item.due)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
