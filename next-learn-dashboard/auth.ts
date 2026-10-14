import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';

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
        return {
          id: 'development-user',
          name: email.split('@')[0],
          email,
        };
      },
    }),
  ],
});
