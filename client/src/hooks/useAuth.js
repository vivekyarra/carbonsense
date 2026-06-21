/**
 * @file Hook to consume AuthContext.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * @description Hook to access authentication context.
 * @returns {object} Auth context with user, login, register, logout, and loading state.
 * @throws {Error} If used outside of an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
