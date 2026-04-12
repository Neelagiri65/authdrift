// TRUE POSITIVE: NextAuth using prisma.user.findFirst with email
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const existing = await prisma.user.findFirst({ where: { email: user.email } });
      if (existing) {
        return true;
      }
      return false;
    },
  },
});
