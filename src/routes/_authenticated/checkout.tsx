import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { readCheckout, clearCheckout, type CheckoutPayload } from "@/lib/checkout";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Tesla" }] }),
  component: CheckoutPage,
});

const METHODS = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "usdt", label: "USDT (TRC20)" },
  { id: "btc", label: "Bitcoin" },
  { id: "eth", label: "Ethereum" },
  { id: "bank", label: "Bank Transfer" },
];

function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<CheckoutPayload | null>(null);
  const [method, setMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPayload(readCheckout());
  }, []);

  const total = useMemo(
    () => (payload ? payload.amountUsd * payload.quantity : 0),
    [payload],
  );

  async function confirm() {
    if (!payload || !user) return;
    setSubmitting(true);
    setError(null);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      category: payload.category,
      item_name: payload.itemName,
      amount_usd: total,
      quantity: payload.quantity,
      status: "pending",
      metadata: { method, ...(payload.metadata ?? {}) },
    });
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    clearCheckout();
    navigate({ to: "/account" });
  }

  if (!payload) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">No item in checkout</h1>
        <p className="text-muted-foreground mb-6">Pick something from the marketplace to begin.</p>
        <Link to="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm uppercase tracking-widest">Browse</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Secure Checkout</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-8">Confirm your order</h1>

      <div className="rounded-3xl border border-border p-8 bg-background mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{payload.category}</p>
            <h2 className="text-2xl font-semibold tracking-tight">{payload.itemName}</h2>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Qty</p>
            <p className="text-2xl font-semibold tabular-nums">{payload.quantity}</p>
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-border">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-3xl font-semibold tabular-nums">${total.toLocaleString()}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-border p-8 bg-background mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Payment method</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {METHODS.map((m) => (
            <label key={m.id} className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-colors ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}>
              <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-primary" />
              <span className="text-sm font-medium">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-rose-600 mb-4">{error}</p>}

      <div className="flex gap-3">
        <button onClick={confirm} disabled={submitting} className="flex-1 py-4 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest disabled:opacity-60">
          {submitting ? "Processing…" : `Pay $${total.toLocaleString()}`}
        </button>
        <Link to="/account" className="px-6 py-4 rounded-full border border-border text-sm font-medium uppercase tracking-widest hover:bg-accent">
          Cancel
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Your order is recorded immediately. A specialist will reach out to finalize settlement and fulfillment.
      </p>
    </div>
  );
}
