import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

// NOTE: @auth/prisma-adapter is the maintained adapter for NextAuth v4 + Prisma v5.
// If you prefer to skip the adapter (e.g. WP-only auth), simply remove the `adapter` line.

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma) as any,   // enable when @auth/prisma-adapter is installed
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/signin',
    newUser: '/dashboard'
  },
  providers: [
    CredentialsProvider({
      name: 'Email & password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.role = (user as any).role ?? 'STUDENT';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler };
