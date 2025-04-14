
import { createClient } from '@supabase/supabase-js';

// Supabase-Client aus der Lovable-Integration verwenden
import { supabase } from "@/integrations/supabase/client";

// Helper Types für bessere TypeScript-Unterstützung
export type User = {
  id: string;
  email: string;
  full_name?: string;
};

// Auth-Funktionen
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

// Exportiere den Supabase-Client für direkten Zugriff
export { supabase };
