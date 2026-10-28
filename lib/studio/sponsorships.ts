export type DeliverableStatus = "todo" | "in_progress" | "submitted" | "approved";
export type PayoutStatus = "pending" | "invoiced" | "paid";
export type DealStatus = "negotiating" | "active" | "completed";

export type Deliverable = {
  id: string;
  title: string;
  due: string;
  status: DeliverableStatus;
};

export type Sponsorship = {
  id: string;
  brand: string;
  campaign: string;
  value: number;
  status: DealStatus;
  payoutStatus: PayoutStatus;
  start: string;
  end: string;
  deliverables: Deliverable[];
};

export const DELIVERABLE_LABEL: Record<DeliverableStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  submitted: "Submitted",
  approved: "Approved",
};

export const NEXT_DELIVERABLE: Record<DeliverableStatus, DeliverableStatus> = {
  todo: "in_progress",
  in_progress: "submitted",
  submitted: "approved",
  approved: "todo",
};

export const PAYOUT_LABEL: Record<PayoutStatus, string> = {
  pending: "Pending",
  invoiced: "Invoiced",
  paid: "Paid",
};

export const DEAL_LABEL: Record<DealStatus, string> = {
  negotiating: "Negotiating",
  active: "Active",
  completed: "Completed",
};

const SEED: Sponsorship[] = [
  {
    id: "razer-spring",
    brand: "Razer",
    campaign: "Spring keyboard drop",
    value: 4500,
    status: "active",
    payoutStatus: "invoiced",
    start: "2026-10-06",
    end: "2026-11-18",
    deliverables: [
      { id: "razer-mid", title: "60s mid-roll read", due: "2026-10-12", status: "approved" },
      { id: "razer-stream", title: "Dedicated keyboard stream", due: "2026-10-30", status: "in_progress" },
      { id: "razer-thread", title: "Launch thread + link in bio", due: "2026-11-08", status: "todo" },
    ],
  },
  {
    id: "gfuel-energy",
    brand: "GFUEL",
    campaign: "Energy month",
    value: 2200,
    status: "active",
    payoutStatus: "pending",
    start: "2026-10-01",
    end: "2026-11-02",
    deliverables: [
      { id: "gfuel-panel", title: "Panel logo for the month", due: "2026-10-01", status: "approved" },
      { id: "gfuel-mentions", title: "Three on-stream mentions", due: "2026-10-24", status: "submitted" },
    ],
  },
  {
    id: "secretlab-chair",
    brand: "Secretlab",
    campaign: "Chair giveaway",
    value: 6000,
    status: "negotiating",
    payoutStatus: "pending",
    start: "2026-11-01",
    end: "2026-12-01",
    deliverables: [
      { id: "secret-unbox", title: "Unboxing segment", due: "2026-11-12", status: "todo" },
      { id: "secret-give", title: "Viewer giveaway stream", due: "2026-11-20", status: "todo" },
    ],
  },
  {
    id: "nord-q3",
    brand: "NordVPN",
    campaign: "Q3 integration",
    value: 3800,
    status: "completed",
    payoutStatus: "paid",
    start: "2026-08-01",
    end: "2026-09-30",
    deliverables: [
      { id: "nord-read", title: "Integration read", due: "2026-08-18", status: "approved" },
      { id: "nord-end", title: "End screen for 30 days", due: "2026-09-30", status: "approved" },
    ],
  },
];

export function seedSponsorships(): Sponsorship[] {
  return JSON.parse(JSON.stringify(SEED)) as Sponsorship[];
}

export function todayISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDay(iso: string) {
  const [, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`;
}

export function isLate(deliverable: Deliverable, today: string) {
  return deliverable.status !== "approved" && deliverable.due < today;
}

export function progress(deal: Sponsorship) {
  if (deal.deliverables.length === 0) return 0;
  const done = deal.deliverables.filter((item) => item.status === "approved").length;
  return done / deal.deliverables.length;
}

export function summarize(deals: Sponsorship[], today: string | null) {
  const outstanding = deals
    .filter((deal) => deal.payoutStatus !== "paid" && deal.status !== "negotiating")
    .reduce((sum, deal) => sum + deal.value, 0);
  const pipeline = deals
    .filter((deal) => deal.status !== "completed")
    .reduce((sum, deal) => sum + deal.value, 0);
  const paid = deals
    .filter((deal) => deal.payoutStatus === "paid")
    .reduce((sum, deal) => sum + deal.value, 0);
  const open = deals.flatMap((deal) => deal.deliverables).filter((item) => item.status !== "approved");
  const late = today ? open.filter((item) => isLate(item, today)) : [];

  return {
    activeCount: deals.filter((deal) => deal.status === "active").length,
    outstanding,
    pipeline,
    paid,
    openCount: open.length,
    lateCount: late.length,
  };
}

export function parseSponsorships(raw: string): Sponsorship[] | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    const valid = parsed.every((deal) => {
      if (!deal || typeof deal !== "object") return false;
      const row = deal as Sponsorship;
      return (
        typeof row.id === "string" &&
        typeof row.brand === "string" &&
        typeof row.campaign === "string" &&
        typeof row.value === "number" &&
        Array.isArray(row.deliverables)
      );
    });
    return valid ? (parsed as Sponsorship[]) : null;
  } catch {
    return null;
  }
}
