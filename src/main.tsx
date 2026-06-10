import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

console.log("[App] Starting application...");
console.log("[App] Environment check:", {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? "present" : "missing",
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? "present" : "missing",
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
});

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("[App] Root element not found");
  document.body.innerHTML = `
    <div style="padding: 2rem; text-align: center; font-family: system-ui;">
      <h1>Loading Error</h1>
      <p>The root HTML element was not found. Please refresh the page.</p>
    </div>
  `;
  throw new Error("Root element not found");
}

console.log("[App] Root element found, rendering...");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log("[App] React render initiated");
