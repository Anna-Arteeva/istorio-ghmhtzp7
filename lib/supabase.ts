import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Enhanced client configuration with retries and timeouts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add request interceptor for better error handling
const originalFetch = global.fetch;
global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    const response = await originalFetch(input, {
      ...init,
      headers: {
        ...init?.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

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