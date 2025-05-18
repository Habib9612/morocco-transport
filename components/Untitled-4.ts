__tests__/api-integration.test.tsx
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { api } from '../lib/api-client';
import { useApiGet, useApiPost } from '../hooks/useApi';
import { Loading } from '../components/loading';
import { AuthProvider } from '../lib/auth-context';
import { I18nProvider } from '../lib/i18n-context';

// Sample data structures
interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Mock API endpoint
const API_URL = 'http://localhost:8080/api';

// Set up MSW server to mock API responses
const server = setupServer(
  // GET users endpoint
  rest.get(`${API_URL}/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json<User[]>([
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ])
    );
  }),
  
  // GET user by ID endpoint
  rest.get(`${API_URL}/users/:id`, (req, res, ctx) => {
    const id = req.params.id;
    if (id === '1') {
      return res(
        ctx.status(200),
        ctx.json<User>({ id: 1, name: 'John Doe', email: 'john@example.com' })
      );
    }
    return res(ctx.status(404), ctx.json({ error: 'User not found' }));
  }),
  
  // POST login endpoint
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    const { email, password } = req.body as any;
    if (email === 'john@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json<LoginResponse>({
          token: 'fake-jwt-token',
          user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        })
      );
    }
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid email or password' })
    );
  })
);

// Start MSW server before tests
beforeAll(() => server.listen());
// Reset handlers between tests
afterEach(() => server.resetHandlers());
// Close server after all tests
afterAll(() => server.close());

// Test component that uses the API GET hook
function TestUserList() {
  const { data: users, loading, error } = useApiGet<User[]>('/users');
  
  if (loading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!users || users.length === 0) return <div>No users found</div>;
  
  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id} data-testid={`user-${user.id}`}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

// Test component that uses the API POST hook
function TestLoginForm() {
  const [credentials, setCredentials] = React.useState({ email: '', password: '' });
  const { data, loading, error, refetch } = useApiPost<LoginResponse>(
    '/auth/login',
    credentials,
    { manual: true }
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await refetch();
  };
  
  return (
    <div>
      {data && <div data-testid="success">Logged in as {data.user.name}</div>}
      {error && <div data-testid="error">{error.message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          data-testid="email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          data-testid="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          placeholder="Password"
        />
        <button type="submit" disabled={loading} data-testid="submit">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

// Wrapper component that provides all required context providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </I18nProvider>
  );
}

describe('API Integration Tests', () => {
  describe('API Client', () => {
    it('should fetch data correctly', async () => {
      const data = await api.get<User[]>('/users');
      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('John Doe');
    });
    
    it('should handle errors correctly', async () => {
      // Mock a server error response
      server.use(
        rest.get(`${API_URL}/users`, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );
      
      try {
        await api.get('/users');
        // This line should not be reached
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('Server error');
      }
    });
    
    it('should send POST data correctly', async () => {
      const loginData = { email: 'john@example.com', password: 'password' };
      const response = await api.post<LoginResponse>('/auth/login', loginData);
      
      expect(response.token).toBeDefined();
      expect(response.user.name).toBe('John Doe');
    });
    
    it('should handle authentication errors', async () => {
      const loginData = { email: 'john@example.com', password: 'wrong-password' };
      
      try {
        await api.post<LoginResponse>('/auth/login', loginData);
        // This line should not be reached
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeDefined();
        expect((error as Error).message).toContain('Invalid email or password');
      }
    });
  });
  
  describe('API Hooks with Components', () => {
    it('should render users from the API', async () => {
      render(<TestUserList />, { wrapper: TestWrapper });
      
      // Initially shows loading state
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Then shows the users
      await waitFor(() => {
        expect(screen.getByText('Users')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('user-1')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('user-2')).toHaveTextContent('Jane Smith');
    });
    
    it('should handle API errors gracefully', async () => {
      // Mock a server error response
      server.use(
        rest.get(`${API_URL}/users`, (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );
      
      render(<TestUserList />, { wrapper: TestWrapper });
      
      // Initially shows loading state
      expect(screen.getByRole('status')).toBeInTheDocument();
      
      // Then shows the error
      await waitFor(() => {
        expect(screen.getByText(/Error/)).toBeInTheDocument();
      });
    });
    
    it('should successfully submit login form', async () => {
      const user = userEvent.setup();
      
      render(<TestLoginForm />, { wrapper: TestWrapper });
      
      // Fill in the form
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('password'), 'password');
      
      // Submit the form
      await user.click(screen.getByTestId('submit'));
      
      // Wait for the success message
      await waitFor(() => {
        expect(screen.getByTestId('success')).toBeInTheDocument();
      });
      
      expect(screen.getByTestId('success')).toHaveTextContent('Logged in as John Doe');
    });
    
    it('should handle login failure', async () => {
      const user = userEvent.setup();
      
      render(<TestLoginForm />, { wrapper: TestWrapper });
      
      // Fill in the form with incorrect credentials
      await user.type(screen.getByTestId('email'), 'john@example.com');
      await user.type(screen.getByTestId('password'), 'wrong-password');
      
      // Submit the form
      await user.click(screen.getByTestId('submit'));
      
      // Wait for the error message
      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });
});