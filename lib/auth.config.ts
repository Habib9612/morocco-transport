import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            action: z.enum(['login', 'signup']),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, firstName, lastName, action } = parsedCredentials.data;
          
          if (action === 'login') {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) return null;

            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (passwordsMatch) return user;
          } else if (action === 'signup') {
            if (!firstName || !lastName) return null;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
              data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role: 'USER',
              },
            });
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
