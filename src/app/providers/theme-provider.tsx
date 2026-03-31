import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { useThemeStore } from "@/features/theme/store/theme-store";

export function ThemeProvider({ children }: PropsWithChildren) {
  const preference = useThemeStore((state) => state.preference);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("dark", preference === "dark");
    root.style.colorScheme = preference;
  }, [preference]);

  return children;
}
