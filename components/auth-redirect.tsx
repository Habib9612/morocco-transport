"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AuthRedirectProps {
  redirectTo: string
  requireAuth?: boolean
}

export default function AuthRedirect({ redirectTo, requireAuth = true }: AuthRedirectProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If authentication is required but user is not authenticated, redirect
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
    }

    // If user is authenticated but shouldn't be on this page, redirect
    if (!requireAuth && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, redirectTo, requireAuth, router])

  return null
}
