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
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

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
    }
  }

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
