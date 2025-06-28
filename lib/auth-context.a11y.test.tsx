import { render, screen, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { AuthProvider } from './auth-context';
import { LoginForm, SignupForm, UserProfile } from './auth-components';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from './i18n-context';

expect.extend(toHaveNoViolations);

describe('Authentication Components Accessibility', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('login form has no accessibility violations', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'No session' }),
      })
    );

    let container;
    await act(async () => {
      const result = render(
        <I18nProvider>
          <AuthProvider>
            <LoginForm />
          </AuthProvider>
        </I18nProvider>
      );
      container = result.container;
    });

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('signup form has no accessibility violations', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'No session' }),
      })
    );

    let container;
    await act(async () => {
      const result = render(
        <I18nProvider>
          <AuthProvider>
            <SignupForm />
          </AuthProvider>
        </I18nProvider>
      );
      container = result.container;
    });

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('user profile has no accessibility violations', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'individual',
          },
        }),
      })
    );

    const { container } = render(
      <I18nProvider>
        <AuthProvider>
          <UserProfile />
        </AuthProvider>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('forms have proper label associations', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'No session' }),
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('interactive elements are keyboard accessible', async () => {
    const user = userEvent.setup();
    render(
      <I18nProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Check that we can tab through the form
    await user.tab();
    expect(emailInput).toHaveFocus();
    await user.tab();
    expect(passwordInput).toHaveFocus();
    await user.tab();
    expect(submitButton).toHaveFocus();
  });

  it('form inputs have proper aria attributes', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'No session' }),
      })
    );

    render(
      <I18nProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </I18nProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(passwordInput).toHaveAttribute('aria-required', 'true');
  });

  it('error messages are announced to screen readers', async () => {
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: null })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      }));

    render(
      <I18nProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent('Invalid credentials');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
    });
  });

  it('loading states are properly announced', async () => {
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: null })
      }))
      .mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: () => Promise.resolve({ user: null })
      }), 100)));

    render(
      <I18nProvider>
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      </I18nProvider>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // Check loading state
    await waitFor(() => {
      const loadingSpinner = screen.getByRole('status');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveAttribute('aria-label', 'Loading');
    });
  });
}); 