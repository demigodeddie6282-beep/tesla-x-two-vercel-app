import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import AccountPage from "@/pages/AccountPage";
import CheckoutPage from "@/pages/CheckoutPage";
import ChatPage from "@/pages/ChatPage";
import VehiclesPage from "@/pages/VehiclesPage";
import EnergyPage from "@/pages/EnergyPage";
import RobotsPage from "@/pages/RobotsPage";
import ChargingPage from "@/pages/ChargingPage";
import CryptoPage from "@/pages/CryptoPage";
import IpoPage from "@/pages/IpoPage";
import AdminPage from "@/pages/AdminPage";
import NotFoundPage from "@/pages/NotFoundPage";

console.log("[App] Loading modules...");

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute() {
  const { session, loading, error } = useAuth();

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    console.error("[ProtectedRoute] Auth error:", error);
    return <Navigate to="/login" replace />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AppLayout() {
  return (
    <>
      <SiteNav />
      <main>
        <Outlet />
      </main>
      <SiteFooter />
      <Toaster />
    </>
  );
}

export default function App() {
  console.log("[App] Rendering App component");

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/energy" element={<EnergyPage />} />
                <Route path="/robots" element={<RobotsPage />} />
                <Route path="/charging" element={<ChargingPage />} />
                <Route path="/crypto" element={<CryptoPage />} />
                <Route path="/ipo" element={<IpoPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
