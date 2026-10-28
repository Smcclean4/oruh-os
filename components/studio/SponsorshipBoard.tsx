"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  DEAL_LABEL,
  DELIVERABLE_LABEL,
  NEXT_DELIVERABLE,
  PAYOUT_LABEL,
  type DealStatus,
  type PayoutStatus,
  type Sponsorship,
  formatDay,
  formatMoney,
  isLate,
  progress,
  summarize,
} from "@/lib/studio/sponsorships";
import { useSponsorships } from "./useSponsorships";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "payout", label: "Unpaid" },
  { id: "late", label: "Late" },
] as const;

type FilterId = (typeof FILTERS)[number]["id"];

const inputClass =
  "w-full rounded-md border border-line bg-bg-alt px-3 py-2 text-sm text-text outline-none focus:border-cyan/50";

const payoutTone: Record<PayoutStatus, string> = {
  pending: "border-amber/40 text-amber",
  invoiced: "border-magenta/40 text-magenta",
  paid: "border-cyan/40 text-cyan",
};

const dealTone: Record<DealStatus, string> = {
  negotiating: "text-amber",
  active: "text-cyan",
  completed: "text-text-dim",
};

function matches(deal: Sponsorship, filter: FilterId, today: string | null) {
  if (filter === "active") return deal.status === "active";
  if (filter === "payout") return deal.payoutStatus !== "paid" && deal.status !== "negotiating";
  if (filter === "late") {
    return today ? deal.deliverables.some((item) => isLate(item, today)) : false;
  }
  return true;
}

export default function SponsorshipBoard() {
  const {
    deals,
    today,
    addDeal,
    updateDeal,
    removeDeal,
    addDeliverable,
    setDeliverableStatus,
    removeDeliverable,
  } = useSponsorships();
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string | "new">(deals[0]?.id ?? "new");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deliverableTitle, setDeliverableTitle] = useState("");
  const [deliverableDue, setDeliverableDue] = useState("");
  const [formError, setFormError] = useState("");
  const [draft, setDraft] = useState({
    brand: "",
    campaign: "",
    value: "",
    start: "",
    end: "",
    deliverableTitle: "",
    deliverableDue: "",
  });

  const stats = summarize(deals, today);
  const visible = useMemo(
    () => deals.filter((deal) => matches(deal, filter, today)),
    [deals, filter, today],
  );
  const selected = deals.find((deal) => deal.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId !== "new" && !deals.some((deal) => deal.id === selectedId)) {
      setSelectedId(deals[0]?.id ?? "new");
    }
  }, [deals, selectedId]);

  function selectDeal(id: string) {
    setSelectedId(id);
    setConfirmDelete(false);
    setFormError("");
  }

  function submitDeal(event: FormEvent) {
    event.preventDefault();
    const value = Number(draft.value);
    if (!draft.brand.trim() || !draft.campaign.trim()) {
      setFormError("Brand and campaign are required.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setFormError("Enter a payout amount greater than zero.");
      return;
    }
    if (!draft.start || !draft.end) {
      setFormError("Add a start and end date.");
      return;
    }
    const id = addDeal({
      brand: draft.brand,
      campaign: draft.campaign,
      value,
      start: draft.start,
      end: draft.end,
      deliverableTitle: draft.deliverableTitle,
      deliverableDue: draft.deliverableDue || draft.end,
    });
    setDraft({
      brand: "",
      campaign: "",
      value: "",
      start: "",
      end: "",
      deliverableTitle: "",
      deliverableDue: "",
    });
    setFormError("");
    setSelectedId(id);
  }

  function submitDeliverable(event: FormEvent) {
    event.preventDefault();
    if (!selected || !deliverableTitle.trim() || !deliverableDue) return;
    addDeliverable(selected.id, deliverableTitle, deliverableDue);
    setDeliverableTitle("");
    setDeliverableDue("");
  }

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5 md:px-10">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight sm:text-2xl">Sponsorships</h1>
          <p className="mt-0.5 font-mono text-[11px] text-text-dim">
            Deals, deliverables, and payouts
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSelectedId("new");
            setConfirmDelete(false);
            setFormError("");
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-magenta px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]"
        >
          <Plus size={15} />
          New deal
        </button>
      </header>

      <main className="px-6 py-8 md:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Outstanding" value={formatMoney(stats.outstanding)} hint="Invoiced or still owed" />
          <Stat label="Pipeline" value={formatMoney(stats.pipeline)} hint="Active and negotiating" />
          <Stat label="Open deliverables" value={String(stats.openCount)} hint={stats.lateCount ? `${stats.lateCount} late` : "Nothing late"} />
          <Stat label="Paid" value={formatMoney(stats.paid)} hint="Cleared campaigns" />
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-xl border border-line bg-surface">
            <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3">
              {FILTERS.map((item) => {
                const active = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                      active
                        ? "border-cyan/50 bg-cyan/10 text-cyan"
                        : "border-line text-text-dim hover:text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {visible.length === 0 ? (
              <p className="px-5 py-10 text-sm text-text-dim">No deals in this view.</p>
            ) : (
              <ul>
                {visible.map((deal) => {
                  const done = deal.deliverables.filter((item) => item.status === "approved").length;
                  const lateCount = today
                    ? deal.deliverables.filter((item) => isLate(item, today)).length
                    : 0;
                  const active = deal.id === selectedId;
                  return (
                    <li key={deal.id} className="border-b border-line last:border-b-0">
                      <button
                        type="button"
                        onClick={() => selectDeal(deal.id)}
                        className={`flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors ${
                          active ? "bg-bg-alt" : "hover:bg-bg-alt/70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-display text-sm font-semibold">{deal.brand}</p>
                            <p className="mt-0.5 text-xs text-text-dim">{deal.campaign}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-sm tabular-nums">{formatMoney(deal.value)}</p>
                            <p className={`mt-1 inline-flex rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${payoutTone[deal.payoutStatus]}`}>
                              {PAYOUT_LABEL[deal.payoutStatus]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-magenta to-cyan"
                              style={{ width: `${Math.round(progress(deal) * 100)}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px] text-text-faint">
                            {done}/{deal.deliverables.length}
                            {lateCount > 0 ? ` · ${lateCount} late` : ""}
                            {" · "}
                            <span className={dealTone[deal.status]}>{DEAL_LABEL[deal.status]}</span>
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <aside className="rounded-xl border border-line bg-surface p-5 [color-scheme:dark]">
            {selectedId === "new" || !selected ? (
              <form onSubmit={submitDeal} className="flex flex-col gap-3">
                <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">New deal</p>
                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  Brand
                  <input
                    className={inputClass}
                    value={draft.brand}
                    onChange={(event) => setDraft({ ...draft, brand: event.target.value })}
                    placeholder="Razer"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  Campaign
                  <input
                    className={inputClass}
                    value={draft.campaign}
                    onChange={(event) => setDraft({ ...draft, campaign: event.target.value })}
                    placeholder="Spring keyboard drop"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  Payout (USD)
                  <input
                    className={inputClass}
                    inputMode="decimal"
                    value={draft.value}
                    onChange={(event) => setDraft({ ...draft, value: event.target.value })}
                    placeholder="4500"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                    Start
                    <input
                      type="date"
                      className={inputClass}
                      value={draft.start}
                      onChange={(event) => setDraft({ ...draft, start: event.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                    End
                    <input
                      type="date"
                      className={inputClass}
                      value={draft.end}
                      onChange={(event) => setDraft({ ...draft, end: event.target.value })}
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  First deliverable
                  <input
                    className={inputClass}
                    value={draft.deliverableTitle}
                    onChange={(event) => setDraft({ ...draft, deliverableTitle: event.target.value })}
                    placeholder="60s mid-roll read"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  Deliverable due
                  <input
                    type="date"
                    className={inputClass}
                    value={draft.deliverableDue}
                    onChange={(event) => setDraft({ ...draft, deliverableDue: event.target.value })}
                  />
                </label>
                {formError ? <p className="text-xs text-amber">{formError}</p> : null}
                <button
                  type="submit"
                  className="mt-1 rounded-md bg-magenta px-3 py-2 text-sm font-semibold text-bg"
                >
                  Add to ledger
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <p className="font-display text-lg font-semibold">{selected.brand}</p>
                  <p className="mt-0.5 text-sm text-text-dim">{selected.campaign}</p>
                  <p className="mt-2 font-mono text-xs text-text-faint">
                    {formatDay(selected.start)} – {formatDay(selected.end)}
                  </p>
                </div>

                <label className="flex flex-col gap-1.5 text-xs text-text-dim">
                  Deal status
                  <select
                    className={inputClass}
                    value={selected.status}
                    onChange={(event) =>
                      updateDeal(selected.id, { status: event.target.value as DealStatus })
                    }
                  >
                    {(Object.keys(DEAL_LABEL) as DealStatus[]).map((status) => (
                      <option key={status} value={status}>
                        {DEAL_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <p className="mb-2 text-xs text-text-dim">Payout · {formatMoney(selected.value)}</p>
                  <div className="grid grid-cols-3 gap-1 rounded-md border border-line p-1">
                    {(Object.keys(PAYOUT_LABEL) as PayoutStatus[]).map((status) => {
                      const active = selected.payoutStatus === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => updateDeal(selected.id, { payoutStatus: status })}
                          className={`rounded border px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider ${
                            active ? payoutTone[status] : "border-transparent text-text-dim"
                          }`}
                        >
                          {PAYOUT_LABEL[status]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs text-text-dim">
                    Deliverables · {selected.deliverables.filter((item) => item.status === "approved").length}/
                    {selected.deliverables.length}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {selected.deliverables.map((item) => {
                      const late = today ? isLate(item, today) : false;
                      return (
                        <li key={item.id} className="rounded-md border border-line bg-bg-alt px-3 py-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm">{item.title}</p>
                            <button
                              type="button"
                              aria-label={`Remove ${item.title}`}
                              onClick={() => removeDeliverable(selected.id, item.id)}
                              className="text-text-faint hover:text-text"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className={`font-mono text-[10px] uppercase tracking-wider ${late ? "text-amber" : "text-text-faint"}`}>
                              {late ? "Late · " : ""}
                              {formatDay(item.due)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setDeliverableStatus(selected.id, item.id, NEXT_DELIVERABLE[item.status])
                              }
                              className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-dim hover:text-text"
                            >
                              {DELIVERABLE_LABEL[item.status]}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <form onSubmit={submitDeliverable} className="mt-3 flex flex-col gap-2">
                    <input
                      className={inputClass}
                      value={deliverableTitle}
                      onChange={(event) => setDeliverableTitle(event.target.value)}
                      placeholder="Add a deliverable"
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        required
                        className={inputClass}
                        value={deliverableDue}
                        onChange={(event) => setDeliverableDue(event.target.value)}
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-md border border-line px-3 text-xs font-medium text-text-dim hover:text-text"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!confirmDelete) {
                      setConfirmDelete(true);
                      return;
                    }
                    const next = deals.find((deal) => deal.id !== selected.id);
                    removeDeal(selected.id);
                    setSelectedId(next?.id ?? "new");
                    setConfirmDelete(false);
                  }}
                  className="text-left font-mono text-[11px] uppercase tracking-wider text-text-faint hover:text-amber"
                >
                  {confirmDelete ? "Confirm delete" : "Delete deal"}
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="font-mono text-[11px] uppercase tracking-widest text-text-dim">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-text-faint">{hint}</p>
    </div>
  );
}
