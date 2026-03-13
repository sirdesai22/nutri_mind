import React, { createContext, useContext } from 'react';
import { usePostHog } from 'posthog-react-native';

type Analytics = {
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  reset: () => void;
};

const noop: Analytics = {
  capture: () => {},
  identify: () => {},
  reset: () => {},
};

const AnalyticsContext = createContext<Analytics>(noop);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  const value: Analytics = posthog
    ? {
        capture: (event, props) => posthog.capture(event, props),
        identify: (userId, traits) => posthog.identify(userId, traits),
        reset: () => posthog.reset(),
      }
    : noop;
  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics(): Analytics {
  return useContext(AnalyticsContext);
}

export function NoopAnalyticsProvider({ children }: { children: React.ReactNode }) {
  return <AnalyticsContext.Provider value={noop}>{children}</AnalyticsContext.Provider>;
}
