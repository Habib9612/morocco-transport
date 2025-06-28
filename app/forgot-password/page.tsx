"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Truck, ChevronLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateForm = () => {
    if (!email) {
      setError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simulate API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setIsSubmitted(true)
    } catch (error) {
      console.error("Password reset error:", error)
      setError("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full filter blur-3xl" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="h-6 w-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
          </div>
          <span className="font-bold text-xl text-white">FleetSync</span>
        </Link>

        <Link href="/login">
          <Button
            variant="outline"
            size="sm"
            className="border-[#2d3748] text-gray-300 hover:text-white hover:bg-[#2d3748]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="w-full max-w-md bg-[#1e293b] border-[#2d3748] text-white shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (error) setError("")
                      }}
                      className={`bg-[#111827] border-[#2d3748] text-white placeholder:text-gray-500 h-10 ${
                        error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-500"
                      }`}
                      disabled={isLoading}
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="py-4">
                  <div className="rounded-full bg-blue-600/20 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="text-center text-green-400 mb-2">Reset link sent!</p>
                  <p className="text-center text-gray-400 text-sm">
                    We&apos;ve sent a password reset link to <span className="font-medium text-white">{email}</span>. Please
                    check your inbox and follow the instructions to reset your password.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-center w-full text-sm text-gray-400">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
                  Back to login
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
