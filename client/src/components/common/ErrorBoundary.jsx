/**
 * @file
 */
import React from 'react';
/** Error boundary component to catch React rendering errors.
 */


import { Button } from './Button';

/**
 *
 */
export class ErrorBoundary extends React.Component {
  /**
   *
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   *
   * @param error
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   *
   * @param error
   * @param errorInfo
   */
  componentDidCatch(error, errorInfo) {
    // Error boundary caught an error
    // Logger would go here in production
  }

  /**
   *
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
