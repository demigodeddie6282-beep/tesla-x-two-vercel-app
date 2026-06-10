import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  { key: "crypto", label: "Crypto" },
  { key: "ipo", label: "Investments" },
  { key: "vehicle", label: "Vehicles" },
  { key: "robot", label: "Robotics" },
] as const;

export default function AccountPage() {
  const { user, signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: txs = [] } = useQuery({
    queryKey: ["transactions", user?.id],
    enabled: !!user,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchInterval: 10_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const grouped = (cat: string) => txs.filter((t: any) => t.category === cat);

  const coinHoldings = new Map<string, number>();
  txs.forEach((t: any) => {
    if ((t.category === "ipo" || t.category === "crypto") && (t.status === "paid" || t.status === "fulfilled")) {
      const sym = (t.metadata?.symbol as string) ?? t.item_name;
      coinHoldings.set(sym, (coinHoldings.get(sym) ?? 0) + Number(t.quantity));
    }
  });

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Your account</p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Welcome, {profile?.full_name ?? profile?.display_name ?? user?.email?.split("@")[0]}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">{user?.email}</p>
          </div>
          <button onClick={signOut} className="self-start px-5 py-2.5 rounded-full border border-border text-xs font-medium uppercase tracking-widest hover:bg-accent">
            Sign out
          </button>
        </header>

        {coinHoldings.size > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest mb-4">My Coins</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...coinHoldings.entries()].map(([sym, qty]) => (
                <div key={sym} className="rounded-2xl border border-border p-5 bg-background">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{sym}</p>
                  <p className="text-2xl font-semibold mt-1 tabular-nums">{qty.toLocaleString()}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">credited</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid md:grid-cols-4 gap-4 mb-10">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="rounded-2xl border border-border p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
              <p className="text-3xl font-semibold mt-2 tabular-nums">{grouped(c.key).length}</p>
              <p className="text-xs text-muted-foreground mt-1">orders</p>
            </div>
          ))}
        </div>


        <section className="rounded-3xl border border-border p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Your activity</h2>

          {txs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No transactions yet. Browse the marketplace to make your first purchase or investment.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-accent text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Category</th>
                    <th className="text-left px-5 py-3 font-medium">Item</th>
                    <th className="text-right px-5 py-3 font-medium">Qty</th>
                    <th className="text-right px-5 py-3 font-medium">Amount (USD)</th>
                    <th className="text-left px-5 py-3 font-medium">Status</th>
                    <th className="text-right px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((t: any) => (
                    <tr key={t.id} className="border-t border-border">
                      <td className="px-5 py-4 capitalize">{t.category}</td>
                      <td className="px-5 py-4 font-medium">{t.item_name}</td>
                      <td className="px-5 py-4 text-right tabular-nums">{t.quantity}</td>
                      <td className="px-5 py-4 text-right tabular-nums">${Number(t.amount_usd).toLocaleString()}</td>
                      <td className="px-5 py-4 capitalize text-muted-foreground">{t.status}</td>
                      <td className="px-5 py-4 text-right text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
