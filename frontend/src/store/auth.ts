import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResult, SessionUser } from "@/types";
import { demoUser } from "@/data/mock";

const DEMO_TWO_FACTOR_CODE = "123456";

interface AuthState {
  user: SessionUser | null;
  pendingEmail: string | null;
  error: string | null;
  login: (email: string, password: string) => AuthResult;
  verifyTwoFactor: (code: string) => boolean;
  cancelTwoFactor: () => void;
  logout: () => void;
}

function buildUser(email: string): SessionUser {
  return {
    id: "usr-0001",
    name: "Thandi Mokoena",
    email,
    role: "administrator",
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingEmail: null,
      error: null,

      login: (email, password) => {
        if (
          email.trim().toLowerCase() !== demoUser.email ||
          password !== demoUser.password
        ) {
          set({ error: "Those credentials don't match our records." });
          return { requiresTwoFactor: false };
        }

        set({ error: null, pendingEmail: email.trim().toLowerCase() });
        return { requiresTwoFactor: true, challengeId: "otp-sms" };
      },

      verifyTwoFactor: (code) => {
        if (code.trim() !== DEMO_TWO_FACTOR_CODE) {
          set({ error: "That verification code is incorrect or expired." });
          return false;
        }

        set((state) => ({
          user: buildUser(state.pendingEmail ?? demoUser.email),
          pendingEmail: null,
          error: null,
        }));
        return true;
      },

      cancelTwoFactor: () => set({ pendingEmail: null, error: null }),

      logout: () => set({ user: null, pendingEmail: null, error: null }),
    }),
    {
      name: "ltb-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
