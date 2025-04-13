
import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
// These are automatically set by the Lovable Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a placeholder client for when the environment variables aren't available
// This helps prevent immediate crashes during development
let supabase;

// Check if Supabase is properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are missing. Authentication features will not work until you connect your Supabase project.');
  // Create a mock client that will log warnings instead of throwing errors
  supabase = {
    auth: {
      signUp: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: null, error: new Error('Supabase not configured') };
      },
      signInWithPassword: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: null, error: new Error('Supabase not configured') };
      },
      signOut: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { error: new Error('Supabase not configured') };
      },
      getUser: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: null, error: new Error('Supabase not configured') };
      },
      updateUser: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: null, error: new Error('Supabase not configured') };
      },
      resetPasswordForEmail: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: null, error: new Error('Supabase not configured') };
      },
      onAuthStateChange: () => {
        console.warn('Supabase is not configured. Please connect your Supabase project to enable authentication.');
        return { data: { subscription: { unsubscribe: () => {} } }, error: null };
      }
    }
  };
} else {
  // Create the real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Helper Types for better TypeScript support
export type User = {
  id: string;
  email: string;
  full_name?: string;
};

// Auth functions
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      }
    }
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}

export async function updateProfile(fullName: string) {
  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });
  
  return { data, error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { data, error };
}
