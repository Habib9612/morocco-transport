"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { UserType } from "@/components/user-type-selector"
import { useTranslation } from "@/lib/translation-context"

interface User {
  id: string
  email: string
  name: string
  userType: UserType
  company?: string
  location?: {
    lat: number
    lng: number
    address: string
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, userType: UserType) => Promise<void>
  signup: (email: string, password: string, name: string, userType: UserType) => Promise<void>
  logout: () => void
  isLoading: boolean
  updateUserLocation: (location: { lat: number; lng: number; address: string }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { t } = useTranslation()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("logisticsUser")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, userType: UserType) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name: email.split("@")[0],
        userType,
        location: {
          lat: 40.7128,
          lng: -74.006,
          address: "New York, NY",
        },
      }

      setUser(mockUser)
      localStorage.setItem("logisticsUser", JSON.stringify(mockUser))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string, userType: UserType) => {
    setIsLoading(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful signup
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        userType,
        location: {
          lat: 40.7128,
          lng: -74.006,
          address: "New York, NY",
        },
      }

      setUser(mockUser)
      localStorage.setItem("logisticsUser", JSON.stringify(mockUser))
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("logisticsUser")
    router.push("/login")
  }

  const updateUserLocation = (location: { lat: number; lng: number; address: string }) => {
    if (user) {
      const updatedUser = { ...user, location }
      setUser(updatedUser)
      localStorage.setItem("logisticsUser", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, updateUserLocation }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
