"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string; // Changed to string to match mockUser generation
  email: string;
  name:string;
  role: 'admin' | 'carrier' | 'user'; // Added role
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: string) => Promise<void>; // Added signup
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsLoading(false);
      throw new Error('Please enter a valid email address');
    }

    if (password.length < 6) {
      setIsLoading(false);
      throw new Error('Password must be at least 6 characters');
    }

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
        id: Math.random().toString(36).substr(2, 9), // Generate a random ID
        email: validUser.email,
        name: validUser.role === 'admin' ? 'Admin User' : 
              validUser.role === 'carrier' ? 'Carrier User' : 'Regular User',
        role: validUser.role as 'admin' | 'carrier' | 'user'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));

    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw the error to be caught by the calling component
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Basic mock signup function
  const signup = async (email: string, password: string, name: string, role: string) => {
    setIsLoading(true);
    // In a real app, this would call your API and handle user creation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: role as 'admin' | 'carrier' | 'user', // Ensure role matches User type
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const value = {
    user,
    login,
    signup, // Added signup
    logout,
    isLoading
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
