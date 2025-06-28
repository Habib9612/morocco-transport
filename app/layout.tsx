import { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../lib/auth-context'

export const metadata: Metadata = {
  title: "Morocco Transport Application",
  description: "Comprehensive logistics and transportation management platform for Morocco.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}