import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/app/lib/queries';
import { verifyDemoCredentials } from '@/app/lib/demo-credentials';

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (
          process.env.NODE_ENV !== 'development' ||
          !parsedCredentials.success
        ) {
          return null;
        }

        const email = parsedCredentials.data.email.toLowerCase();
        const password = parsedCredentials.data.password;
        const user = await getUserByEmail(email);

        if (!user || !verifyDemoCredentials(email, password)) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
