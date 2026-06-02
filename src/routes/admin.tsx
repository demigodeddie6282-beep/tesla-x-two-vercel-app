import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListTransactions, adminUpdateTransactionStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Tesla" },
      { name: "description", content: "Manage transactions, payment slips and orders." },
    ],
  }),
  component: AdminGate,
});

const ADMIN_ID = "Demigod6282";
const ADMIN_PW = "Original6282";
const SESSION_KEY = "tesla_admin_session";

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

type Tx = {
  id: string;
  user_id: string;
  category: string;
  item_name: string;
  quantity: number;
  amount_usd: number;
  status: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

const FILTERS = ["All", "Bank (Pending)", "Paid", "Cancelled"] as const;

function AdminPage({ onLogout }: { onLogout: () => void }) {
  const list = useServerFn(adminListTransactions);
  const update = useServerFn(adminUpdateTransactionStatus);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Bank (Pending)");

  async function refresh() {
    setLoading(true);
    try {
      const res = await list({ data: { id: ADMIN_ID, pw: ADMIN_PW } });
      setTxs(res.transactions as Tx[]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function setStatus(tx: Tx, status: "paid" | "cancelled") {
    try {
      await update({ data: { id: ADMIN_ID, pw: ADMIN_PW, tx_id: tx.id, status } });
      toast.success(`Marked ${status}`);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  const filtered = txs.filter((t) => {
    const m = (t.metadata ?? {}) as Record<string, unknown>;
    if (filter === "All") return true;
    if (filter === "Bank (Pending)") return m.method === "bank" && t.status === "pending";
    if (filter === "Paid") return t.status === "paid" || t.status === "fulfilled";
    if (filter === "Cancelled") return t.status === "cancelled";
    return true;
  });

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Console</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Operator Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-2">Review payments, download payment slips, approve bank transfers.</p>
          </div>
          <button onClick={onLogout} className="shrink-0 px-4 py-2 rounded-full border border-border text-xs font-medium uppercase tracking-widest hover:bg-accent">
            Sign out
          </button>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-medium uppercase tracking-widest ${filter === f ? "bg-primary text-primary-foreground" : "bg-accent text-foreground hover:bg-accent/70"}`}
            >
              {f}
            </button>
          ))}
          <button onClick={refresh} className="ml-auto px-4 py-2 rounded-full border border-border text-xs font-medium uppercase tracking-widest hover:bg-accent">
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No transactions match this filter.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx) => {
              const m = (tx.metadata ?? {}) as Record<string, unknown>;
              const payslipUrl = typeof m.payslip_url === "string" ? m.payslip_url : null;
              return (
                <div key={tx.id} className="rounded-2xl border border-border p-5 md:p-6 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent">{tx.category}</span>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent">{String(m.method ?? "—")}</span>
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full ${tx.status === "paid" || tx.status === "fulfilled" ? "bg-emerald-500/15 text-emerald-700" : tx.status === "pending" ? "bg-amber-500/15 text-amber-700" : "bg-rose-500/15 text-rose-700"}`}>
                        {tx.status}
                      </span>
                    </div>
                    <p className="font-semibold truncate">{tx.item_name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Qty {Number(tx.quantity).toLocaleString()} · ${Number(tx.amount_usd).toLocaleString()} · {new Date(tx.created_at).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-1 truncate">user: {tx.user_id}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0">
                    {payslipUrl && (
                      <a
                        href={payslipUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="px-4 py-2 rounded-full border border-border text-xs font-semibold uppercase tracking-widest hover:bg-accent"
                      >
                        Download Slip
                      </a>
                    )}
                    {tx.status === "pending" && (
                      <>
                        <button onClick={() => setStatus(tx, "paid")} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest">
                          Approve
                        </button>
                        <button onClick={() => setStatus(tx, "cancelled")} className="px-4 py-2 rounded-full border border-border text-xs font-semibold uppercase tracking-widest hover:bg-accent">
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
