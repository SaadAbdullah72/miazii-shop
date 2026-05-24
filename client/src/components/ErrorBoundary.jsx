import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ [ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-6">
                        <AlertTriangle className="w-12 h-12 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        The app encountered an unexpected error. Don't worry, our team has been notified.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition-all active:scale-95"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Reload App
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
