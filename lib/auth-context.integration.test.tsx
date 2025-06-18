import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './auth-context'; // Assuming auth-context is in the same dir or adjust path
import { I18nProvider } from './i18n-context'; // Assuming i18n-context is in the same dir or adjust path

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

const TestComponent = () => {
  const { user, loading, error, login, signup, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no user'}</div>
      <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
      <div data-testid="error">{error || 'no error'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('test@example.com', 'password', 'Test User', 'user')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('Auth Context Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock initial auth check
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: null })
      })
    );
  });

  it('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const loginButton = screen.getByText('Login');
    await act(async () => {
      await user.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('error')).toHaveTextContent('no error');
    });
  });

  it('handles login error', async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      })
    ); // Removed extra content inside this mock

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const loginButton = screen.getByText('Login');
    await act(async () => {
      await user.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });
  });

  it('handles successful signup', async () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: mockUser })
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const signupButton = screen.getByText('Signup');
    await act(async () => {
      await user.click(signupButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(screen.getByTestId('error')).toHaveTextContent('no error');
    });
  });

  it('handles signup error', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Email already exists' })
      })
    ); // Removed extra content inside this mock

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const signupButton = screen.getByText('Signup');
    await act(async () => {
      await user.click(signupButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Email already exists');
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });
  });

  it('handles successful logout', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      await user.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
      expect(screen.getByTestId('error')).toHaveTextContent('no error');
    });
  });

  it('handles logout error', async () => {
    mockFetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Logout failed' })
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      await user.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Logout failed');
    });
  });
});