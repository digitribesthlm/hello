import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { db } = await connectToDatabase();
          console.log('Attempting login with username:', credentials.username);

          const user = await db.collection('users').findOne({
            username: credentials.username,
            password: credentials.password  // In production, use hashed passwords
          });

          console.log('Database response:', user ? 'User found' : 'User not found');

          if (user) {
            return {
              id: user._id.toString(),
              name: user.username,
              email: user.email || 'admin@example.com'
            };
          }
          return null;

        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
      }
      return session
    }
  }
})

export { handler as GET, handler as POST }