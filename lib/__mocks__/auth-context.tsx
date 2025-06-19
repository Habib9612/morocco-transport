import { createContext, useContext } from 'react';

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'individual' as const,
};

const mockAuthContext = {
  user: mockUser,
  loading: false,
  error: null,
  login: jest.fn(),
  signup: jest.fn(),
  logout: jest.fn(),
  updateProfile: jest.fn(),
};

const AuthContext = createContext(mockAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider value={mockAuthContext}>
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