import { Link } from "@tanstack/react-router";
import { Globe, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/vehicles", label: "Vehicles" },
  { to: "/energy", label: "Energy" },
  { to: "/charging", label: "Charging" },
  { to: "/robots", label: "Robotics" },
  { to: "/crypto", label: "Crypto" },
  { to: "/ipo", label: "Coins & IPO" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { session, signOut } = useAuth();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <nav className="flex items-center justify-between px-6 md:px-10 h-16 text-foreground">
        <Link to="/" className="text-[22px] font-extrabold tracking-tight text-primary">
          TESLA
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/admin" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5">
            Admin
          </Link>
          <button className="p-2 rounded-md hover:bg-foreground/5" aria-label="Region">
            <Globe className="w-5 h-5" />
          </button>
          {session ? (
            <>
              <Link to="/account" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5 inline-flex items-center gap-1.5">
                <User className="w-4 h-4" /> Account
              </Link>
              <button onClick={() => signOut()} className="p-2 rounded-md hover:bg-foreground/5" aria-label="Sign out">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-medium rounded-md hover:bg-foreground/5">
                Sign in
              </Link>
              <Link to="/signup" className="ml-1 px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:opacity-90">
                Sign up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-foreground/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border">
          <div className="flex flex-col p-4 gap-1">
            {[...links, { to: "/admin", label: "Admin" }].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-md hover:bg-foreground/5"
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-foreground/5">
                  Account
                </Link>
                <button onClick={() => { setOpen(false); signOut(); }} className="text-left px-4 py-3 text-sm font-medium rounded-md hover:bg-foreground/5">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md hover:bg-foreground/5">
                  Sign in
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="px-4 py-3 text-sm font-medium rounded-md bg-primary text-primary-foreground">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
