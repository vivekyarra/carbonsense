import axios from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import api, { getToken, setToken } from '../../services/api';

describe('API client', () => {
  afterEach(() => {
    setToken(null);
    vi.restoreAllMocks();
  });

  it('stores tokens in memory and attaches bearer authorization', async () => {
    setToken('token-123');
    const requestHandler = api.interceptors.request.handlers[0].fulfilled;
    const config = await requestHandler({ headers: {} });

    expect(getToken()).toBe('token-123');
    expect(config.headers.Authorization).toBe('Bearer token-123');
  });

  it('refreshes once and retries a failed authenticated request', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: { accessToken: 'refreshed-token' },
    });
    const responseHandler = api.interceptors.response.handlers[0].rejected;
    const adapter = vi.fn(async (config) => ({
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }));

    const response = await responseHandler({
      config: { headers: {}, adapter },
      response: { status: 401 },
    });

    expect(getToken()).toBe('refreshed-token');
    expect(adapter).toHaveBeenCalledOnce();
    expect(response.data).toEqual({ ok: true });
  });

  it('clears credentials when refresh fails', async () => {
    setToken('expired-token');
    window.history.pushState({}, '', '/login');
    vi.spyOn(axios, 'post').mockRejectedValueOnce(new Error('refresh failed'));
    const responseHandler = api.interceptors.response.handlers[0].rejected;

    await expect(responseHandler({
      config: { headers: {} },
      response: { status: 401 },
    })).rejects.toThrow('refresh failed');
    expect(getToken()).toBeNull();
  });

  it('passes through non-authentication failures', async () => {
    const error = { config: {}, response: { status: 500 } };
    const responseHandler = api.interceptors.response.handlers[0].rejected;

    await expect(responseHandler(error)).rejects.toBe(error);
  });
});
