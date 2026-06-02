import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { readCheckout, clearCheckout, type CheckoutPayload } from "@/lib/checkout";
import { PaymentModal, type PaymentItem } from "@/components/PaymentModal";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Tesla" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const [payload, setPayload] = useState<CheckoutPayload | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const p = readCheckout();
    setPayload(p);
    if (p) setOpen(true);
  }, []);

  if (!payload) {
    return (
      <div className="pt-24 max-w-xl mx-auto px-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">No item in checkout</h1>
        <p className="text-muted-foreground mb-6">Pick something from the marketplace to begin.</p>
        <Link to="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm uppercase tracking-widest">Browse</Link>
      </div>
    );
  }

  const item: PaymentItem = {
    category: payload.category,
    itemName: payload.itemName,
    amountUsd: payload.amountUsd * payload.quantity,
    quantity: payload.quantity,
    metadata: payload.metadata,
  };

  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Secure Checkout</p>
      <h1 className="text-4xl font-semibold tracking-tight mb-8">{payload.itemName}</h1>
      <div className="rounded-3xl border border-border p-8 bg-background mb-6">
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-sm text-muted-foreground">Quantity</span>
          <span className="text-lg font-semibold tabular-nums">{payload.quantity}</span>
        </div>
        <div className="flex justify-between items-baseline pt-3 border-t border-border">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-3xl font-semibold tabular-nums">${item.amountUsd.toLocaleString()}</span>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest"
      >
        Pay
      </button>

      <PaymentModal
        item={item}
        open={open}
        onClose={() => {
          setOpen(false);
          clearCheckout();
          navigate({ to: "/account" });
        }}
      />
    </div>
  );
}
