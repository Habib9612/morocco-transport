import type { Metadata } from "next"
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: "Morocco Transport Application",
  description: "Comprehensive logistics and transportation management platform for Morocco.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}