import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const { db } = await connectToDatabase();
          
          console.log('Login attempt with:', credentials.email);
          
          const user = await db.collection('users').findOne({
            email: credentials.email
          });
          
          if (!user) {
            console.log('No user found with email:', credentials.email);
            return null;
          }

          const isValid = credentials.password === user.password;
          console.log('Password check:', { isValid });

          if (!isValid) {
            console.log('Password mismatch');
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            clientId: user.clientId
          };

        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
});

export { handler as GET, handler as POST }