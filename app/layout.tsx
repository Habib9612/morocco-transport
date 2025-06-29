import { Metadata } from 'next'
import './globals.css'
<<<<<<< HEAD
import { AuthProvider } from '../lib/auth-context';
=======
import { AuthProvider } from '../lib/auth-context'
>>>>>>> 94ceef641d456dbf9d1363a1707df2939762d46d

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