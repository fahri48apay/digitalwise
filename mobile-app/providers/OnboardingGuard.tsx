import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_complete";

/**
 * Hook: checks if onboarding is done.
 * Returns null while loading, true/false after check.
 */
export function useOnboardingStatus() {
  const [done, setDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((val) => {
      setDone(val === "true");
    });
  }, []);

  return done;
}

/** Call this when onboarding is finished */
export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}

/** Call this to reset onboarding (for testing) */
export async function resetOnboarding() {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}
