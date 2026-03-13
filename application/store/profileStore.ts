import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const STORAGE_KEY = '@nutrimind_profile';

export interface MacroTargets {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

export interface ProfileData {
  name: string;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  macroTargets: MacroTargets;
  profileComplete: boolean;
}

interface ProfileState {
  profile: ProfileData;
  setProfileData: (data: Partial<Omit<ProfileData, 'macroTargets'>>) => void;
  setMacroTargets: (targets: Partial<MacroTargets>) => void;
  clearProfile: () => void;
  getBmi: () => number | null;
  getMaintenanceCalories: () => number | null;
}

const DEFAULT_TARGETS: MacroTargets = {
  calories: 2000,
  carbs: 250,
  protein: 150,
  fats: 65,
};

const DEFAULT_PROFILE: ProfileData = {
  name: '',
  age: null,
  heightCm: null,
  weightKg: null,
  macroTargets: DEFAULT_TARGETS,
  profileComplete: false,
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,

      setProfileData: (data) => {
        set((state) => {
          const next: ProfileData = {
            ...state.profile,
            ...data,
          };
          const hasCore =
            !!next.name.trim() && next.age != null && next.heightCm != null && next.weightKg != null;
          next.profileComplete = hasCore;
          return { profile: next };
        });
      },

      setMacroTargets: (targets) => {
        set((state) => ({
          profile: {
            ...state.profile,
            macroTargets: {
              ...state.profile.macroTargets,
              ...targets,
            },
          },
        }));
      },

      clearProfile: () => {
        set({ profile: DEFAULT_PROFILE });
      },

      getBmi: () => {
        const { heightCm, weightKg } = get().profile;
        if (!heightCm || !weightKg) return null;
        const hMeters = heightCm / 100;
        if (hMeters <= 0) return null;
        const bmi = weightKg / (hMeters * hMeters);
        return Number.isFinite(bmi) ? Math.round(bmi * 10) / 10 : null;
      },

      getMaintenanceCalories: () => {
        const { age, heightCm, weightKg } = get().profile;
        if (!age || !heightCm || !weightKg) return null;
        // Approximate Mifflin-St Jeor without sex: use a neutral constant.
        const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        const maintenance = bmr * 1.55; // moderately active default
        return Number.isFinite(maintenance) ? Math.round(maintenance) : null;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

