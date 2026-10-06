import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error:", error, errorInfo);
  }

  public handleReload = () => {
    window.location.href = window.location.origin + window.location.pathname;
  };

  public handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.hash = "#/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200 text-center space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-serif text-slate-900">
                नयाँदृष्टि पोर्टल लोड हुन सकेन
              </h2>
              <p className="text-sm text-slate-600">
                पृष्ठ लोड गर्दा प्राविधिक समस्या उत्पन्न भयो। कृपया रिफ्रेस गर्नुहोस् वा गृहपृष्ठमा जानुहोस्।
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-100 p-3 rounded-lg text-left text-xs text-slate-700 font-mono overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                पुनः लोड गर्नुहोस्
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                गृहपृष्ठ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
