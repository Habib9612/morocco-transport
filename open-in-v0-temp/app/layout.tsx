import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import MainNavbar from "@/components/main-navbar"
import { AuthProvider } from "@/lib/auth-context"
import { TranslationProvider } from "@/lib/translation-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarocTransit - Smart Logistics Solutions",
  description: "Morocco's leading logistics platform providing efficient and reliable shipping solutions",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f172a] text-white`}>
        <TranslationProvider>
          <AuthProvider>
            <MainNavbar />
            {children}
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  )
}
