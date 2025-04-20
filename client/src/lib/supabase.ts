import { createClient } from '@supabase/supabase-js';

// Supabase configuration with hardcoded values from .env
// In a production environment, these should be environment variables
const supabaseUrl = 'https://zfwzcmgfsgtqppzrxpiw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpmd3pjbWdmc2d0cXBwenJ4cGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTY2MzQsImV4cCI6MjA2MDYzMjYzNH0.KUEWHD8P7Vrq0SFmeLsrTxGMVpfZJHcOyd_g9aScZis';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth related functions
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error("Failed to sign in. Please check your credentials.");
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

export const onAuthChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((_, session) => {
    callback(session?.user || null);
  });
};

// Check if user is admin
export const isUserAdmin = async (user: any): Promise<boolean> => {
  if (!user) return false;
  
  try {
    // You would typically check a custom claim or a role in a users table
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data?.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

export default supabase;