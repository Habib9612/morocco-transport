import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth-context';
import { I18nProvider } from './i18n-context';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const TestComponent = () => {
  const { user, loading, error, login, logout } = useAuth();
  
  return (
    <div>
      {user && <div>Logged in as {user.email}</div>}
      {loading && <div>Loading...</div>}
      {error && <div id="error">{error}</div>}
      
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles successful login', async () => {
    // Mock initial /api/auth/check
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    });
    // Mock login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: 'test@example.com' } }),
    });

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument();
    });
  });

  it('handles login error', async () => {
    // Mock initial /api/auth/check
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    });
    // Mock login error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('handles logout error', async () => {
    // Mock initial /api/auth/check
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    });
    // Mock login
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { email: 'test@example.com' } }),
    });
    // Mock logout error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Logout failed' }),
    });

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      await userEvent.click(loginButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      await userEvent.click(logoutButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Logout failed')).toBeInTheDocument();
    });
  });
});