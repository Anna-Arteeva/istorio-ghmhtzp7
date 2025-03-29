import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Enhanced fetch with better error handling and CORS support
const customFetch = async (url: string, options: any = {}) => {
  try {
    // Add CORS headers for web platform
    if (Platform.OS === 'web') {
      options.headers = {
        ...options.headers,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      };
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Try to get detailed error message from response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  },
  // Add retry configuration
  fetch: customFetch,
  db: {
    schema: 'public'
  },
  // Add request timeout
  realtime: {
    timeout: 20000,
    params: {
      eventsPerSecond: 10
    }
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string
          type: string
          level: string
          image_url: string | null
          keywords: string[]
          content_json: Json | null
          audio_json: Json | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}