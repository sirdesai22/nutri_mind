import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ThemeType = 'light' | 'dark';

interface ThemeState {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      isDark: false,
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === 'light' ? 'dark' : 'light';
          return { theme: next, isDark: next === 'dark' };
        }),
      setTheme: (theme) => set({ theme, isDark: theme === 'dark' }),
    }),
    {
      name: '@nutrimind_theme',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
