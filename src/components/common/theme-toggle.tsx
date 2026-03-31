import { MoonStar, SunMedium } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useThemeStore,
  type ThemePreference,
} from "@/features/theme/store/theme-store";
import { cn } from "@/lib/utils";

const themeOptions: Array<{
  label: string;
  value: ThemePreference;
  icon: typeof SunMedium;
}> = [
  {
    label: "Claro",
    value: "light",
    icon: SunMedium,
  },
  {
    label: "Escuro",
    value: "dark",
    icon: MoonStar,
  },
];

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);

  return (
    <div
      aria-label="Alternar tema"
      className={cn(
        "border border-border/70 bg-background/80 p-1 shadow-sm backdrop-blur",
        compact
          ? "inline-flex items-center gap-1 rounded-full"
          : "grid w-full grid-cols-2 gap-1 rounded-[1.4rem]",
      )}
      role="group"
    >
      {themeOptions.map(({ icon: Icon, label, value }) => {
        const isActive = preference === value;

        return (
          <Button
            aria-label={`Usar tema ${label.toLowerCase()}`}
            aria-pressed={isActive}
            className={cn(
              "min-w-0 rounded-full",
              compact
                ? "px-0"
                : "h-10 w-full justify-center gap-1.5 px-2 text-xs sm:px-3 sm:text-[0.8rem]",
              isActive &&
                "bg-slate-950 text-white hover:bg-slate-900 hover:text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:hover:text-slate-950",
            )}
            key={value}
            onClick={() => setPreference(value)}
            size={compact ? "icon-sm" : "sm"}
            type="button"
            variant="ghost"
          >
            <Icon className="size-4" aria-hidden="true" />
            {compact ? (
              <span className="sr-only">{label}</span>
            ) : (
              <span>{label}</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
