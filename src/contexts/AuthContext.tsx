import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, withRetry, getConnectionStatus } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  isConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(getConnectionStatus());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check connection with retry
        const connected = await withRetry(async () => {
          const { error } = await supabase.from('profiles').select('count');
          if (error) throw error;
          return true;
        });

        setIsConnected(connected);

        // Get initial session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setUser(session?.user ?? null);

        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user ?? null);
          
          if (session?.user && event === 'SIGNED_IN') {
            try {
              await withRetry(async () => {
                const { error: profileError } = await supabase
                  .from('profiles')
                  .upsert({
                    id: session.user.id,
                    phone_number: session.user.user_metadata.phone_number,
                    full_name: session.user.email?.split('@')[0] || 'Anonymous',
                  }, {
                    onConflict: 'id'
                  });

                if (profileError) throw profileError;
              });
            } catch (error: any) {
              console.error('Profile update error:', error);
              toast.error('Failed to update profile. Will retry automatically.');
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        toast.error('Connection issues detected. Retrying...');
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Monitor connection status
    const connectionMonitor = setInterval(() => {
      setIsConnected(getConnectionStatus());
    }, 5000);

    return () => clearInterval(connectionMonitor);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await withRetry(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      if (!getConnectionStatus()) {
        throw new Error('Unable to connect. Please check your internet connection and try again.');
      } else if (error.message.includes('Invalid login')) {
        throw new Error('Invalid email or password.');
      } else {
        throw new Error('Sign in failed. Please try again.');
      }
    }
  };

  const signUp = async (email: string, password: string, phoneNumber: string) => {
    try {
      await withRetry(async () => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              phone_number: phoneNumber,
            },
          },
        });

        if (error) throw error;
      });
      
      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      if (!getConnectionStatus()) {
        throw new Error('Unable to connect. Please check your internet connection.');
      } else if (error.message.includes('email')) {
        throw new Error('This email is already registered.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const signOut = async () => {
    try {
      await withRetry(async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    isConnected
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}