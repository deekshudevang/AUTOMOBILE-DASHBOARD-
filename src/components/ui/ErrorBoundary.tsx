import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AutoVerse ErrorBoundary Caught Error]:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-gt-obsidian text-gt-text-primary p-6 select-none font-sans">
          <div className="max-w-md w-full p-6 rounded-2xl bg-gt-basalt border border-white/10 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-gt-accent/40 flex items-center justify-center text-gt-accent mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-base font-heading font-bold text-white tracking-wide">
                {this.props.fallbackTitle || 'Workstation Recovered from Unexpected Error'}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                AutoVerse 3D protected state from crashing. You can safely reload the viewport.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-lg bg-black/60 border border-white/5 text-left text-[11px] font-mono text-zinc-400 max-h-32 overflow-y-auto">
                <p className="text-gt-accent font-bold mb-1">Error Diagnostics:</p>
                <p>{this.state.error.message || String(this.state.error)}</p>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-gt-accent hover:bg-red-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/40 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Workstation</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
