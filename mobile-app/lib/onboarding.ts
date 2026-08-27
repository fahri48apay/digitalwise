import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_KEY = "onboarding_complete";

/** Call this when onboarding is finished */
export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}

/** Check if onboarding is done */
export async function isOnboardingDone(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === "true";
}

/** Reset onboarding (for testing) */
export async function resetOnboarding() {
  await AsyncStorage.removeItem(ONBOARDING_KEY);
}
