import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useToastStore,
  type ToastItem,
} from "@/features/feedback/store/toast-store";
import { cn } from "@/lib/utils";

const toastStyles: Record<
  ToastItem["variant"],
  { icon: typeof CheckCircle2; container: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    container:
      "border-emerald-200/80 bg-emerald-50/95 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100",
    iconColor: "text-emerald-600 dark:text-emerald-300",
  },
  error: {
    icon: TriangleAlert,
    container:
      "border-destructive/20 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/10 dark:text-red-200",
    iconColor: "text-destructive dark:text-red-300",
  },
  info: {
    icon: Info,
    container:
      "border-slate-200/80 bg-white/95 text-slate-900 dark:border-white/10 dark:bg-slate-900/95 dark:text-slate-100",
    iconColor: "text-sky-600 dark:text-sky-300",
  },
};

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <div className="flex w-full max-w-md flex-col gap-3">
        {toasts.map((toast) => {
          const config = toastStyles[toast.variant];
          const Icon = config.icon;

          return (
            <section
              className={cn(
                "pointer-events-auto rounded-[1.5rem] border px-4 py-4 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.55)] backdrop-blur transition-all",
                config.container,
              )}
              key={toast.id}
              role={toast.variant === "error" ? "alert" : "status"}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 shrink-0", config.iconColor)}>
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-6 opacity-80">
                      {toast.description}
                    </p>
                  ) : null}
                </div>
                <Button
                  aria-label="Fechar notificação"
                  className="h-8 rounded-full"
                  onClick={() => removeToast(toast.id)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
