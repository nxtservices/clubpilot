'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, AuthState, SignUpData, SignInData } from '@/types/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setState({
            user: {
              id: data.session.user.id,
              email: data.session.user.email || '',
              created_at: data.session.user.created_at || '',
            },
            loading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, loading: false }));
        }
      } catch (err) {
        console.error('Auth init error:', err);
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at || '',
          },
          loading: false,
          error: null,
        });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error, data: authData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      if (authData.user) {
        setState({
          user: {
            id: authData.user.id,
            email: authData.user.email || '',
            created_at: authData.user.created_at || '',
          },
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registratie mislukt';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw err;
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error, data: authData } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (authData.session?.user) {
        setState({
          user: {
            id: authData.session.user.id,
            email: authData.session.user.email || '',
            created_at: authData.session.user.created_at || '',
          },
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Aanmelding mislukt';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Afmelden mislukt';
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw err;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        signUp,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
