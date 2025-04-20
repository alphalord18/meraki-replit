import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

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