/** Normalized nutrition info used throughout the app */
export interface NutritionInfo {
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
}

/** Raw Gemini API response (prompt contract v1) */
export interface GeminiNutritionResponse {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  foods?: Array<{ name: string; calories: number; quantity: string }>;
  confidence?: 'high' | 'medium' | 'low';
}

export interface MealEntry {
  time: string;
  food: string;
  calories: number;
  macros: {
    carbs: number;
    protein: number;
    fats: number;
  };
}

export interface DailyData {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  meals: MealEntry[];
}

export interface Profile {
  id: string;
  setup_complete: boolean;
  subscription_status: 'none' | 'trial' | 'lifetime';
  trial_started_at: string | null;
  api_key_ref: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  status: 'pending' | 'captured' | 'failed';
  created_at: string;
}

/** Convert Gemini response to NutritionInfo */
export function geminiResponseToNutritionInfo(res: GeminiNutritionResponse): NutritionInfo {
  return {
    calories: typeof res.calories === 'number' ? res.calories : 0,
    macros: {
      carbs: typeof res.carbs === 'number' ? res.carbs : 0,
      protein: typeof res.protein === 'number' ? res.protein : 0,
      fats: typeof res.fats === 'number' ? res.fats : 0,
    },
  };
}
