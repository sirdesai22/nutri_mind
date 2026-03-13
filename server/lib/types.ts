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

export interface AnalyzeFoodRequest {
  foodDescription: string;
}

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
