import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EnhancedLoginForm } from './components:enhanced-login'
import userEvent from '@testing-library/user-event'

describe('EnhancedLoginForm', () => {
  beforeEach(() => {
    // Mock router
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
      }),
    }))
  })

  test('renders login form with all elements', () => {
    render(<EnhancedLoginForm />)
    
    expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
    expect(screen.getByText('Sign in to your MarocTransit account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
    expect(screen.getByText('Continue with Facebook')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('validates email format', async () => {
    render(<EnhancedLoginForm />)
    const emailInput = screen.getByPlaceholderText('Email address')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
    })
  })

  test('validates password requirement', async () => {
    render(<EnhancedLoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  test('shows password visibility toggle', () => {
    render(<EnhancedLoginForm />)
    
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/toggle password visibility/i)
    
    expect(passwordInput.type).toBe('password')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('text')
    
    fireEvent.click(toggleButton)
    expect(passwordInput.type).toBe('password')
  })

  test('shows loading state during submission', async () => {
    render(<EnhancedLoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Signing in...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  test('shows 2FA input when required', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ requiresTwoFactor: true }),
      } as unknown)
    );
    render(<EnhancedLoginForm />)
    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter 6-digit code')).toBeInTheDocument();
    });
    (global.fetch as jest.Mock).mockRestore();
  })

  test('handles social login clicks', () => {
    render(<EnhancedLoginForm />)
    
    const googleButton = screen.getByText('Continue with Google')
    const facebookButton = screen.getByText('Continue with Facebook')
    
    fireEvent.click(googleButton)
    // You may want to mock window.location or fetch for social login
    fireEvent.click(facebookButton)
  })

  test('accessibility: has proper ARIA labels', () => {
    render(<EnhancedLoginForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument()
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('keyboard navigation works properly', async () => {
    render(<EnhancedLoginForm />)
    const buttons = screen.getAllByRole('button');
    const googleButton = buttons.find(btn => btn.textContent?.includes('Google'));
    const facebookButton = buttons.find(btn => btn.textContent?.includes('Facebook'));
    const emailInput = screen.getByPlaceholderText('Email address') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const toggleButton = buttons.find(btn => btn.getAttribute('aria-label') === 'Toggle password visibility');
    const rememberMeCheckbox = screen.getByLabelText('Remember me');
    const forgotPasswordLink = screen.getByText('Forgot password?');
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await userEvent.tab(); // Google
    expect(document.activeElement).toBe(googleButton);
    await userEvent.tab(); // Facebook
    expect(document.activeElement).toBe(facebookButton);
    await userEvent.tab(); // Email
    expect(document.activeElement).toBe(emailInput);
    await userEvent.tab(); // Password
    expect(document.activeElement).toBe(passwordInput);
    await userEvent.tab(); // Toggle password visibility
    expect(document.activeElement).toBe(toggleButton);
    await userEvent.tab(); // Remember me
    expect(document.activeElement).toBe(rememberMeCheckbox);
    await userEvent.tab(); // Forgot password
    expect(document.activeElement).toBe(forgotPasswordLink);
    await userEvent.tab(); // Submit
    expect(document.activeElement).toBe(submitButton);
  })

  test('form resets after successful login', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as unknown)
    );
    render(<EnhancedLoginForm />)
    const emailInput = screen.getByPlaceholderText('Email address') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    // Simulate successful login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
    jest.restoreAllMocks();
  })
})

export {}