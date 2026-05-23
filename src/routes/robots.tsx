import { createFileRoute } from "@tanstack/react-router";
import heroRobots from "@/assets/hero-robots.jpg";

export const Route = createFileRoute("/robots")({
  head: () => ({
    meta: [
      { title: "Robotics — Nexora" },
      { name: "description", content: "Humanoid AI robots for domestic, industrial, and enterprise deployment." },
    ],
  }),
  component: RobotsPage,
});

const units = [
  { id: "omnimax", name: "Omnimax Gen-3", category: "Domestic Assistant", price: 84200, specs: ["Quantum-A1 Neural Core", "48h continuous operation", "0.02ms response latency"] },
  { id: "atlas-w", name: "Atlas-W", tag: "Industrial", category: "Manufacturing", price: 162000, specs: ["900 TFLOPS local compute", "Liquid-crystalline actuators", "ISO-rated for clean rooms"] },
  { id: "sentinel", name: "Sentinel Mk II", category: "Security & Defense", price: 220000, specs: ["Multi-spectral vision", "Encrypted mesh comms", "Autonomous patrol mode"] },
  { id: "kuro", name: "Kuro Domestic", category: "Household & Culinary", price: 48000, specs: ["Cooking & cleaning suite", "Voice + neural link", "Auto-charge dock"] },
];

function RobotsPage() {
  return (
    <div>
      <section className="relative min-h-[80svh] flex items-end pb-20 overflow-hidden">
        <img src={heroRobots} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-foreground/60">Neural Robotics</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground">Humanoid systems, deployed.</h1>
          <p className="mt-4 max-w-xl text-foreground/70">Pre-trained on 500+ task domains. Continuously updated through the Nexora intelligence mesh.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {units.map((u) => (
            <article key={u.id} className="rounded-3xl border border-border p-10 bg-background hover:shadow-xl transition-shadow">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{u.category}</p>
              <h3 className="text-3xl font-semibold tracking-tight mb-6">{u.name}</h3>
              <ul className="space-y-3 mb-8">
                {u.specs.map((s) => (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Starting</p>
                  <p className="text-2xl font-semibold tabular-nums">${u.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest">Reserve</button>
                  <button className="px-6 py-3 rounded-full border border-border text-sm font-medium uppercase tracking-widest hover:bg-accent">Bulk Quote</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
