import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '../../context/AuthContext';
import { useAuth } from '../../hooks/useAuth';
import api, { getToken } from '../../services/api';

vi.mock('../../services/api', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    default: {
      post: vi.fn(),
    },
  };
});

describe('AuthProvider', () => {
  beforeEach(() => {
    api.post.mockReset();
    api.post.mockImplementation((url) => {
      if (url === '/auth/session') {
        return Promise.resolve({ data: { user: null } });
      }
      return Promise.reject(new Error('unexpected request'));
    });
  });

  it('sends the complete registration object and stores the returned user', async () => {
    const registration = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      daily_target_kg: 12,
    };
    api.post.mockImplementation((url) => {
      if (url === '/auth/session') {
        return Promise.resolve({ data: { user: null } });
      }
      return Promise.resolve({
        data: {
          accessToken: 'access-token',
          user: { id: 1, name: registration.name, email: registration.email },
        },
      });
    });

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register(registration);
    });

    expect(api.post).toHaveBeenCalledWith('/auth/register', registration);
    expect(result.current.user.email).toBe(registration.email);
    expect(getToken()).toBe('access-token');
  });

  it('restores an existing session', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        accessToken: 'restored-token',
        user: { id: 1, email: 'existing@example.com', name: 'Existing' },
      },
    });
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user.email).toBe('existing@example.com');
  });

  it('logs in and logs out while keeping client state consistent', async () => {
    api.post.mockImplementation((url) => {
      if (url === '/auth/session') {
        return Promise.resolve({ data: { user: null } });
      }
      if (url === '/auth/login') {
        return Promise.resolve({
          data: {
            accessToken: 'login-token',
            user: { id: 2, email: 'login@example.com', name: 'Login' },
          },
        });
      }
      return Promise.reject(new Error('server unavailable'));
    });
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login('login@example.com', 'Password123!');
    });
    expect(result.current.user.email).toBe('login@example.com');
    expect(getToken()).toBe('login-token');

    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(getToken()).toBeNull();
  });
});
