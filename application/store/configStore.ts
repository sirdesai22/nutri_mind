import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ApiMode = 'byok' | 'subscription';

const STORAGE_KEY_MODE = '@api_mode';
const SECURE_KEY_GEMINI = 'gemini_api_key';

const apiBaseUrl =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL
    : '';

interface ConfigState {
  mode: ApiMode | null;
  subscriptionStatus: 'none' | 'trial' | 'lifetime';
  hasApiKey: boolean;
  isLoading: boolean;
  isConfigured: () => boolean;
  setMode: (mode: ApiMode) => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  getApiKey: () => Promise<string | null>;
  setSubscriptionStatus: (status: 'none' | 'trial' | 'lifetime') => void;
  clearConfig: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      mode: null,
      subscriptionStatus: 'none',
      hasApiKey: false,
      isLoading: true,

      isConfigured: () => {
        const { mode, subscriptionStatus, hasApiKey } = get();
        if (mode === 'byok') return hasApiKey;
        if (subscriptionStatus === 'lifetime') return true;
        if (subscriptionStatus === 'trial') return true;
        return !!apiBaseUrl?.trim();
      },

      setMode: async (mode) => {
        set({ mode });
        await AsyncStorage.setItem(STORAGE_KEY_MODE, mode);
      },

      setApiKey: async (key) => {
        const trimmed = key.trim();
        if (trimmed) {
          await SecureStore.setItemAsync(SECURE_KEY_GEMINI, trimmed);
          set({ hasApiKey: true });
        } else {
          await SecureStore.deleteItemAsync(SECURE_KEY_GEMINI);
          set({ hasApiKey: false });
        }
      },

      getApiKey: async () => {
        return SecureStore.getItemAsync(SECURE_KEY_GEMINI);
      },

      setSubscriptionStatus: (status) => set({ subscriptionStatus: status }),

      clearConfig: async () => {
        set({ mode: null, subscriptionStatus: 'none', hasApiKey: false });
        await AsyncStorage.removeItem(STORAGE_KEY_MODE);
        await SecureStore.deleteItemAsync(SECURE_KEY_GEMINI);
      },

      hydrate: async () => {
        try {
          const storedMode = await AsyncStorage.getItem(STORAGE_KEY_MODE);
          const mode = storedMode === 'byok' || storedMode === 'subscription' ? storedMode : null;
          const key = await SecureStore.getItemAsync(SECURE_KEY_GEMINI);
          set({ mode, hasApiKey: !!key?.trim() });
        } catch (e) {
          console.error('Error hydrating config:', e);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: '@nutrimind_config',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ mode: s.mode, subscriptionStatus: s.subscriptionStatus }),
    }
  )
);
