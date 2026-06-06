import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Create a dummy client if credentials are missing to prevent crashes
// This allows the app to run without Supabase configured
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase URL or Anon Key not found. Multiplayer features will be disabled. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file"
    );
    // Return a client with dummy values - methods will fail gracefully
    return createClient("https://placeholder.supabase.co", "placeholder-key");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "https://placeholder.supabase.co");
};

// Auth helper functions
export async function signUp(email: string, password: string, username: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    
    // Handle specific error cases
    if (error) {
      // Check if it's a 404 or network error
      if (error.message?.includes("404") || error.message?.includes("Failed to fetch")) {
        throw new Error("Unable to reach authentication server. Please check your Supabase configuration.");
      }
      throw error;
    }
    
    return { data, error };
  } catch (err: any) {
    // Re-throw with more context
    if (err.message?.includes("Failed to fetch")) {
      throw new Error("Network error. Please check your internet connection and Supabase URL.");
    }
    throw err;
  }
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
