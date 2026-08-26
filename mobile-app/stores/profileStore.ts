import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  current_level: number;
  total_xp: number;
  weekly_xp: number;
  streak_count: number;
  onboarding_completed: boolean;
  role: "student" | "mentor" | "admin";
}

interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  addXP: (amount: number) => void;
  setLevel: (level: number) => void;
  updateStreak: (count: number) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      addXP: (amount) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, total_xp: state.profile.total_xp + amount }
            : null,
        })),
      setLevel: (level) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, current_level: level } : null,
        })),
      updateStreak: (count) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, streak_count: count } : null,
        })),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "digitalwise-profile",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
