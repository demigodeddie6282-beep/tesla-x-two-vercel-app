import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Nexora" },
      { name: "description", content: "Manage listings, products, prices, and transactions." },
    ],
  }),
  component: AdminPage,
});

const tabs = ["Crypto Listings", "IPO Offerings", "Vehicles", "Robotics", "Discounts", "Transactions"] as const;

function AdminPage() {
  const [active, setActive] = useState<(typeof tabs)[number]>("Crypto Listings");

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Console</p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Operator Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">Manage every listing, product and transaction across the Nexora platform.</p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-3 rounded-full text-xs font-medium uppercase tracking-widest transition-colors ${
                active === t ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-border p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">{active}</h2>
              <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove records below.</p>
            </div>
            <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest">
              + New record
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-accent text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Name</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Price</th>
                  <th className="text-right px-5 py-3 font-medium">Updated</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Synxia AI", "Live", "$0.00421", "2m ago"],
                  ["Void Protocol", "Live", "$1.00", "12m ago"],
                  ["Lunar Meme", "Pending", "$0.000087", "1h ago"],
                ].map(([n, s, p, u]) => (
                  <tr key={n} className="border-t border-border">
                    <td className="px-5 py-4 font-medium">{n}</td>
                    <td className="px-5 py-4 text-muted-foreground">{s}</td>
                    <td className="px-5 py-4 text-right tabular-nums">{p}</td>
                    <td className="px-5 py-4 text-right text-muted-foreground">{u}</td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs font-medium underline underline-offset-4 hover:opacity-60">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Connect Lovable Cloud to enable real persistence, authentication, and payment processing.
          </p>
        </div>
      </div>
    </div>
  );
}
