// RAZORPAY: Coming soon -- route disabled

import { NextResponse } from 'next/server';

// import Razorpay from 'razorpay';
// import { verifySupabaseJwt } from '@/lib/auth';
// const razorpay = new Razorpay({ key_id: ..., key_secret: ... });

export async function POST(_request: Request) {
  return NextResponse.json({ error: 'Payments coming soon' }, { status: 503 });
}
