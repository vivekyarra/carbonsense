/**
 * @file Authentication context provider.
 */

import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import api, { setToken } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

/**
 * @description Provides authentication state and methods to child components.
 * @param {object} props
 * @param {import('react').ReactNode} props.children - Child components that consume auth context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * @description Fetches the current authenticated user profile from the server and updates state.
   */
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.post('/auth/session');
      if (res.data.accessToken) {
        setToken(res.data.accessToken);
      }
      setUser(res.data.user || null);
    } catch {
      // Auth token is invalid or expired — clear credentials and reset to logged-out state
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMe();
  }, [fetchMe]);

  /**
   * @description Authenticates user with email and password.
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  /**
   * @description Creates a new user account.
   * @param {object} registration - Validated registration fields.
   * @param {string} registration.email - User's email address.
   * @param {string} registration.password - User's password.
   * @param {string} registration.name - User's display name.
   * @param {number} registration.daily_target_kg - Daily emissions target.
   */
  const register = async (registration) => {
    const res = await api.post('/auth/register', registration);
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  /**
   * @description Logs out the current user and clears tokens.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Server-side logout failure is non-critical — tokens are cleared client-side regardless
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
