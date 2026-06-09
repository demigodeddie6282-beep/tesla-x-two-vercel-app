import { useNavigate } from "react-router-dom";
import charging from "@/assets/charging.jpg";
import { useAuth } from "@/hooks/useAuth";
import { startCheckout } from "@/lib/checkout";

const items = [
  { id: "wall-connector", name: "Wall Connector", tagline: "Up to 44 miles of range per hour at home.", price: 475, category: "Home" },
  { id: "mobile-connector", name: "Mobile Connector", tagline: "Charge anywhere from a standard outlet.", price: 230, category: "Home" },
  { id: "supercharger-stall", name: "Supercharger Stall", tagline: "Commercial 250 kW DC fast charging pylon.", price: 65000, category: "Business" },
  { id: "semi-charger", name: "Semi Megacharger", tagline: "Megawatt charging for Tesla Semi fleets.", price: 285000, category: "Business" },
];

export default function ChargingPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  return (
    <div>
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={charging} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 text-white">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 opacity-80">Charging</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">The world's largest fast-charging network.</h1>
          <p className="mt-4 max-w-xl text-white/85">Over 60,000 Superchargers globally. Charge at home, on the road, and at work.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((i) => (
            <article key={i.id} className="rounded-3xl border border-border p-10 bg-background hover:shadow-xl transition-shadow">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{i.category}</p>
              <h2 className="text-2xl font-semibold tracking-tight mb-1">{i.name}</h2>
              <p className="text-sm text-muted-foreground mb-8">{i.tagline}</p>
              <div className="flex items-end justify-between pt-6 border-t border-border">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">From</p>
                  <p className="text-2xl font-semibold tabular-nums">${i.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => startCheckout({ category: "robot", itemName: i.name, amountUsd: i.price, quantity: 1, metadata: { category: i.category, kind: "charging" } }, { isAuthed: !!session, navigate })}
                  className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium uppercase tracking-widest"
                >Order Now</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
