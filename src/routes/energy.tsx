import { createFileRoute, useNavigate } from "@tanstack/react-router";
import powerwall from "@/assets/powerwall.jpg";
import solarRoof from "@/assets/solar-roof.jpg";
import megapack from "@/assets/megapack.jpg";
import { useAuth } from "@/hooks/useAuth";
import { startCheckout } from "@/lib/checkout";

export const Route = createFileRoute("/energy")({
  head: () => ({
    meta: [
      { title: "Energy — Tesla" },
      { name: "description", content: "Tesla Solar Panels, Solar Roof, Powerwall and Megapack — clean energy generation and storage for homes, businesses and utilities." },
    ],
  }),
  component: EnergyPage,
});

const products = [
  { id: "solar-panels", name: "Solar Panels", tagline: "Low-profile, durable solar for any home.", price: 9999, image: solarRoof, category: "Home Solar" },
  { id: "solar-roof", name: "Solar Roof", tagline: "Glass solar tiles that look like a premium roof.", price: 39999, image: solarRoof, category: "Home Solar" },
  { id: "powerwall", name: "Powerwall", tagline: "13.5 kWh home battery. Backup + storage.", price: 9200, image: powerwall, category: "Home Battery" },
  { id: "megapack", name: "Megapack", tagline: "3.9 MWh utility-scale battery storage.", price: 1900000, image: megapack, category: "Utility" },
];

function EnergyPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={solarRoof} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 text-foreground/70">Energy</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground">Powering a sustainable future.</h1>
          <p className="mt-4 max-w-xl text-foreground/70">Generate, store and deliver clean energy — from your roof to the grid.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((p) => (
            <article key={p.id} className="rounded-3xl border border-border overflow-hidden bg-background">
              <div className="relative aspect-[16/10]">
                <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{p.category}</p>
                <h3 className="text-2xl font-semibold tracking-tight mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{p.tagline}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                    <p className="text-2xl font-semibold tabular-nums">${p.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => startCheckout({ category: "robot", itemName: p.name, amountUsd: p.price, quantity: 1, metadata: { category: p.category, kind: "energy" } }, { isAuthed: !!session, navigate })}
                    className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest"
                  >Order Now</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
