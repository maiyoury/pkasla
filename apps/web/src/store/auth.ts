'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { User, AuthTokens } from '@/types';
import type { Session } from 'next-auth';

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  setAuth: (user: User, tokens: AuthTokens) => void;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  syncFromSession: (session: Session | null) => void;
  logout: () => void;
}

/**
 * Auth store that syncs with NextAuth session
 * This store provides a reactive interface for auth state while using NextAuth as the source of truth
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  
  /**
   * Sync auth state from NextAuth session
   * This should be called whenever the session changes
   */
  syncFromSession: (session: Session | null) => {
    if (session?.user) {
      const user = session.user as User;
      const tokens: AuthTokens | null = 
        session.accessToken && session.refreshToken
          ? {
              accessToken: session.accessToken,
              refreshToken: session.refreshToken,
            }
          : null;
      
      set({
        user,
        tokens,
        isAuthenticated: true,
      });
    } else {
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
      });
    }
  },
  
  /**
   * Set auth state (for backward compatibility)
   * Note: This doesn't persist to NextAuth - use signIn from next-auth/react instead
   */
  setAuth: (user, tokens) => {
    const userWithName = {
      ...user,
      name: user.name,
    };
    set({ user: userWithName, tokens, isAuthenticated: true });
  },
  
  /**
   * Set user (for backward compatibility)
   * Note: This doesn't persist to NextAuth - update session instead
   */
  setUser: (user) => {
    const userWithName = user
      ? {
          ...user,
          name: user.name,
        }
      : null;
    set({ user: userWithName, isAuthenticated: !!user });
  },
  
  /**
   * Set tokens (for backward compatibility)
   * Note: This doesn't persist to NextAuth - tokens come from session
   */
  setTokens: (tokens) => {
    set({ tokens });
  },
  
  /**
   * Logout (for backward compatibility)
   * Note: This clears local state - use signOut from next-auth/react for full logout
   */
  logout: () => {
    set({ user: null, tokens: null, isAuthenticated: false });
  },
}));

/**
 * Hook to automatically sync NextAuth session with auth store
 * Use this in a client component (e.g., AppProvider) to keep store in sync
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { useSyncAuthSession } from '@/store/auth';
 * 
 * export function AppProvider({ children }) {
 *   useSyncAuthSession();
 *   return <>{children}</>;
 * }
 * ```
 */
export function useSyncAuthSession() {
  const syncFromSession = useAuthStore((state) => state.syncFromSession);
  const { data: session } = useSession();
  
  // Sync session to store whenever session changes
  useEffect(() => {
    syncFromSession(session ?? null);
  }, [session, syncFromSession]);
}

/**
 * Hook to check if user is authenticated
 * This reads from the store which is synced with NextAuth session
 */
export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => state.isAuthenticated);
}

