import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResult, SessionUser } from "@/types";
import { authApi } from "@/api";
import { ApiError } from "@/lib/api";
import { clearSessionTokens, setUnauthorizedHandler } from "@/lib/session";

interface AuthState {
  user: SessionUser | null;
  pendingChallengeId: string | null;
  devCode: string | null;
  error: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  cancelTwoFactor: () => void;
  logout: () => Promise<void>;
  bootstrap: () => Promise<void>;
}

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      pendingChallengeId: null,
      devCode: null,
      error: null,
      initializing: true,

      login: async (email, password) => {
        set({ error: null });
        try {
          const result = await authApi.login(email, password);

          if (result.requiresTwoFactor) {
            set({
              pendingChallengeId: result.challengeId ?? null,
              devCode: result.devCode ?? null,
            });
            return {
              requiresTwoFactor: true,
              challengeId: result.challengeId,
              devCode: result.devCode,
            };
          }

          set({ user: result.user ?? null, error: null });
          return { requiresTwoFactor: false };
        } catch (error) {
          set({ error: toMessage(error) });
          return { requiresTwoFactor: false };
        }
      },

      verifyTwoFactor: async (code) => {
        const challengeId = get().pendingChallengeId;
        if (!challengeId) {
          set({
            error: "Your verification session expired. Please log in again.",
          });
          return false;
        }

        set({ error: null });
        try {
          const user = await authApi.verifyTwoFactor(challengeId, code);
          set({
            user,
            pendingChallengeId: null,
            devCode: null,
            error: null,
          });
          return true;
        } catch (error) {
          set({ error: toMessage(error) });
          return false;
        }
      },

      cancelTwoFactor: () =>
        set({ pendingChallengeId: null, devCode: null, error: null }),

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          clearSessionTokens();
          set({
            user: null,
            pendingChallengeId: null,
            devCode: null,
            error: null,
          });
        }
      },

      bootstrap: async () => {
        set({ initializing: true });
        try {
          const user = await authApi.me();
          set({ user, initializing: false });
        } catch {
          clearSessionTokens();
          set({ user: null, initializing: false });
        }
      },
    }),
    {
      name: "ltb-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);

setUnauthorizedHandler(() => {
  useAuthStore.setState({ user: null });
});
