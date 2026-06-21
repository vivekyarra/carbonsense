/**
 * @file Authentication context provider.
 */

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import PropTypes from 'prop-types';
import api, { setToken } from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

/**
 * @description Provides authentication state and methods to child components.
 * @param {object} props
 * @param {ReactNode} props.children - Child components that consume auth context.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * @description Fetches the current authenticated user profile from the server and updates state.
   */
  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
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
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @param {string} name - User's display name.
   */
  const register = async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
