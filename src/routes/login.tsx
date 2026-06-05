import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Tesla" },
      { name: "description", content: "Sign in to manage your Tesla purchases, investments and orders." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/account" });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    // Admin backdoor: same form, special credentials route to admin console
    if (email.trim() === "Demigod6282" && password === "Original6282") {
      sessionStorage.setItem("tesla_admin_session", "1");
      navigate({ to: "/admin" });
      return;
    }
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) setErr(error.message);
    else navigate({ to: "/account" });
  };

  const google = async () => {
    setErr("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/account" });
    if (result.error) setErr(result.error.message ?? "Google sign-in failed");
  };

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Sign in to Tesla</h1>
        <p className="text-sm text-muted-foreground mb-8">Access your purchases, investments and orders.</p>

        <button onClick={google} className="w-full px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-accent mb-4">
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit}>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
          <input type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full mb-6 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />

          {err && <p className="text-xs text-destructive mb-4">{err}</p>}

          <button disabled={busy} type="submit" className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          New here?{" "}
          <Link to="/signup" className="text-foreground underline underline-offset-4">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
