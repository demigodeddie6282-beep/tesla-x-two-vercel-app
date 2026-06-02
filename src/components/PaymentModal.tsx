import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { FLUTTERWAVE_PAYMENT_URL, CRYPTO_WALLETS, BANK_DETAILS } from "@/lib/payments";

export interface PaymentItem {
  category: "crypto" | "ipo" | "vehicle" | "robot";
  itemName: string;
  amountUsd: number;
  quantity: number;
  metadata?: Record<string, unknown>;
}

type Method = "online" | "crypto" | "bank";
type TxStatus = "pending" | "paid";

export function PaymentModal({
  item,
  open,
  onClose,
  onSuccess,
}: {
  item: PaymentItem;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();
  const [method, setMethod] = useState<Method>("online");
  const [stage, setStage] = useState<"choose" | "online" | "crypto" | "bank" | "success">("choose");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>(CRYPTO_WALLETS[0].symbol);
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  async function insertTx(opts: { status: TxStatus; extra: Record<string, unknown> }) {
    if (!user) throw new Error("Not signed in");
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: user.id,
        category: item.category,
        item_name: item.itemName,
        amount_usd: Number(item.amountUsd.toFixed(2)),
        quantity: item.quantity,
        status: opts.status,
        metadata: { ...(item.metadata ?? {}), ...opts.extra } as never,
      })
      .select("id")
      .single();
    if (error) throw error;
    return data.id as string;
  }

  async function handleOnlineConfirm() {
    setSubmitting(true);
    try {
      await insertTx({ status: "paid", extra: { method: "online" } });
      setStage("success");
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCryptoConfirm() {
    setSubmitting(true);
    try {
      const w = CRYPTO_WALLETS.find((x) => x.symbol === selectedCrypto)!;
      await insertTx({
        status: "paid",
        extra: { method: "crypto", crypto_symbol: w.symbol, wallet_address: w.address },
      });
      setStage("success");
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBankSubmit() {
    if (!user) return;
    if (!file) { toast.error("Please upload your payment slip"); return; }
    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("payslips").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("payslips").getPublicUrl(path);
      await insertTx({
        status: "pending",
        extra: { method: "bank", payslip_url: pub.publicUrl, payslip_path: path, bank: BANK_DETAILS.bankName },
      });
      setStage("success");
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  }

  const wallet = CRYPTO_WALLETS.find((w) => w.symbol === selectedCrypto)!;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-background text-foreground rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 md:p-8 border-b border-border flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.category}</p>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{item.itemName}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Qty {item.quantity.toLocaleString()} · Total <span className="font-semibold text-foreground">${item.amountUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        <div className="p-6 md:p-8">
          {stage === "choose" && (
            <>
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4">Choose payment method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {([
                  { id: "online", label: "Card / Online", sub: "Instant" },
                  { id: "crypto", label: "Crypto", sub: "BTC · ETH · USDT · DOGE" },
                  { id: "bank", label: "Bank Transfer", sub: "Upload payslip" },
                ] as { id: Method; label: string; sub: string }[]).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`text-left p-4 rounded-2xl border transition-colors ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
                  >
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{m.sub}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStage(method)}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest"
              >
                Continue
              </button>
            </>
          )}

          {stage === "online" && (
            <div>
              <div className="relative w-full rounded-2xl overflow-hidden border border-border" style={{ height: "60vh" }}>
                <iframe
                  src={FLUTTERWAVE_PAYMENT_URL}
                  title="Secure Payment"
                  className="w-full h-full"
                  allow="payment"
                />
                {/* Cover strip hiding merchant name area on the hosted page */}
                <div className="absolute top-0 left-0 right-0 h-20 bg-background flex items-center justify-center pointer-events-none">
                  <span className="text-sm font-semibold tracking-widest uppercase text-foreground">Tesla · Secure Checkout</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">After completing the payment in the form above, click the button below.</p>
              <button
                onClick={handleOnlineConfirm}
                disabled={submitting}
                className="mt-4 w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? "Confirming…" : "I've Completed Payment"}
              </button>
            </div>
          )}

          {stage === "crypto" && (
            <div>
              <div className="grid grid-cols-4 gap-2 mb-5">
                {CRYPTO_WALLETS.map((w) => (
                  <button
                    key={w.symbol}
                    onClick={() => setSelectedCrypto(w.symbol)}
                    className={`py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest border ${selectedCrypto === w.symbol ? "border-primary bg-primary/5" : "border-border hover:bg-accent"}`}
                  >
                    {w.symbol}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl bg-accent p-5 mb-4">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{wallet.name} · {wallet.network}</p>
                <p className="mt-1 text-xs text-muted-foreground">Send exactly <span className="font-semibold text-foreground">${item.amountUsd.toFixed(2)}</span> worth to:</p>
                <div className="mt-3 p-3 rounded-xl bg-background border border-border break-all font-mono text-xs">
                  {wallet.address}
                </div>
                <button onClick={() => copy(wallet.address)} className="mt-3 text-xs font-medium underline underline-offset-4">Copy address</button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Once your transfer is sent, click below. Coins are credited immediately; network confirmation may take a few minutes.</p>
              <button
                onClick={handleCryptoConfirm}
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? "Confirming…" : "I've Sent the Payment"}
              </button>
            </div>
          )}

          {stage === "bank" && (
            <div>
              <div className="rounded-2xl bg-accent p-5 mb-4 space-y-2 text-sm">
                <Row label="Account Name" value={BANK_DETAILS.accountName} onCopy={copy} />
                <Row label="Account Number" value={BANK_DETAILS.accountNumber} onCopy={copy} />
                <Row label="Routing Number" value={BANK_DETAILS.routingNumber} onCopy={copy} />
                <Row label="Amount" value={`$${item.amountUsd.toFixed(2)}`} onCopy={copy} />
              </div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Upload payment slip *</label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm mb-4 file:mr-3 file:px-4 file:py-2 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground file:text-xs file:font-semibold file:uppercase file:tracking-widest"
              />
              <p className="text-xs text-muted-foreground mb-4">
                Your order will appear as <span className="font-semibold text-foreground">Pending</span> until our admin verifies your payment slip.
              </p>
              <button
                onClick={handleBankSubmit}
                disabled={submitting || !file}
                className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
              >
                {submitting ? "Uploading…" : "Submit Payment Slip"}
              </button>
            </div>
          )}

          {stage === "success" && (
            <div className="text-center py-6">
              <div className="mx-auto size-16 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center text-3xl mb-4">✓</div>
              <h3 className="text-2xl font-semibold tracking-tight mb-2">Payment Successful</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {method === "bank"
                  ? "Your payment slip was uploaded. The transaction is pending admin verification and will reflect in your dashboard once approved."
                  : `${item.quantity.toLocaleString()} × ${item.itemName} has been credited to your account.`}
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest"
              >
                View My Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, onCopy }: { label: string; value: string; onCopy: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{value}</span>
        <button onClick={() => onCopy(value)} className="text-[10px] uppercase tracking-widest underline">Copy</button>
      </div>
    </div>
  );
}
