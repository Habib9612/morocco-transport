"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => Promise<void>; // Changed to Promise<void> to align with async nature
  isLoading: boolean;
  error: string | null; // Added error field
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Removed the incorrect useEffect here as it's redefined later

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Login failed' }));
        setError(errorData.error || 'Login failed');
        console.error('Login error:', errorData.error);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected login error occurred.');
      console.error('Login error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setUser(null);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Logout failed' }));
        setError(errorData.error || 'Logout failed');
        console.error('Logout error:', errorData.error);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected logout error occurred.');
      console.error('Logout error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }), // Include name and role
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Signup failed' }));
        setError(errorData.error || 'Signup failed');
        console.error('Signup error:', errorData.error);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected signup error occurred.');
      console.error('Signup error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            setError(null);
          } else {
            setUser(null);
            setError(null); // No user in session, not an error
          }
        } else {
          setUser(null);
          // Consider not setting an error here unless the API call itself failed
          // For example, a 401 is not necessarily an "error" for checkSession, just means no active session.
          // setError('Failed to check session.');
        }
      } catch (err: any) {
        setUser(null);
        setError(err.message || 'Session check failed.');
        console.error("Session check error:", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
    error // Added error to context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
