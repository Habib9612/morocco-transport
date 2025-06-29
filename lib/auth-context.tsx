"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from './api-client'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isActive: boolean
}

interface AuthContextType {
<<<<<<< HEAD
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
=======
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
>>>>>>> 94ceef641d456dbf9d1363a1707df2939762d46d
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

<<<<<<< HEAD
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
        
    try {
      // For demo purposes, accept specific credentials
      // In production, this would be an API call
      const validCredentials = [
        { email: 'admin@moroctransit.ma', password: 'admin123', role: 'admin' },
        { email: 'carrier@moroctransit.ma', password: 'carrier123', role: 'carrier' },
        { email: 'user@moroctransit.ma', password: 'user123', role: 'user' }
      ];
      
      const validUser = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (!validUser) {
        throw new Error('Invalid email or password');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: Math.floor(Math.random() * 1000),
        email: validUser.email,
        name: validUser.role === 'admin' ? 'Admin User' : 
              validUser.role === 'carrier' ? 'Carrier User' : 'Regular User',
        role: validUser.role
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      throw err;
    } finally {
      setIsLoading(false);
=======
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        apiClient.setAuthToken(token)
        const response = await apiClient.request<User>('/auth/me')
        setUser(response.data)
      }
    } catch (error) {
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.auth.login({ email, password })
      const { user, token } = response.data
      setUser(user)
      localStorage.setItem('authToken', token)
      apiClient.setAuthToken(token)
      toast.success('Login successful!')
    } catch (error) {
      toast.error('Login failed. Please check your credentials.')
      throw error
>>>>>>> 94ceef641d456dbf9d1363a1707df2939762d46d
    }
  }

<<<<<<< HEAD
  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    logout,
    clearError
  };
=======
  const signup = async (userData: any) => {
    try {
      const response = await apiClient.auth.signup(userData)
      const { user, token } = response.data
      setUser(user)
      localStorage.setItem('authToken', token)
      apiClient.setAuthToken(token)
      toast.success('Account created successfully!')
    } catch (error) {
      toast.error('Signup failed. Please try again.')
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiClient.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('authToken')
      apiClient.setAuthToken('')
    }
  }
>>>>>>> 94ceef641d456dbf9d1363a1707df2939762d46d

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
