import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { User, AuthUser } from '../types';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, STORAGE_KEYS } from '../constants';

// Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: AuthUser | null;
  profile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Load user profile from database
  const loadUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Sign in
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Load user profile first to get complete user data
        const userProfile = await loadUserProfile(data.user.id);
        setProfile(userProfile);
        
        // Create simplified auth user (we'll use profile for complete data)
        const authUser = {
          id: data.user.id,
          email: data.user.email!,
          emailVerified: !!data.user.email_confirmed_at,
          createdAt: data.user.created_at!
        };
        
        setUser(authUser as AuthUser);
        
        // Store tokens
        if (data.session) {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.session.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.session.refresh_token);
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up
  const signUp = async (email: string, password: string, userData: Partial<User>): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            tenant_id: userData.tenantId,
            role: userData.role || 'customer',
            profile: {
              name: userData.profile?.name || '',
              phone: userData.profile?.phone
            },
            email_verified: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        // Note: User will need to verify email before being fully authenticated
        console.log(SUCCESS_MESSAGES.USER_CREATED);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error instanceof Error && error.message.includes('already registered')) {
        throw new Error(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
      }
      
      // Clear local state and storage
      setUser(null);
      setProfile(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
      
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(SUCCESS_MESSAGES.PASSWORD_RESET);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setProfile(data);
      console.log(SUCCESS_MESSAGES.USER_UPDATED);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh profile
  const refreshProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      const userProfile = await loadUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Refresh profile error:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Load user profile first
          const userProfile = await loadUserProfile(session.user.id);
          setProfile(userProfile);
          
          const authUser = {
            id: session.user.id,
            email: session.user.email!,
            emailVerified: !!session.user.email_confirmed_at,
            createdAt: session.user.created_at!
          };
          
          setUser(authUser as AuthUser);
          
          // Store tokens
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token);
        }
      } catch (error) {
        console.error('Initialize auth error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await loadUserProfile(session.user.id);
          setProfile(userProfile);
          
          const authUser = {
            id: session.user.id,
            email: session.user.email!,
            emailVerified: !!session.user.email_confirmed_at,
            createdAt: session.user.created_at!
          };
          
          setUser(authUser as AuthUser);
          
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.access_token);
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, session.refresh_token);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const contextValue: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for checking user roles
export function useUserRole() {
  const { profile } = useAuth();
  
  return {
    role: profile?.role || 'customer',
    isAdmin: profile?.role === 'super_admin',
    isTenantAdmin: profile?.role === 'tenant_admin',
    isCustomer: profile?.role === 'customer',
    canAccessTenantAdmin: profile?.role === 'super_admin' || profile?.role === 'tenant_admin',
    canAccessSystemAdmin: profile?.role === 'super_admin'
  };
}

// Hook for checking permissions
export function usePermissions() {
  const { isAdmin, isTenantAdmin } = useUserRole();
  
  return {
    canManageUsers: isAdmin,
    canManageTenants: isAdmin,
    canManageOrders: isAdmin || isTenantAdmin,
    canManageProducts: isAdmin || isTenantAdmin,
    canManageSettings: isAdmin || isTenantAdmin,
    canViewAnalytics: isAdmin || isTenantAdmin,
    canManageBilling: isAdmin,
    hasPermission: (permission: string): boolean => {
      const permissions = {
        'manage:users': isAdmin,
        'manage:tenants': isAdmin,
        'manage:orders': isAdmin || isTenantAdmin,
        'manage:products': isAdmin || isTenantAdmin,
        'manage:settings': isAdmin || isTenantAdmin,
        'view:analytics': isAdmin || isTenantAdmin,
        'manage:billing': isAdmin
      };
      
      return permissions[permission as keyof typeof permissions] || false;
    }
  };
}