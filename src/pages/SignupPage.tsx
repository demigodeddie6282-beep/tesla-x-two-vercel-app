import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

type Step = "form" | "verify";

export default function SignupPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) navigate("/account", { replace: true });
  }, [session, loading, navigate]);

  const sendVerificationCode = async (emailAddress: string): Promise<boolean> => {
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress, action: "send" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code");
      return true;
    } catch (e) {
      console.error("Send code error:", e);
      return false;
    }
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      // Send verification code first
      const sent = await sendVerificationCode(parsed.data.email);
      if (!sent) {
        setErr("Failed to send verification code. Please try again.");
        setBusy(false);
        return;
      }

      setMsg("A 6-digit verification code has been sent to your email.");
      setStep("verify");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setBusy(false);
    }
  };

  const submitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!verificationCode || verificationCode.length !== 6) {
      setErr("Please enter the 6-digit code");
      return;
    }

    setBusy(true);
    try {
      // Verify the code
      const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/send-verification-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, action: "verify" }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setErr(verifyData.message || "Invalid verification code");
        setBusy(false);
        return;
      }

      // Now create the account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + "/account",
          data: { full_name: fullName, display_name: fullName },
        },
      });

      if (error) {
        setErr(error.message);
        return;
      }

      if (data.session) {
        navigate("/account");
      } else {
        setMsg("Account created! Please check your email to confirm your account.");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setBusy(false);
    }
  };

  const resendCode = async () => {
    setErr("");
    setBusy(true);
    const sent = await sendVerificationCode(email);
    setBusy(false);
    if (sent) {
      setMsg("New verification code sent!");
    } else {
      setErr("Failed to resend code. Please try again.");
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

  if (step === "verify") {
    return (
      <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
          <button
            onClick={() => setStep("form")}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
          >
            ← Back
          </button>

          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Verify your email</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Enter verification code</h1>
          <p className="text-sm text-muted-foreground mb-8">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
          </p>

          <form onSubmit={submitVerification}>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full mb-5 px-4 py-4 rounded-xl bg-accent text-foreground text-center text-2xl tracking-[0.3em] font-mono border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {err && <p className="text-xs text-destructive mb-4">{err}</p>}
            {msg && <p className="text-xs text-foreground mb-4">{msg}</p>}

            <button
              disabled={busy || verificationCode.length !== 6}
              type="submit"
              className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest disabled:opacity-60"
            >
              {busy ? "Verifying..." : "Verify & Create Account"}
            </button>
          </form>

          <button
            onClick={resendCode}
            disabled={busy}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            Resend code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border p-8 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Join Tesla</p>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Create your account</h1>
        <p className="text-sm text-muted-foreground mb-8">Track every order, investment and asset in one place.</p>

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

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground">or email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submitForm}>
          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            maxLength={100}
            placeholder="John Doe"
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full mb-5 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full mb-6 px-4 py-3 rounded-full bg-accent text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {err && <p className="text-xs text-destructive mb-4">{err}</p>}
          {msg && <p className="text-xs text-foreground mb-4">{msg}</p>}

          <button
            disabled={busy || !!oauthLoading}
            type="submit"
            className="w-full px-6 py-3 rounded-full bg-primary text-primary-foreground text-xs font-medium uppercase tracking-widest disabled:opacity-60"
          >
            {busy ? "Sending..." : "Create account"}
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
