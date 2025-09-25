import React from 'react';
import LoadingSpinner from './LoadingSpinner';

/**
 * LoadingWrapper Component
 * 
 * Wraps the app content and shows a loading state while user data is being loaded.
 * Provides a consistent loading experience across the app.
 */
const LoadingWrapper = React.memo(({ children, isLoading, error }) => {
  if (error) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100dvh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: 'calc(-1 * env(safe-area-inset-top))', bottom: 'calc(-1 * env(safe-area-inset-bottom))', left: 'calc(-1 * env(safe-area-inset-left))', right: 'calc(-1 * env(safe-area-inset-right))' }}>
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-8 text-white tracking-wide spark-font">SPARK</h1>
          <h2 className="text-xl font-semibold text-white mb-4">Failed to load data</h2>
          <p className="text-gray-300 mb-6">
            There was an error loading your data. Please try refreshing the page.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-black px-6 py-3 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#D8A159' }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 text-left">
              <summary className="text-gray-400 cursor-pointer">Error Details</summary>
              <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                {error?.toString()}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100dvh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: 'calc(-1 * env(safe-area-inset-top))', bottom: 'calc(-1 * env(safe-area-inset-bottom))', left: 'calc(-1 * env(safe-area-inset-left))', right: 'calc(-1 * env(safe-area-inset-right))' }}>
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-8 text-white tracking-wide spark-font">SPARK</h1>
          <div className="flex flex-col items-center">
            <LoadingSpinner size="large" className="mb-4" />
            <p className="text-gray-300">Loading your prompts...</p>
          </div>
        </div>
      </div>
    );
  }

  return children;
});

LoadingWrapper.displayName = 'LoadingWrapper';

export default LoadingWrapper;
