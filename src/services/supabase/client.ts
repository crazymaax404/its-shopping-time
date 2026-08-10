import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ??
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  Constants.expoConfig?.extra?.supabasePublishableKey ??
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    'Supabase URL e Publishable Key são obrigatórios. Configure no app.json ou .env',
  );
}

const isSecureStoreAvailable = typeof SecureStore?.getItemAsync === 'function';

const storage =
  Platform.OS === 'web'
    ? {
        getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
        setItem: (key: string, value: string) =>
          Promise.resolve(localStorage.setItem(key, value)),
        removeItem: (key: string) =>
          Promise.resolve(localStorage.removeItem(key)),
      }
    : isSecureStoreAvailable
      ? {
          getItem: (key: string) => SecureStore.getItemAsync(key),
          setItem: (key: string, value: string) =>
            SecureStore.setItemAsync(key, value),
          removeItem: (key: string) => SecureStore.deleteItemAsync(key),
        }
      : {
          // Fallback for when SecureStore is not available
          getItem: async (key: string) => null,
          setItem: async (key: string, value: string) => {},
          removeItem: async (key: string) => {},
        };

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
