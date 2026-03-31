import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const themeStorageKey = "onda-finance.theme";

export type ThemePreference = "light" | "dark";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

const initialThemeState: Pick<ThemeStore, "preference"> = {
  preference: "light",
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      ...initialThemeState,
      setPreference(preference) {
        set({
          preference,
        });
      },
    }),
    {
      name: themeStorageKey,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preference: state.preference,
      }),
    },
  ),
);

export function resetThemeStore() {
  useThemeStore.setState(initialThemeState);
  localStorage.removeItem(themeStorageKey);
}
