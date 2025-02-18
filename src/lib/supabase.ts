import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a single Supabase client instance for the entire app
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV,
    storage: window.localStorage,
    storageKey: 'aizily-auth-token'
  },
  global: {
    headers: {
      'X-Client-Info': 'aizily-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export the same instance for auth-specific usage
export const supabaseClient = supabase;

export const handleSupabaseError = (error: any): string => {
  console.error('Supabase Error Details:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
    status: error.status
  });
  
  switch (error.code) {
    case 'PGRST116':
      return 'Aucune donnée trouvée';
    case '42703':
      return 'Erreur de schéma de base de données';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/user-not-found':
      return 'Utilisateur non trouvé';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case '23505':
      return 'Cette ressource existe déjà';
    default:
      return error.message || 'Une erreur est survenue';
  }
};

export const isAuthenticated = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};