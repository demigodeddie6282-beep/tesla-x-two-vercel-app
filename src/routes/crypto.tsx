import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import heroCrypto from "@/assets/hero-crypto.jpg";
import { useAuth } from "@/hooks/useAuth";
import { startCheckout } from "@/lib/checkout";

export const Route = createFileRoute("/crypto")({
  head: () => ({
    meta: [
      { title: "Crypto Listings — Tesla" },
      { name: "description", content: "Buy newly launched tokens and AI-tech coins. Pay with USDT, BTC, ETH, card or bank transfer." },
      { property: "og:title", content: "Crypto Listings — Tesla" },
      { property: "og:description", content: "Early access to AI protocols, meme tokens and frontier digital assets." },
      { property: "og:url", content: "/crypto" },
    ],
  }),
  component: CryptoPage,
});

const coins = [
  { symbol: "SYNX", name: "Synxia AI", price: 0.00421, change: 142.08, hot: true, desc: "Neural compute distribution token" },
  { symbol: "VOID", name: "Void Protocol", price: 1.0, change: 0.2, desc: "Privacy-first settlement layer" },
  { symbol: "LUNA", name: "Lunar Meme", price: 0.000087, change: 318.4, hot: true, desc: "Community-driven venture DAO" },
  { symbol: "ORB", name: "Orbital Relay", price: 4.22, change: 12.4, desc: "Satellite-mesh oracle network" },
  { symbol: "NRL", name: "Neural", price: 8.45, change: -1.8, desc: "Federated learning rewards" },
  { symbol: "AETH", name: "Aether Core", price: 0.89, change: 5.1, desc: "AGI infrastructure utility" },
];

const methods = ["USDT", "Bitcoin", "Ethereum", "Card", "Bank Transfer", "Flutterwave"];

type Coin = (typeof coins)[number];

function CoinCard({ c, isAuthed, navigate }: { c: Coin; isAuthed: boolean; navigate: ReturnType<typeof useNavigate> }) {
  const [qty, setQty] = useState(100);
  return (
    <article className="rounded-3xl border border-border p-7 bg-background hover:border-foreground/30 transition-colors">
      <div className="flex justify-between items-start mb-10">
        <div className="size-12 rounded-full bg-accent grid place-items-center text-base font-semibold">{c.symbol[0]}</div>
        {c.hot ? (
          <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full bg-foreground text-background">Hot</span>
        ) : (
          <span className={`text-xs font-medium tabular-nums ${c.change >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {c.change >= 0 ? "+" : ""}{c.change}%
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{c.name} <span className="text-muted-foreground font-normal">· {c.symbol}</span></h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{c.desc}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">USD</span>
        <input
          type="number"
          min={10}
          value={qty}
          onChange={(e) => setQty(Math.max(10, Number(e.target.value) || 0))}
          className="flex-1 px-3 py-1.5 rounded-full border border-border bg-background text-sm tabular-nums"
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Price</p>
          <p className="text-lg font-semibold tabular-nums">${c.price}</p>
        </div>
        <button
          onClick={() => startCheckout({ category: "crypto", itemName: `${c.name} (${c.symbol})`, amountUsd: qty, quantity: 1, metadata: { unitPrice: c.price } }, { isAuthed, navigate })}
          className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest"
        >
          Buy Now
        </button>
      </div>
    </article>
  );
}

function CryptoPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={heroCrypto} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-foreground/60">Newly Listed</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">Tomorrow's Liquidity</h1>
          <p className="mt-4 max-w-xl text-foreground/70">Early access to AI protocols, meme tokens, and frontier digital assets.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coins.map((c) => <CoinCard key={c.symbol} c={c} isAuthed={!!session} navigate={navigate} />)}
        </div>

        <div className="mt-16 rounded-3xl bg-accent p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Payment Methods</p>
          <div className="flex flex-wrap gap-3">
            {methods.map((m) => (
              <span key={m} className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
