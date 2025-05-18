import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/auth-context';import { AuthProvider, useAuth } from '../auth-context';
import { AuthProvider, useAuth } from '@/auth-context';import { I18nProvider } from '@/i18n-context';const mockFetch = jest.fn();import { I18nProvider } from '@/i18n-context';
const TestComponent = 

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;() => {  const { user, loading, error, login, signup, logout } = useAuth();
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

describe(
  cdescribe('Auth Context', () => {onst user = userEvent.setup();
  const signupButton = screen.getByText('Signup');
  await act(async () => {expect(getByText('no error')).toBeInTheDocument();
    await user.click(signupButton);
v    // Setup mock fetch for tests
global.fetch = mockFetch;
});
it('should handle WebSocket connection errors', () => {
};

// Store original WebSocket
const originalWebSocket = global.WebSocket;

// Mock WebSocket constructor
global.WebSocket = jest.fn(() => mockWebSocket);

// Render component that uses WebSocket
render(
  <AuthProvider>
    <I18nProvider>
      <TestComponent />
    </I18nProvider>
  </AuthProvider>
);

// Trigger connection error
const errorEvent = new Event('error');
const eventListenerCalls = mockWebSocket.addEventListener.mock.calls;
const errorCallback = eventListenerCalls.find(call => call[0] === 'error')[1];
errorCallback(errorEvent);

// Verify error is handled correctly
expect(screen.getByTestId('error')).not.toHaveTextContent('no error');

// Restore original WebSocket
global.WebSocket = originalWebSocket;
});
 // Mock WebSocket constructor
  const mockWebSocket = {
    addEventListener: jest.fn(),
    close: jest.fn(),
    send: jest.fn()
  };
  
  // Store original WebSocket
  const originalWebSocket = global.WebSocket;
  
  // Mock WebSocket implementation
  global.WebSocket = jest.fn().mockImplementation(() => {
    // Simulate connection error
    setTimeout(() => {
  // Mock WebSocket implementation with better error handling
  global.WebSocket = jest.fn().mockImplementation(() => {
    const mockSocket = {
      addEventListener: jest.fn((event, callback) => {
        // Store error callback for later use
        if (event === 'error') {
          mockSocket.errorCallback = callback;
        }
      }),
      close: jest.fn(),
      send: jest.fn()
    };

    // Simulate connection error after a short delay
    setTimeout(() => {
      // Call the error callback if it exists
      if (mockSocket.errorCallback) {
        mockSocket.errorCallback(new Event('error'));
      }
    }, 0);

    return mockSocket;
  });    }, 0);
    return mockWebSocket;
  });
  
  // Render with auth provider
  const { getByText } = render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  
  // Expect error handling message to be displayed
  expect(getByText('Connection error. Please try again later.')).toBeInTheDocument();  
  // Restore original WebSocket
  global.WebSocket = originalWebSocket;
});
});  beforeEach(() => {
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
    
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
      });
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
    )
    const user = userEvent.setup();
    const signupButton = screen.getByText('Signup');
    await act(async () => {
      await user.click(signupButton);
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Email already exists');
    });;

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