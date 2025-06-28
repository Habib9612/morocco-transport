"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserTypeSelector, type UserType } from "@/components/user-type-selector"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import MainNavbar from "@/components/main-navbar"
import { useTranslation } from "@/lib/translation-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState<UserType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { t } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userType) {
      setError(t("login.errorSelectType"))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await login(email, password, userType)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <MainNavbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">{t("login.title")}</h1>
            <p className="mt-2 text-sm text-gray-400">
              {t("login.createAccount")}{" "}
              <Link href="/signup" className="font-medium text-blue-500 hover:text-blue-400">
                {t("login.createAccount")}
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl">
              <UserTypeSelector selectedType={userType} onSelect={setUserType} />
            </div>

            {userType && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-xl space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t("login.email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">
                        {t("login.password")}
                      </Label>
                      <Link href="/forgot-password" className="text-sm font-medium text-blue-500 hover:text-blue-400">
                        {t("login.forgotPassword")}
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-900 bg-red-950">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? t("login.signingIn") : t("login.signIn")}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
