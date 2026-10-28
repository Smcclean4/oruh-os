"use client";

import { useEffect, useState } from "react";
import {
  parseSponsorships,
  seedSponsorships,
  todayISO,
  type Deliverable,
  type Sponsorship,
} from "@/lib/studio/sponsorships";

const STORAGE_KEY = "oruh.sponsorships.v1";

export function useSponsorships() {
  const [deals, setDeals] = useState<Sponsorship[]>(() => seedSponsorships());
  const [today, setToday] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setToday(todayISO());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = parseSponsorships(raw);
        if (parsed) setDeals(parsed);
      }
    } catch {
      // Keep the seed ledger if storage is blocked.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
  }, [deals, ready]);

  function addDeal(input: {
    brand: string;
    campaign: string;
    value: number;
    start: string;
    end: string;
    deliverableTitle?: string;
    deliverableDue?: string;
  }) {
    const id = crypto.randomUUID();
    const deliverables: Deliverable[] = [];
    if (input.deliverableTitle?.trim()) {
      deliverables.push({
        id: crypto.randomUUID(),
        title: input.deliverableTitle.trim(),
        due: input.deliverableDue || input.end,
        status: "todo",
      });
    }
    const deal: Sponsorship = {
      id,
      brand: input.brand.trim(),
      campaign: input.campaign.trim(),
      value: input.value,
      status: "active",
      payoutStatus: "pending",
      start: input.start,
      end: input.end,
      deliverables,
    };
    setDeals((current) => [deal, ...current]);
    return id;
  }

  function updateDeal(id: string, patch: Partial<Omit<Sponsorship, "id" | "deliverables">>) {
    setDeals((current) => current.map((deal) => (deal.id === id ? { ...deal, ...patch } : deal)));
  }

  function removeDeal(id: string) {
    setDeals((current) => current.filter((deal) => deal.id !== id));
  }

  function addDeliverable(dealId: string, title: string, due: string) {
    const item: Deliverable = {
      id: crypto.randomUUID(),
      title: title.trim(),
      due,
      status: "todo",
    };
    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId ? { ...deal, deliverables: [...deal.deliverables, item] } : deal,
      ),
    );
  }

  function setDeliverableStatus(dealId: string, deliverableId: string, status: Deliverable["status"]) {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              deliverables: deal.deliverables.map((item) =>
                item.id === deliverableId ? { ...item, status } : item,
              ),
            }
          : deal,
      ),
    );
  }

  function removeDeliverable(dealId: string, deliverableId: string) {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === dealId
          ? { ...deal, deliverables: deal.deliverables.filter((item) => item.id !== deliverableId) }
          : deal,
      ),
    );
  }

  return {
    deals,
    today,
    ready,
    addDeal,
    updateDeal,
    removeDeal,
    addDeliverable,
    setDeliverableStatus,
    removeDeliverable,
  };
}
