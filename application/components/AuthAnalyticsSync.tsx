import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/context/AnalyticsContext';

export function AuthAnalyticsSync() {
  const { user, profile } = useAuth();
  const { identify, reset } = useAnalytics();
  const hadUser = useRef(false);

  useEffect(() => {
    if (user && profile) {
      hadUser.current = true;
      identify(user.id, { subscription_status: profile.subscription_status });
    } else if (hadUser.current) {
      hadUser.current = false;
      reset();
    }
  }, [user, profile, identify, reset]);

  return null;
}
