// RAZORPAY: Coming soon -- route disabled

import { NextResponse } from 'next/server';

// import crypto from 'crypto';
// import { verifySupabaseJwt } from '@/lib/auth';
// import { supabaseAdmin } from '@/lib/supabase';

export async function POST(_request: Request) {
  return NextResponse.json({ error: 'Payments coming soon' }, { status: 503 });
}
