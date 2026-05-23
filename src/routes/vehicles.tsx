import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroVehicles from "@/assets/hero-vehicles.jpg";
import heroMain from "@/assets/hero-main.jpg";

export const Route = createFileRoute("/vehicles")({
  head: () => ({
    meta: [
      { title: "Vehicles — Nexora" },
      { name: "description", content: "Order autonomous luxury vehicles. Bulk pricing for fleet acquisitions." },
    ],
  }),
  component: VehiclesPage,
});

const fleet = [
  { id: "phantom-s", name: "Phantom S", tagline: "Autonomous Grand Tourer", price: 240000, image: heroVehicles },
  { id: "vanguard-x", name: "Vanguard X", tagline: "All-terrain Electric Platform", price: 180000, image: heroMain },
  { id: "strike-r", name: "Strike R", tagline: "Track-Spec Hypercar", price: 410000, image: heroVehicles },
];

function priceFor(qty: number, base: number) {
  if (qty >= 5) return Math.round(base * 0.4);
  if (qty >= 3) return Math.round(base * 0.5);
  return base;
}

function VehicleCard({ v }: { v: typeof fleet[number] }) {
  const [qty, setQty] = useState(1);
  const unit = priceFor(qty, v.price);
  const discount = qty >= 3;
  return (
    <article className="bg-background rounded-3xl overflow-hidden border border-border">
      <div className="relative aspect-[16/10]">
        <img src={v.image} alt={v.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">{v.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{v.tagline}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
            <p className="text-xl font-semibold tabular-nums">${unit.toLocaleString()}</p>
            {discount && <p className="text-xs text-emerald-600 font-medium mt-1">Fleet pricing applied</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
          <div className="flex items-center border border-border rounded-full overflow-hidden">
            <button className="px-3 py-1 hover:bg-accent" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span className="px-4 text-sm tabular-nums">{qty}</span>
            <button className="px-3 py-1 hover:bg-accent" onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            Buy 3+ <span className="text-foreground font-medium">−50%</span> · 5+ <span className="text-foreground font-medium">−60%</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest">
            Reserve
          </button>
          <button className="px-6 py-3 rounded-full border border-border text-sm font-medium uppercase tracking-widest hover:bg-accent">
            Quote
          </button>
        </div>
      </div>
    </article>
  );
}

function VehiclesPage() {
  return (
    <div>
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={heroVehicles} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 text-white">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 opacity-80">Marketplace</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">Future Fleet</h1>
          <p className="mt-4 max-w-xl text-white/85">Autonomous luxury, hyperdrive sport, and long-range electric platforms — built for the next century.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>

        <div className="mt-16 rounded-3xl bg-accent p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">VIP Program</p>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Bulk acquisitions for institutional partners.</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">Tiered fleet pricing, dedicated concierge, priority delivery worldwide.</p>
          </div>
          <Link to="/ipo" className="btn-hero btn-hero-primary">Talk to a strategist</Link>
        </div>
      </section>
    </div>
  );
}
