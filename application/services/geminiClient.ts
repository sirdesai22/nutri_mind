import { GoogleGenAI } from '@google/genai';
import type { GeminiNutritionResponse, NutritionInfo } from '@/types/nutrition';
import { geminiResponseToNutritionInfo } from '@/types/nutrition';
import { NUTRITION_SYSTEM_PROMPT, buildNutritionUserPrompt } from '@/shared/prompts';

const GEMINI_MODEL = 'gemini-2.0-flash';

export async function analyzeFoodWithKey(
  apiKey: string,
  foodDescription: string
): Promise<NutritionInfo> {
  const ai = new GoogleGenAI({ apiKey });
  const userPrompt = buildNutritionUserPrompt(foodDescription);

  const fullPrompt = `${NUTRITION_SYSTEM_PROMPT}\n\n${userPrompt}`;
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: fullPrompt,
  });

  if (!response?.text) {
    throw new Error('No response from Gemini API');
  }

  let cleanedText = response.text.trim();
  cleanedText = cleanedText.replace(/```json\n?|\n?```/g, '');
  cleanedText = cleanedText.trim();

  const raw = JSON.parse(cleanedText) as GeminiNutritionResponse;
  const nutritionInfo = geminiResponseToNutritionInfo(raw);

  if (
    typeof nutritionInfo.calories !== 'number' ||
    !nutritionInfo.macros ||
    typeof nutritionInfo.macros.carbs !== 'number' ||
    typeof nutritionInfo.macros.protein !== 'number' ||
    typeof nutritionInfo.macros.fats !== 'number'
  ) {
    throw new Error('Invalid response structure from Gemini API');
  }

  return nutritionInfo;
}
