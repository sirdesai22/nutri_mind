import { useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useConfigStore } from '@/store/configStore';
import type { Profile } from '@/types/nutrition';

const TRIAL_MS = 3 * 24 * 60 * 60 * 1000;

export interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  setupComplete: boolean;
  isTrialActive: boolean;
  trialDaysRemaining: number;
  subscriptionStatus: 'none' | 'trial' | 'lifetime';
  signOut: () => Promise<void>;
  refetchProfile: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id).then((p) => {
          setProfile(p);
          if (p?.subscription_status) {
            useConfigStore.getState().setSubscriptionStatus(p.subscription_status as 'none' | 'trial' | 'lifetime');
          }
        });
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        const p = await fetchProfile(s.user.id);
        setProfile(p);
        if (p?.subscription_status) {
          useConfigStore.getState().setSubscriptionStatus(p.subscription_status as 'none' | 'trial' | 'lifetime');
        }
      } else {
        setProfile(null);
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const refetchProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
      if (p?.subscription_status) {
        useConfigStore.getState().setSubscriptionStatus(p.subscription_status as 'none' | 'trial' | 'lifetime');
      }
    }
  };

  const { isTrialActive, trialDaysRemaining } = useMemo(() => {
    if (!profile?.trial_started_at) return { isTrialActive: false, trialDaysRemaining: 0 };
    const started = new Date(profile.trial_started_at).getTime();
    const now = Date.now();
    const elapsed = now - started;
    const remaining = Math.max(0, Math.ceil((TRIAL_MS - elapsed) / (24 * 60 * 60 * 1000)));
    return {
      isTrialActive: elapsed < TRIAL_MS,
      trialDaysRemaining: Math.min(3, remaining),
    };
  }, [profile?.trial_started_at]);

  const subscriptionStatus = (profile?.subscription_status ?? 'none') as 'none' | 'trial' | 'lifetime';

  const setupComplete = (() => {
    if (subscriptionStatus === 'lifetime') return true;
    if (isTrialActive) return true;
    const { mode, hasApiKey } = useConfigStore.getState();
    if (mode === 'byok' && hasApiKey) return true;
    return false;
  })();

  return {
    session,
    user,
    profile,
    loading,
    setupComplete,
    isTrialActive,
    trialDaysRemaining,
    subscriptionStatus,
    signOut,
    refetchProfile,
  };
}
