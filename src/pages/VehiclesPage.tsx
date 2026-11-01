import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import modelS from "@/assets/model-s.jpg";
import model3 from "@/assets/model-3.jpg";
import modelY from "@/assets/model-y.jpg";
import modelX from "@/assets/model-x.jpg";
import cybertruck from "@/assets/cybertruck.jpg";
import semi from "@/assets/semi.jpg";
import roadster from "@/assets/roadster.jpg";
import roadsterHover from "@/assets/roadster-hover.jpg";
import { useAuth } from "@/hooks/useAuth";
import { startCheckout } from "@/lib/checkout";

const fleet = [
  { id: "model-s", name: "Model S", tagline: "Plaid Tri-Motor - 1,020 hp - 396 mi range", price: 79990, image: modelS },
  { id: "model-3", name: "Model 3", tagline: "Long Range AWD - 341 mi range", price: 42490, image: model3 },
  { id: "model-y", name: "Model Y", tagline: "Best-selling EV - 320 mi range", price: 44990, image: modelY },
  { id: "model-x", name: "Model X", tagline: "Falcon Wing - 348 mi range", price: 84990, image: modelX },
  { id: "cybertruck", name: "Cybertruck", tagline: "All-electric pickup - 340 mi range", price: 79990, image: cybertruck },
  { id: "semi", name: "Tesla Semi", tagline: "Class 8 freight - 500 mi range", price: 180000, image: semi },
  { id: "roadster", name: "New Roadster", tagline: "SpaceX package - hover flight mode - 620 mi range", price: 200000, image: roadster },
];

function priceFor(qty: number, base: number) {
  if (qty >= 5) return Math.round(base * 0.5);
  if (qty >= 3) return Math.round(base * 0.6);
  return base;
}

function FlightDemoSection() {
  const [telemetry, setTelemetry] = useState({ alt: 1.0, thrust: 42 });

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry({
        alt: +(0.8 + Math.random() * 0.6).toFixed(2),
        thrust: Math.round(35 + Math.random() * 25),
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="flight-demo" className="relative min-h-[90svh] flex items-end overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 animate-hover-bob">
        <img
          src={roadsterHover}
          alt="New Roadster demonstrating hover flight mode"
          width={1920}
          height={1024}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none animate-thruster-glow bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,rgba(120,180,255,0.35),transparent_70%)]" />

      <div className="absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-3 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black">Flight Demo - Live</span>
      </div>

      <div className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-10 flex-col gap-3 max-w-[220px]">
        {[
          { label: "Mode", value: "Hover" },
          { label: "Altitude", value: `${telemetry.alt.toFixed(2)} m` },
          { label: "Thrust", value: `${telemetry.thrust}%` },
          { label: "Thrusters", value: "10x Cold Air" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl backdrop-blur-md bg-white/15 border border-white/25 px-4 py-3 text-white shadow-lg">
            <p className="text-[10px] uppercase tracking-[0.18em] opacity-80">{s.label}</p>
            <p className="text-base font-semibold tabular-nums leading-tight mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 pb-16 md:pb-20 text-white">
        <p className="text-xs uppercase tracking-[0.25em] text-white/80 mb-3">New Roadster - SpaceX Package</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] drop-shadow-lg">
          Watch it fly. Right here.
        </h2>
        <p className="mt-4 max-w-xl text-sm md:text-base text-white/85 drop-shadow">
          Ten cold-air thrusters lift the Roadster into a stable hover. The demonstration streams live on this page - reserve yours to feel it in person.
        </p>
        <div className="mt-8 flex flex-col md:flex-row gap-3">
          <button
            onClick={() => startCheckout({ category: "vehicle", itemName: "New Roadster", amountUsd: 200000, quantity: 1, metadata: { tagline: "SpaceX package - hover flight mode" } }, { isAuthed: !!authSession, navigate })}
            className="btn-hero btn-hero-dark-primary"
          >
            Reserve Now
          </button>
          <Link to="/chat" className="btn-hero btn-hero-dark-secondary">Request a Private Flight Demo</Link>
        </div>
        <div className="md:hidden mt-8 flex flex-wrap gap-2 justify-center">
          {["Hover", `${telemetry.alt.toFixed(2)} m`, `${telemetry.thrust}%`, "10x Thrusters"].map((v, i) => (
            <span key={i} className="text-[11px] font-medium tracking-wide rounded-full bg-white/85 text-black px-3 py-1.5 backdrop-blur">{v}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ v }: { v: typeof fleet[number] }) {
  const [qty, setQty] = useState(1);
  const { session } = useAuth();
  const navigate = useNavigate();
  const unit = priceFor(qty, v.price);
  const discount = qty >= 3;
  const authSession = session;
  return (
    <article className="bg-background rounded-3xl overflow-hidden border border-border">
      <div className="relative aspect-[16/10]">
        <img src={v.image} alt={v.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{v.name}</h2>
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
            <button className="px-3 py-1 hover:bg-accent" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
            <span className="px-4 text-sm tabular-nums">{qty}</span>
            <button className="px-3 py-1 hover:bg-accent" onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">
            3+ <span className="text-foreground font-medium">-40%</span> - 5+ <span className="text-foreground font-medium">-50%</span>
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => startCheckout({ category: "vehicle", itemName: v.name, amountUsd: unit, quantity: qty, metadata: { tagline: v.tagline } }, { isAuthed: !!session, navigate })}
            className="flex-1 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest"
          >
            Order Now
          </button>
          <button className="px-6 py-3 rounded-full border border-border text-sm font-medium uppercase tracking-widest hover:bg-accent">
            Demo Drive
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VehiclesPage() {
  return (
    <div>
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={modelS} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-foreground/70">Vehicles</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground">The Tesla Lineup</h1>
          <p className="mt-4 max-w-xl text-foreground/70">Sedans, SUVs, trucks and hypercars - all electric, all autonomous-ready.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fleet.map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>

        <div className="mt-16 rounded-3xl bg-accent p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Fleet Program</p>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">Bulk acquisitions for institutional partners.</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">Tiered fleet pricing, dedicated concierge, priority delivery worldwide.</p>
          </div>
          <Link to="/chat" className="btn-hero btn-hero-primary">Talk to a strategist</Link>
        </div>
      </section>
    </div>
  );
}
