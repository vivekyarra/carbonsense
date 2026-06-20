/**
 * @file Authentication context provider.
 */

import { createContext, useState, useEffect, useCallback } from 'react';
import api, { setToken } from '../services/api';

export const AuthContext = createContext();

/**
 *
 * @param root0
 * @param root0.children
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
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
   *
   * @param email
   * @param password
   */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  /**
   *
   * @param email
   * @param password
   * @param name
   */
  const register = async (email, password, name) => {
    const res = await api.post('/auth/register', { email, password, name });
    setToken(res.data.accessToken);
    setUser(res.data.user);
  };

  /**
   *
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors on logout
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
