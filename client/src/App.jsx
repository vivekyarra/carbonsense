/**
 * @file App.jsx
 */

import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Spinner } from './components/common/Spinner';

const Layout = lazy(() => import('./components/Layout/Layout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LogActivity = lazy(() => import('./pages/LogActivity'));
const History = lazy(() => import('./pages/History'));
const Tips = lazy(() => import('./pages/Tips'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

/**
 * @description Full-page loading state used while route modules load.
 * @returns {import('react').ReactNode} Accessible loading indicator.
 */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50" role="status">
      <Spinner size="lg" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

/**
 * @description Route wrapper that redirects unauthenticated users to login.
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Child components to render when authenticated.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-50"><Spinner size="lg" /></div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * @description Main application content with route definitions.
 */
function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogActivity />} />
          <Route path="/history" element={<History />} />
          <Route path="/tips" element={<Tips />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

/**
 * @description Root application component with providers and error boundary.
 */
function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<RouteFallback />}>
            <AppContent />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
