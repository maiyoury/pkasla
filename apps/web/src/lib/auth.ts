import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import LinkedIn from 'next-auth/providers/linkedin';
import type { User, UserRole } from '@/types';

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    status: string;
    phone?: string;
    avatar?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    accessToken?: string;
    refreshToken?: string;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        emailOrPhone: { label: 'Email or Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              emailOrPhone: credentials.emailOrPhone,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            return null;
          }

          const authData = data.data;
          const user = authData.user;
          const tokens = authData.tokens;

          if (!user || !tokens) {
            return null;
          }

          // Return user with tokens
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            phone: user.phone,
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle OAuth sign-in - link with backend API
      if (account && account.provider !== 'credentials' && user.email) {
        try {
          // Split name into firstName and lastName for OAuth providers
          const nameParts = (user.name || user.email).split(/\s+/);
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';

          // Call backend API to register/login with OAuth
          const response = await fetch(`${API_BASE_URL}/auth/oauth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              firstName,
              lastName,
              provider: account.provider,
              providerId: account.providerAccountId,
              accessToken: account.access_token,
              avatar: user.image,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const authData = data.data;
            const apiUser = authData.user;
            const tokens = authData.tokens;

            // Update user object with API response
            user.id = apiUser.id;
            user.role = apiUser.role;
            user.status = apiUser.status;
            user.avatar = apiUser.avatar || user.image;
            user.createdAt = apiUser.createdAt;
            user.updatedAt = apiUser.updatedAt;
            (user as User & { accessToken?: string; refreshToken?: string }).accessToken = tokens.accessToken;
            (user as User & { accessToken?: string; refreshToken?: string }).refreshToken = tokens.refreshToken;
            return true;
          } else {
            // OAuth API call failed - log error and prevent sign-in
            console.error('OAuth API error:', data.error || data.message || 'Unknown error');
            return false; // Prevent sign-in if backend API fails
          }
        } catch (error) {
          // Network or other error - prevent sign-in
          console.error('OAuth error:', error);
          return false; // Prevent sign-in on error
        }
      }
      // For credentials provider, always allow
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Handle OAuth callback redirects
      // If url is relative, make it absolute
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // If url is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to baseUrl
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as unknown as User;
        const userWithTokens = user as User & { accessToken?: string; refreshToken?: string };
        token.accessToken = userWithTokens.accessToken;
        token.refreshToken = userWithTokens.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const user = token.user as User;
        session.user = {
          ...user,
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: null,
        } as User & DefaultSession['user'] & { emailVerified: null };
        session.accessToken = token.accessToken as string | undefined;
        session.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

