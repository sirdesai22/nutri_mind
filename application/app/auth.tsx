import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAnalytics } from '@/context/AnalyticsContext';
import { darkTheme, lightTheme } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import { useThemeStore } from '@/store/themeStore';

WebBrowser.maybeCompleteAuthSession();

type AuthMode = 'choose' | 'google' | 'phone' | 'otp' | 'email';

export default function AuthScreen() {
  const router = useRouter();
  const { capture } = useAnalytics();
  const isDark = useThemeStore((s) => s.isDark);
  const theme = isDark ? darkTheme : lightTheme;
  const bgBase = theme['bg-base'];
  const textPrimary = theme['text-primary'];
  const textMuted = theme['text-muted'];
  const accent = theme.accent;
  const accentFg = theme['accent-fg'] ?? (isDark ? '#0D1210' : '#FFFFFF');
  const bgCard = theme['bg-card'];
  const border = theme.border;

  const [mode, setMode] = useState<AuthMode>('choose');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
      if (!androidClientId) {
        Alert.alert('Configuration needed', 'Google Android Client ID is not set. Please configure EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID in your .env file.');
        return;
      }
      const result = await googlePromptAsync();
      if (result.type === 'success' && result.authentication) {
        const { data: userData, error: userError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: result.authentication.accessToken,
          nonce: undefined,
        });
        if (userError) throw userError;
        capture('auth_signed_in', { method: 'google' });
        router.replace('/setup');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Google sign-in failed';
      Alert.alert('Sign in failed', msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    const normalized = phone.replace(/\D/g, '');
    if (normalized.length < 10) {
      Alert.alert('Invalid phone', 'Enter a valid phone number with country code (e.g. +1234567890)');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalized.startsWith('+') ? normalized : `+${normalized}`,
      });
      if (error) throw error;
      setMode('otp');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send code';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid code', 'Enter the 6-digit code from the SMS.');
      return;
    }
    setLoading(true);
    try {
      const normalized = phone.replace(/\D/g, '');
      const phoneWithPlus = normalized.startsWith('+') ? normalized : `+${normalized}`;
      const { error } = await supabase.auth.verifyOtp({
        phone: phoneWithPlus,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      capture('auth_signed_in', { method: 'phone' });
      router.replace('/setup');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Invalid or expired code';
      Alert.alert('Verification failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Email required', 'Enter your email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email: trimmedEmail, password });
        if (error) throw error;
        if (data.session) {
          capture('auth_signed_in', { method: 'email' });
          router.replace('/setup');
        } else {
          Alert.alert('Check your email', 'We sent a confirmation link. Click it to activate your account.');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: trimmedEmail, password });
        if (error) throw error;
        capture('auth_signed_in', { method: 'email' });
        router.replace('/setup');
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      Alert.alert(isSignUp ? 'Sign up failed' : 'Sign in failed', msg);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgBase }]} edges={['top', 'left', 'right', 'bottom']}>
        <Text style={[styles.title, { color: textPrimary }]}>Create your account</Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          Sign in with Google, email, or use your phone number
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: bgCard, borderColor: border }]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
          activeOpacity={0.85}
        >
          {googleLoading ? (
            <ActivityIndicator color={textPrimary} />
          ) : (
            <>
              <Ionicons name="logo-google" size={22} color={textPrimary} style={styles.btnIcon} />
              <Text style={[styles.primaryBtnText, { color: textPrimary }]}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: bgCard, borderColor: border }]}
          onPress={() => setMode('email')}
          activeOpacity={0.85}
        >
          <Ionicons name="mail-outline" size={22} color={textPrimary} style={styles.btnIcon} />
          <Text style={[styles.primaryBtnText, { color: textPrimary }]}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: bgCard, borderColor: border }]}
          onPress={() => setMode('phone')}
          activeOpacity={0.85}
        >
          <Ionicons name="call-outline" size={22} color={textPrimary} style={styles.btnIcon} />
          <Text style={[styles.primaryBtnText, { color: textPrimary }]}>Continue with Phone</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (mode === 'phone' || mode === 'otp') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgBase }]} edges={['top', 'left', 'right', 'bottom']}>
        <TouchableOpacity onPress={() => setMode('choose')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textPrimary }]}>
          {mode === 'phone' ? 'Enter your phone number' : 'Enter verification code'}
        </Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          {mode === 'phone'
            ? 'We\'ll send you a 6-digit code'
            : `Code sent to ${phone || 'your number'}`}
        </Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrap}
        >
          {mode === 'phone' ? (
            <TextInput
              style={[styles.input, { backgroundColor: bgCard, color: textPrimary, borderColor: border }]}
              placeholder="+1 234 567 8900"
              placeholderTextColor={textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoFocus
            />
          ) : (
            <TextInput
              style={[styles.input, { backgroundColor: bgCard, color: textPrimary, borderColor: border }]}
              placeholder="000000"
              placeholderTextColor={textMuted}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />
          )}

          <TouchableOpacity
            style={[styles.cta, { backgroundColor: accent }]}
            onPress={mode === 'phone' ? handlePhoneSubmit : handleOtpVerify}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={accentFg} />
            ) : (
              <Text style={[styles.ctaText, { color: accentFg }]}>
                {mode === 'phone' ? 'Send code' : 'Verify'}
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (mode === 'email') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bgBase }]} edges={['top', 'left', 'right', 'bottom']}>
        <TouchableOpacity onPress={() => setMode('choose')} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: textPrimary }]}>
          {isSignUp ? 'Create account' : 'Sign in'}
        </Text>
        <Text style={[styles.subtitle, { color: textMuted }]}>
          {isSignUp ? 'Enter your email and choose a password' : 'Enter your email and password'}
        </Text>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputWrap}
        >
          <TextInput
            style={[styles.input, { backgroundColor: bgCard, color: textPrimary, borderColor: border }]}
            placeholder="Email"
            placeholderTextColor={textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
          <TextInput
            style={[styles.input, { backgroundColor: bgCard, color: textPrimary, borderColor: border }]}
            placeholder="Password (min 6 characters)"
            placeholderTextColor={textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.switchLink}
          >
            <Text style={[styles.switchText, { color: textMuted }]}>
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cta, { backgroundColor: accent }]}
            onPress={handleEmailSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color={accentFg} />
            ) : (
              <Text style={[styles.ctaText, { color: accentFg }]}>
                {isSignUp ? 'Create account' : 'Sign in'}
              </Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backBtn: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: fonts.syne.bold,
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fonts.manrope.regular,
    fontSize: 16,
    marginBottom: 32,
    color: '#566356',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  btnIcon: {
    marginRight: 12,
  },
  primaryBtnText: {
    fontFamily: fonts.manrope.semiBold,
    fontSize: 16,
  },
  inputWrap: {
    marginTop: 24,
  },
  switchLink: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  switchText: {
    fontFamily: fonts.manrope.regular,
    fontSize: 14,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: fonts.mono,
    fontSize: 16,
    marginBottom: 16,
  },
  cta: {
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fonts.syne.bold,
    fontSize: 17,
  },
});
