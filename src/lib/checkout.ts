import type { NavigateFn } from "@tanstack/react-router";

export type CheckoutCategory = "crypto" | "ipo" | "vehicle" | "robot";

export interface CheckoutPayload {
  category: CheckoutCategory;
  itemName: string;
  amountUsd: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}

const KEY = "tesla.checkout.pending";

export function stashCheckout(p: CheckoutPayload) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  }
}

export function readCheckout(): CheckoutPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as CheckoutPayload; } catch { return null; }
}

export function clearCheckout() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY);
}

export function startCheckout(
  payload: CheckoutPayload,
  opts: { isAuthed: boolean; navigate: NavigateFn },
) {
  stashCheckout(payload);
  if (!opts.isAuthed) {
    opts.navigate({ to: "/login" });
  } else {
    opts.navigate({ to: "/checkout" });
  }
}
