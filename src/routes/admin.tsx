import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Nexora" },
      { name: "description", content: "Manage listings, products, prices, and transactions." },
    ],
  }),
  component: AdminGate,
});

const tabs = ["Crypto Listings", "IPO Offerings", "Vehicles", "Robotics", "Discounts", "Transactions"] as const;

const ADMIN_ID = "Demigod6282";
const ADMIN_PW = "Original6282";
const SESSION_KEY = "nexora_admin_session";

function AdminGate() {
  const [authed, setAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1");
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <AdminPage onLogout={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }} />;
}

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === ADMIN_ID && pw === ADMIN_PW) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Restricted</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Operator Sign-In</h1>
        <p className="text-sm text-muted-foreground mb-8">Enter your administrator credentials to continue.</p>

        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Admin ID</label>
        <input
          autoFocus
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {err && <p className="text-xs text-destructive mb-4">{err}</p>}

        <button type="submit" className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest">
          Enter Console
        </button>
      </form>
    </div>
  );
}

function AdminPage({ onLogout }: { onLogout: () => void }) {
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
