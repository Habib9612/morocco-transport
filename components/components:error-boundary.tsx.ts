import { run } from 'node:test';
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
<p>Test error: {this.state.error?.message}</p>>        </div>
      );
    }
    
    return this.props.children;
  }    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
          <p>Test error: {this.state.error?.message}</p>
        </div>
      );        <div className="error-boundary">
          <h2>Oops! Something went wrong</h2>
<p>Test error: {this.state.error?.message}</p>>      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;npx vitest run