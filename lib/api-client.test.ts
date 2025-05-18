import { apiClient, api } from './api-client';
import { toast } from 'sonner';

// Mock fetch
global.fetch = jest.fn();

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe('apiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('makes successful API calls', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await apiClient('/test');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/test', {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('handles API errors', async () => {
    const errorMessage = 'API Error';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    await expect(apiClient('/test')).rejects.toThrow(errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('handles network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(apiClient('/test')).rejects.toThrow('Network error');
    expect(toast.error).toHaveBeenCalledWith('Network error. Please try again.');
  });

  it('supports custom options', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const options = {
      method: 'POST',
      body: JSON.stringify({ test: true }),
      headers: { 'Custom-Header': 'test' },
    };

    await apiClient('/test', options);
    expect(global.fetch).toHaveBeenCalledWith('/test', {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Custom-Header': 'test',
      },
    });
  });

  it('can disable toast notifications', async () => {
    const errorMessage = 'API Error';
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    });

    await expect(apiClient('/test', { showToast: false })).rejects.toThrow(errorMessage);
    expect(toast.error).not.toHaveBeenCalled();
  });
});

describe('api endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('auth endpoints', async () => {
    const mockResponse = { user: { id: 1 } };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await api.auth.login({ email: 'test@test.com', password: 'password' });
    expect(global.fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
  });

  it('shipments endpoints', async () => {
    const mockResponse = { shipments: [] };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await api.shipments.getAll();
    expect(global.fetch).toHaveBeenCalledWith('/api/shipments', {
      headers: { 'Content-Type': 'application/json' },
    });
  });
}); 