/**
 * @file Error boundary component to catch React rendering errors.
 */

import React from 'react';
import { Button } from './Button';

/**
 * @description Catches JavaScript errors anywhere in their child component tree, logs those errors, and displays a fallback UI.
 */
export class ErrorBoundary extends React.Component {
  /**
   * @param {object} props
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * @param {Error} error
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * @description Lifecycle method invoked after an error has been thrown by a descendant component.
   */
  componentDidCatch() {
    // Error boundary caught an error
    // Logger would go here in production
  }

  /**
   * @returns {import('react').ReactNode} The rendered children or the error UI.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-6">An unexpected error occurred in the application.</p>
              <Button onClick={() => window.location.reload()} variant="primary">
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
