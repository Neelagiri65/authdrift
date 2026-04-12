// TRUE POSITIVE: NextAuth using db.user.findUnique with email (db prefix instead of prisma)
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '@/lib/db';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const existing = await db.user.findUnique({ where: { email: user.email } });
      if (!existing) {
        await db.user.create({ data: { email: user.email, name: user.name } });
      }
      return true;
    },
  },
});
