import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Runtime error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      const stack = this.state.errorInfo?.componentStack || error?.stack || "";

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
          <div className="max-w-2xl w-full p-6 rounded-2xl bg-card border border-border shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive text-2xl mb-4">
                !
              </div>
              <h1 className="text-2xl font-semibold tracking-tight mb-2">Something went wrong</h1>
              <p className="text-sm text-muted-foreground">
                The application encountered an unexpected error. Please refresh the page.
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Error Details</p>
              <p className="text-sm font-mono text-destructive break-all">{error?.message || "Unknown error"}</p>
            </div>

            {stack && (
              <details className="bg-muted/30 rounded-xl p-4 mb-6">
                <summary className="text-xs uppercase tracking-widest text-muted-foreground cursor-pointer">
                  View Stack Trace
                </summary>
                <pre className="mt-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap overflow-x-auto max-h-60">
                  {stack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-6 py-3 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold uppercase tracking-widest hover:bg-secondary/80 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
