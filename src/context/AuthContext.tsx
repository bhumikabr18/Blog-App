import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Session, AuthError, Profile } from '../types';

type AuthContextType = {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      setIsLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session ? { user: { id: session.user.id, email: session.user.email ?? '' } } : null);

      if (session?.user) {
        // Get profile data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(data);
      }
      
      setIsLoading(false);
    }

    // Initial session fetch
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ? { user: { id: session.user.id, email: session.user.email ?? '' } } : null);
      
      if (!session?.user) {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      // Create a profile for the new user
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').insert([
          { 
            id: user.id, 
            username: email.split('@')[0],
            full_name: fullName
          }
        ]);
      }
    }

    return { error };
  };

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};