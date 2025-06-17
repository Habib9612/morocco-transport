import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EnhancedLoginForm } from '../components/enhanced-login'

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
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
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
    
    const passwordInput = screen.getByPlaceholderText('Password')
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
    // Mock the auth context to simulate 2FA requirement
    render(<EnhancedLoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    
    fireEvent.click(submitButton)
    
    // Simulate 2FA requirement response
    await waitFor(() => {
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter 6-digit code')).toBeInTheDocument()
    })
  })

  test('handles social login clicks', () => {
    const mockSocialLogin = jest.fn()
    render(<EnhancedLoginForm onSocialLogin={mockSocialLogin} />)
    
    const googleButton = screen.getByText('Continue with Google')
    const facebookButton = screen.getByText('Continue with Facebook')
    
    fireEvent.click(googleButton)
    expect(mockSocialLogin).toHaveBeenCalledWith('google')
    
    fireEvent.click(facebookButton)
    expect(mockSocialLogin).toHaveBeenCalledWith('facebook')
  })

  test('accessibility: has proper ARIA labels', () => {
    render(<EnhancedLoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('keyboard navigation works properly', () => {
    render(<EnhancedLoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    emailInput.focus()
    expect(document.activeElement).toBe(emailInput)
    
    fireEvent.keyDown(emailInput, { key: 'Tab' })
    expect(document.activeElement).toBe(passwordInput)
    
    fireEvent.keyDown(passwordInput, { key: 'Tab' })
    expect(document.activeElement).toBe(submitButton)
  })

  test('form resets after successful login', async () => {
    render(<EnhancedLoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Email address')
    const passwordInput = screen.getByPlaceholderText('Password')
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    // Simulate successful login
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
  })
})

export {}