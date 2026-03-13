import { NextResponse } from 'next/server';
import { analyzeFood } from '@/lib/gemini';
import { verifySupabaseJwt } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import type { AnalyzeFoodRequest } from '@/lib/types';

function isApiKeyError(error: unknown): boolean {
  const messages: string[] = [];
  if (error instanceof Error) {
    messages.push(error.message);
    if (error.cause instanceof Error) messages.push(error.cause.message);
    else if (error.cause) messages.push(String(error.cause));
  } else {
    messages.push(String(error));
  }
  const combined = messages.join(' ').toLowerCase();
  return (
    combined.includes('api key') ||
    combined.includes('api_key') ||
    combined.includes('invalid_argument') ||
    combined.includes('expired') ||
    combined.includes('api_key_invalid')
  );
}

export async function POST(request: Request) {
  try {
    const user = await verifySupabaseJwt(request);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('subscription_status, trial_started_at, created_at')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[api/analyze-food] profile fetch error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found. Please complete signup.' },
        { status: 403 }
      );
    }

    const isLifetime = profile?.subscription_status === 'lifetime';
    const trialStart = profile?.trial_started_at ?? profile?.created_at;
    const trialMs = 3 * 24 * 60 * 60 * 1000;
    const isTrial =
      (profile?.subscription_status === 'trial' || profile?.subscription_status === 'none') &&
      trialStart &&
      Date.now() - new Date(trialStart).getTime() < trialMs;

    if (!isLifetime && !isTrial) {
      return NextResponse.json(
        { error: 'Trial expired or subscription required' },
        { status: 403 }
      );
    }

    const body = (await request.json()) as unknown;
    const { foodDescription } = body as AnalyzeFoodRequest;

    if (typeof foodDescription !== 'string' || !foodDescription.trim()) {
      return NextResponse.json(
        { error: 'foodDescription is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const result = await analyzeFood(foodDescription.trim());
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/analyze-food]', error);

    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (isApiKeyError(error)) {
      return NextResponse.json(
        {
          error: 'API key invalid or expired. Set a valid GEMINI_API_KEY in server .env and restart the server.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    );
  }
}
