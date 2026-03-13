import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ApiMode } from '@/services/nutritionService';

const STORAGE_KEY_MODE = '@api_mode';
const STORAGE_KEY_GEMINI = '@gemini_api_key';

interface ApiKeyContextType {
  mode: ApiMode | null;
  apiKey: string;
  apiBaseUrl: string;
  isConfigured: boolean;
  setMode: (mode: ApiMode) => Promise<void>;
  setApiKey: (key: string) => Promise<void>;
  clearConfig: () => Promise<void>;
  isLoading: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const defaultBaseUrl =
  typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL
    : '';

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ApiMode | null>(null);
  const [apiKey, setApiKeyState] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const apiBaseUrl = defaultBaseUrl;

  const loadStored = useCallback(async () => {
    try {
      const [storedMode, storedKey] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_MODE),
        AsyncStorage.getItem(STORAGE_KEY_GEMINI),
      ]);
      if (storedMode === 'byok' || storedMode === 'subscription') {
        setModeState(storedMode);
      }
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    } catch (e) {
      console.error('Error loading API config:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const setMode = useCallback(async (newMode: ApiMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(STORAGE_KEY_MODE, newMode);
  }, []);

  const setApiKey = useCallback(async (key: string) => {
    setApiKeyState(key);
    await AsyncStorage.setItem(STORAGE_KEY_GEMINI, key);
  }, []);

  const clearConfig = useCallback(async () => {
    setModeState(null);
    setApiKeyState('');
    await AsyncStorage.multiRemove([STORAGE_KEY_MODE, STORAGE_KEY_GEMINI]);
  }, []);

  const isConfigured =
    mode === 'byok'
      ? apiKey.trim().length > 0
      : mode === 'subscription';

  const value: ApiKeyContextType = {
    mode,
    apiKey,
    apiBaseUrl,
    isConfigured: !!mode && isConfigured,
    setMode,
    setApiKey,
    clearConfig,
    isLoading,
  };

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey() {
  const ctx = useContext(ApiKeyContext);
  if (ctx === undefined) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return ctx;
}
