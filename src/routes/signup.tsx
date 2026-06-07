import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Tesla" },
      { name: "description", content: "Create your Tesla account to invest, buy and track everything in one place." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  displayName: z.string().trim().min(1, "Name required").max(80),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
});

function SignupPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/account" });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg("");
    const parsed = schema.safeParse({ displayName, email, password });
    if (!parsed.success) { setErr(parsed.error.issues[0].message); return; }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: window.location.origin + "/account",
        data: { display_name: parsed.data.displayName },
      },
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    if (data.session) navigate({ to: "/account" });
    else setMsg("Check your inbox to verify your email, then sign in.");
  };

  const google = async () => {
    setErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/account" },
    });
    if (error) setErr(error.message ?? "Google sign-in failed");
  };

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Join Tesla</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Create your account</h1>
        <p className="text-sm text-muted-foreground mb-8">Track every order, investment and asset in one place.</p>

        <button onClick={google} className="w-full px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-accent mb-4">
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit}>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required maxLength={80}
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
            className="w-full mb-6 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary" />

          {err && <p className="text-xs text-destructive mb-4">{err}</p>}
          {msg && <p className="text-xs text-foreground mb-4">{msg}</p>}

          <button disabled={busy} type="submit" className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest disabled:opacity-60">
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
