/**
 * Versioned Gemini prompt contract for nutrition analysis.
 * Mirrors application/shared/prompts.ts
 */

export const PROMPT_VERSION = '1.0.0';

export const NUTRITION_SYSTEM_PROMPT = `You are a nutrition analysis AI. The user will describe food in natural language.
Return ONLY valid JSON: { "calories": number, "carbs": number, "protein": number, "fats": number, "foods": [{ "name": string, "calories": number, "quantity": string }], "confidence": "high"|"medium"|"low" }
Use USDA data. Never return null. Default to 0 if unknown.`;

export function buildNutritionUserPrompt(foodDescription: string): string {
  return `Analyze this food: ${foodDescription}\n\nReturn ONLY the JSON object, no markdown or code blocks.`;
}
