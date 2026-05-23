import { createFileRoute } from "@tanstack/react-router";
import heroIpo from "@/assets/hero-ipo.jpg";

export const Route = createFileRoute("/ipo")({
  head: () => ({
    meta: [
      { title: "IPO & Stock Opportunities — Nexora" },
      { name: "description", content: "Pre-market positions in AI, robotics, aerospace and biotech ventures." },
    ],
  }),
  component: IpoPage,
});

const offerings = [
  { name: "Hyperion Compute", sector: "AI Infrastructure", status: "Active IPO", growth: "+312%", min: 5000 },
  { name: "Orbital Relay", sector: "Aerospace · Comms", status: "Opening Soon", growth: "TBD", min: 10000 },
  { name: "Vanguard Bio", sector: "Synthetic Biology", status: "Active IPO", growth: "+184%", min: 2500 },
  { name: "Helion Robotics", sector: "Industrial Robotics", status: "Pre-IPO Allocation", growth: "+96%", min: 25000 },
];

function IpoPage() {
  return (
    <div className="bg-foreground text-background">
      <section className="relative min-h-[70svh] flex items-end pb-20 overflow-hidden">
        <img src={heroIpo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/40 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 text-background">
          <p className="text-xs uppercase tracking-[0.2em] mb-3 opacity-70">Institutional Access</p>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">Frontier IPOs</h1>
          <p className="mt-4 max-w-xl text-background/80">Pre-market positions in the companies defining the next century.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {offerings.map((o) => (
            <article key={o.name} className="rounded-3xl border border-background/15 p-10 hover:border-background/40 transition-colors">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] opacity-60 mb-2">{o.sector}</p>
                  <h3 className="text-2xl font-semibold tracking-tight">{o.name}</h3>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-background/10">
                  {o.status}
                </span>
              </div>
              <div className="flex items-end justify-between pt-6 border-t border-background/10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Growth Est.</p>
                  <p className="text-xl font-semibold">{o.growth}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Min. Allocation</p>
                  <p className="text-xl font-semibold tabular-nums">${o.min.toLocaleString()}</p>
                </div>
                <button className="px-5 py-2.5 rounded-full bg-background text-foreground text-xs font-medium uppercase tracking-widest">
                  Reserve
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
