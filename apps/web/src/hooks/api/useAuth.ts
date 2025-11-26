import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession, signIn, signOut } from 'next-auth/react';
import type { User, RegisterDto } from '@/types';
import { api } from '@/lib/axios-client';
import { useAuthStore } from '@/store';

/**
 * Query keys for auth
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};

/**
 * Get current authenticated user from NextAuth session
 * Falls back to API call if session data is incomplete
 */
export function useMe() {
  const { data: session, status } = useSession();
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await api.get<User>('/auth/me');
      if (!response.success) throw new Error(response.error);
      return response.data!;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: status === 'authenticated' && !!user, // Only fetch if authenticated
    initialData: (session?.user as User) || user || undefined,
  });
}

/**
 * Register mutation - registers user then signs them in with NextAuth
 */
export function useRegister() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      // Register user via API
      const response = await api.post<{ data: { user: User } }>('/auth/register', data);
      if (!response.success) throw new Error(response.error);
      
      const userData = (response.data as unknown as { data: { user: User } }).data?.user;
      if (!userData) {
        throw new Error('Registration failed - no user data returned');
      }
      
      // After successful registration, sign in with NextAuth
      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }
      
      return userData;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
}

/**
 * Refresh token mutation
 * Note: NextAuth handles token refresh automatically, but this can be used for manual refresh
 */
export function useRefreshToken() {
  const { update } = useSession();
  
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      const response = await api.post<{ tokens: { accessToken: string; refreshToken: string } }>(
        '/auth/refresh',
        { refreshToken }
      );
      if (!response.success) throw new Error(response.error);
      
      // Response structure may vary, adjust based on your API
      const responseData = response.data as 
        | { tokens?: { accessToken: string; refreshToken: string } }
        | { data?: { tokens?: { accessToken: string; refreshToken: string } } };
      
      const tokens = 
        'tokens' in responseData && responseData.tokens
          ? responseData.tokens
          : 'data' in responseData && responseData.data?.tokens
          ? responseData.data.tokens
          : null;
      
      // Update NextAuth session with new tokens
      if (tokens) {
        await update({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      }
      
      return tokens;
    },
  });
}

/**
 * Logout mutation - uses NextAuth signOut
 */
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // Call backend logout endpoint
        await api.post('/auth/logout');
      } catch (error) {
        // Even if logout fails on server, continue with client-side logout
        console.error('Logout error:', error);
      }
      
      // Sign out from NextAuth (this clears the session)
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      // Clear React Query cache
      queryClient.clear();
    },
  });
}

