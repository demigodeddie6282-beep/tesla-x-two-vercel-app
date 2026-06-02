import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import heroIpo from "@/assets/hero-ipo.jpg";
import { useAuth } from "@/hooks/useAuth";
import { PaymentModal, type PaymentItem } from "@/components/PaymentModal";

export const Route = createFileRoute("/ipo")({
  head: () => ({
    meta: [
      { title: "Tesla Coins & IPO Stock — Buy Now" },
      { name: "description", content: "Buy Tesla-backed coins and pre-IPO stock. $500 minimum. Pay by card, crypto or bank transfer." },
    ],
  }),
  component: IpoPage,
});

const MIN_PURCHASE_USD = 500;

const coins = [
  {
    id: "tsla-x",
    symbol: "TSLA-X",
    name: "Tesla X Coin",
    price: 0.2148,
    tagline: "Core utility coin powering Tesla's energy & charging network.",
    supply: "2.1B",
    chain: "Ethereum (ERC-20)",
  },
  {
    id: "tsla-r",
    symbol: "TSLA-R",
    name: "Tesla Robotics Coin",
    price: 0.2173,
    tagline: "Backed by Optimus robotics revenue and factory automation.",
    supply: "1.4B",
    chain: "BNB Smart Chain (BEP-20)",
  },
  {
    id: "tsla-e",
    symbol: "TSLA-E",
    name: "Tesla Energy Coin",
    price: 0.2195,
    tagline: "Tied to Powerwall, Megapack and Solar Roof deployments.",
    supply: "900M",
    chain: "Polygon",
  },
];

function IpoPage() {
  return (
    <div className="bg-foreground text-background">
      <section className="relative min-h-[60svh] flex items-end pb-16 overflow-hidden">
        <img src={heroIpo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 opacity-70">Pre-IPO · Open Allocation</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">Tesla Coins</h1>
          <p className="mt-4 max-w-xl text-background/80">
            Own a stake in Tesla's next chapter. Pick a coin, choose your quantity, pay securely. Minimum ${MIN_PURCHASE_USD.toLocaleString()}.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {coins.map((c) => (
            <CoinCard key={c.id} coin={c} />
          ))}
        </div>

        <p className="mt-10 text-xs text-background/60 max-w-2xl">
          Pay by card, crypto (BTC, ETH, USDT, DOGE) or bank transfer. Card and crypto orders are credited instantly. Bank-transfer orders remain pending until our team verifies the uploaded payment slip.
        </p>
      </section>
    </div>
  );
}

function CoinCard({ coin }: { coin: (typeof coins)[number] }) {
  const { session } = useAuth();
  const navigate = useNavigate();
  const minQty = Math.ceil(MIN_PURCHASE_USD / coin.price);
  const [qty, setQty] = useState<number>(minQty);
  const [modalOpen, setModalOpen] = useState(false);

  const total = useMemo(() => qty * coin.price, [qty, coin.price]);
  const belowMin = total < MIN_PURCHASE_USD;

  function openPay() {
    if (!session) {
      navigate({ to: "/login" });
      return;
    }
    setModalOpen(true);
  }

  const item: PaymentItem = {
    category: "ipo",
    itemName: `${coin.name} (${coin.symbol})`,
    amountUsd: Number(total.toFixed(2)),
    quantity: qty,
    metadata: {
      coin_id: coin.id,
      symbol: coin.symbol,
      unit_price: coin.price,
      chain: coin.chain,
    },
  };

  return (
    <article className="rounded-3xl border border-background/15 p-7 flex flex-col gap-5 bg-background/[0.02]">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/20 text-primary">
            {coin.symbol}
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-60">{coin.chain}</span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">{coin.name}</h3>
        <p className="mt-2 text-sm text-background/70">{coin.tagline}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-background/5 p-3">
          <p className="text-[10px] uppercase tracking-widest opacity-60">Price</p>
          <p className="font-semibold tabular-nums">${coin.price.toFixed(4)}</p>
        </div>
        <div className="rounded-xl bg-background/5 p-3">
          <p className="text-[10px] uppercase tracking-widest opacity-60">Supply</p>
          <p className="font-semibold tabular-nums">{coin.supply}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-background/5 p-4">
        <label className="text-[10px] uppercase tracking-widest opacity-60 block mb-2">Quantity</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(minQty, q - 100))}
            className="w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 text-lg leading-none"
            aria-label="Decrease"
          >
            −
          </button>
          <input
            type="number"
            min={minQty}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
            className="flex-1 bg-transparent text-center text-lg font-semibold tabular-nums outline-none border-b border-background/20 focus:border-primary py-1"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 100)}
            className="w-9 h-9 rounded-full bg-background/10 hover:bg-background/20 text-lg leading-none"
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <p className="mt-2 text-[11px] opacity-60">Minimum {minQty.toLocaleString()} coins (${MIN_PURCHASE_USD})</p>

        <div className="mt-4 pt-4 border-t border-background/10 flex items-baseline justify-between">
          <span className="text-[10px] uppercase tracking-widest opacity-60">Total</span>
          <span className="text-2xl font-semibold tabular-nums">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <button
        onClick={openPay}
        disabled={belowMin}
        className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest disabled:opacity-50"
      >
        {belowMin ? `Min $${MIN_PURCHASE_USD}` : "Pay"}
      </button>

      {!session && (
        <p className="text-[11px] text-center opacity-60">
          <Link to="/login" className="underline">Sign in</Link> to complete your purchase
        </p>
      )}

      <PaymentModal
        item={item}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => { /* stays open on success step */ }}
      />
    </article>
  );
}
