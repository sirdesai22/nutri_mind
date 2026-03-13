import { supabase } from '@/lib/supabase';
import type { NutritionInfo } from '@/types/nutrition';

export async function analyzeFoodViaApi(
  baseUrl: string,
  foodDescription: string,
  accessToken?: string
): Promise<NutritionInfo> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/analyze-food`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ foodDescription: foodDescription.trim() }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(res.status === 400 ? errBody || 'Invalid request' : 'Failed to analyze food');
  }

  const data = (await res.json()) as NutritionInfo;
  if (
    typeof data?.calories !== 'number' ||
    !data?.macros ||
    typeof data.macros.carbs !== 'number' ||
    typeof data.macros.protein !== 'number' ||
    typeof data.macros.fats !== 'number'
  ) {
    throw new Error('Invalid response from API');
  }
  return data;
}

export async function analyzeFoodViaApiWithSession(
  baseUrl: string,
  foodDescription: string
): Promise<NutritionInfo> {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return analyzeFoodViaApi(baseUrl, foodDescription, token);
}
