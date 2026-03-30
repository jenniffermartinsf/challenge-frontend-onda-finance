import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { api } from "@/lib/axios";
import { authStorageKey } from "@/mocks/user";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "@/features/auth/types";

type AuthStore = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
};

const initialAuthState = {
  isAuthenticated: false,
  user: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      ...initialAuthState,
      async login(credentials) {
        const response = await api.post<LoginResponse>(
          "/auth/login",
          credentials,
        );

        set({
          isAuthenticated: true,
          user: response.data.user,
        });
      },
      logout() {
        set(initialAuthState);
      },
    }),
    {
      name: authStorageKey,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export function resetAuthStore() {
  useAuthStore.setState(initialAuthState);
  sessionStorage.removeItem(authStorageKey);
}
