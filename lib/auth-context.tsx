'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
<<<<<<< HEAD
  role: 'admin' | 'carrier' | 'user';
=======
  role?: string;
>>>>>>> fa5f4e20f614a160d0af89a63263d94fc66f7f9e
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
<<<<<<< HEAD
    
=======
        
>>>>>>> fa5f4e20f614a160d0af89a63263d94fc66f7f9e
    try {
      // For demo purposes, accept specific credentials
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
    } catch (error) {
<<<<<<< HEAD
=======
      console.error('Login error:', error);
>>>>>>> fa5f4e20f614a160d0af89a63263d94fc66f7f9e
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    login,
    logout
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