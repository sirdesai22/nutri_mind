/** No-op: meal data stays local only (AsyncStorage/Zustand). No Supabase sync. */
export function initSyncOnForeground() {
  return () => {};
}
