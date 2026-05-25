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
