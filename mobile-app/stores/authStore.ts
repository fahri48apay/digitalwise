import { create } from "zustand";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  isAuthenticated: false,
  setSession: (session) =>
    set({ session, isAuthenticated: !!session }),
  setLoading: (isLoading) => set({ isLoading }),
}));
