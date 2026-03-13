// RAZORPAY: Coming soon -- payment flow commented out

// import * as Haptics from 'expo-haptics';
// import { Platform } from 'react-native';
// import { supabase } from '@/lib/supabase';
// import { useConfigStore } from '@/store/configStore';
// const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';
// const RAZORPAY_KEY = process.env.EXPO_PUBLIC_RAZORPAY_KEY ?? '';

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  signature?: string;
  error?: string;
}

export async function createOrder(): Promise<{ orderId: string; amount: number }> {
  // RAZORPAY: Commented out -- coming soon
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session?.access_token) throw new Error('Not authenticated');
  // const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/create-order`, {...});
  // const data = await res.json();
  // return data;
  throw new Error('Payments coming soon');
}

export async function openRazorpayCheckout(
  orderId: string,
  amount: number
): Promise<PaymentResult> {
  // RAZORPAY: Commented out -- coming soon
  // if (Platform.OS === 'web') return { success: false, error: 'Razorpay is not supported on web' };
  // const RazorpayCheckout = require('react-native-razorpay').default;
  // return new Promise((resolve) => { RazorpayCheckout.open(options)... });
  return { success: false, error: 'Payments coming soon' };
}

export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<void> {
  // RAZORPAY: Commented out -- coming soon
  // const { data: { session } } = await supabase.auth.getSession();
  // const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/verify-payment`, {...});
  throw new Error('Payments coming soon');
}

export async function completeSubscriptionFlow(): Promise<boolean> {
  // RAZORPAY: Commented out -- coming soon
  // const { orderId, amount } = await createOrder();
  // const result = await openRazorpayCheckout(orderId, amount);
  // await verifyPayment(...);
  // useConfigStore.getState().setMode('subscription');
  // useConfigStore.getState().setSubscriptionStatus('lifetime');
  return false;
}
