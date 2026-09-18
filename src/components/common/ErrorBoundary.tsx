import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

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
    console.error('GasMind ErrorBoundary caught an exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 bg-zinc-950 border border-red-900/60 rounded-xl text-white shadow-xl max-w-2xl mx-auto font-mono">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-zinc-800">
            <span className="p-2 bg-red-950/80 border border-red-800 rounded-lg text-red-400">
              <AlertCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-red-400">
                {this.props.fallbackTitle || 'Component Error Detected'}
              </h3>
              <p className="text-xs text-zinc-400">GasMind Telemetry Subsystem Recovery Handler</p>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed mb-4">
            An isolated runtime error occurred while rendering this telemetry view. The rest of the application remains functional.
          </p>

          {this.state.error && (
            <div className="p-3 bg-black border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-400 overflow-x-auto mb-4">
              {this.state.error.toString()}
            </div>
          )}

          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reload Telemetry View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
