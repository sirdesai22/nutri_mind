import { analyzeFoodViaApiWithSession } from '@/services/apiClient';
import { analyzeFoodWithKey } from '@/services/geminiClient';
import type { NutritionInfo } from '@/types/nutrition';

export type ApiMode = 'byok' | 'subscription';

export interface NutritionServiceOptions {
  mode: ApiMode;
  apiKey?: string;
  apiBaseUrl?: string;
}

export async function analyzeFood(
  foodDescription: string,
  options: NutritionServiceOptions
): Promise<NutritionInfo> {
  const { mode, apiKey, apiBaseUrl } = options;

  if (mode === 'byok') {
    if (!apiKey?.trim()) {
      throw new Error('API key is required for Bring Your Own Key mode');
    }
    return analyzeFoodWithKey(apiKey.trim(), foodDescription.trim());
  }

  if (mode === 'subscription') {
    if (!apiBaseUrl?.trim()) {
      throw new Error('API base URL is required for subscription mode');
    }
    return analyzeFoodViaApiWithSession(apiBaseUrl.trim(), foodDescription.trim());
  }

  throw new Error('Invalid API mode');
}
