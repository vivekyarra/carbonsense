/**
 * @file Custom hook to manage local storage.
 */

import { useState, useEffect } from 'react';

/**
 * Hook to persist state in localStorage.
 * @template T
 * @param {string} key - Storage key.
 * @param {T} initialValue - Fallback value.
 * @returns {[T, import('react').Dispatch<import('react').SetStateAction<T>>]} Stored value and setter.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // localStorage may be unavailable (private browsing, storage full)
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // localStorage may be unavailable (private browsing, storage full)
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
