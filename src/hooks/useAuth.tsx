import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        console.log("[AuthProvider] Initializing auth...");

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
          if (!mounted) return;
          console.log("[AuthProvider] Auth state changed:", _event, s?.user?.email || "no session");
          setSession(s);
          setLoading(false);
          setError(null);
        });

        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("[AuthProvider] Error getting session:", sessionError);
          if (mounted) {
            setError(sessionError);
            setLoading(false);
          }
        } else {
          console.log("[AuthProvider] Initial session:", data.session?.user?.email || "no session");
          if (mounted) {
            setSession(data.session);
            setLoading(false);
          }
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (e) {
        console.error("[AuthProvider] Fatal auth initialization error:", e);
        if (mounted) {
          setError(e instanceof Error ? e : new Error("Auth initialization failed"));
          setLoading(false);
        }
      }
    }

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      cleanup.then((fn) => fn?.());
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log("[AuthProvider] Signing out...");
      await supabase.auth.signOut();
      setSession(null);
    } catch (e) {
      console.error("[AuthProvider] Sign out error:", e);
    }
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    loading,
    error,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
