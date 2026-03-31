import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  MoonStar,
  Send,
  Shield,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { showInfoToast } from "@/features/feedback/store/toast-store";
import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";

const navigationItems = [
  {
    label: "Dashboard",
    to: paths.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Transferir",
    to: paths.transfer,
    icon: Send,
  },
] as const;

function NavigationLink({
  label,
  to,
  icon: Icon,
}: (typeof navigationItems)[number]) {
  return (
    <NavLink
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-slate-950 text-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.8)] dark:bg-teal-300 dark:text-slate-950"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/8 dark:hover:text-slate-50",
        )
      }
      to={to}
    >
      <Icon className="size-4" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    showInfoToast(
      "Sessão encerrada",
      "Você saiu do ambiente mock com segurança.",
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#eef4f6_42%,#f9fafb_100%)] transition-colors dark:bg-[linear-gradient(180deg,#07111b_0%,#0d1724_42%,#050b12_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.5)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[0_25px_80px_-45px_rgba(2,6,23,0.9)] lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                  Onda Finance
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  Painel pessoal
                </h2>
              </div>
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-700 dark:bg-teal-400/10 dark:text-teal-200">
                <CreditCard className="size-5" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Conta ativa
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-slate-50">
                  {user?.name}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  Ag. {user?.branch} • Conta {user?.accountNumber}
                </p>
              </div>
            </div>

            <nav aria-label="Navegação principal" className="mt-6 space-y-2">
              {navigationItems.map((item) => (
                <NavigationLink key={item.to} {...item} />
              ))}
            </nav>

            <Separator className="my-6 dark:bg-white/10" />

            <div className="rounded-[1.6rem] bg-slate-950 p-4 text-slate-50 dark:bg-white/6">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white/10 p-2">
                  <Shield className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium">Fluxo validado</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Sessão mock persistida com segurança em sessionStorage.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[1.6rem] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-950 p-2 text-white dark:bg-teal-400/15 dark:text-teal-200">
                  <MoonStar className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-950 dark:text-slate-100">
                    Preferência de tema
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    O tema pode seguir o sistema ou ser definido manualmente sem
                    impactar a sessão autenticada.
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ThemeToggle />
              </div>
            </div>

            <Button
              className="mt-6 w-full rounded-2xl dark:border-white/10 dark:bg-transparent dark:text-slate-100 dark:hover:bg-white/5"
              onClick={handleLogout}
              type="button"
              variant="outline"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sair
            </Button>
          </aside>

          <div className="space-y-4">
            <header className="rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/80 dark:shadow-[0_20px_60px_-45px_rgba(2,6,23,0.95)] lg:hidden">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                    Onda Finance
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {user?.name}
                  </p>
                </div>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Sair
                </Button>
              </div>
              <nav
                aria-label="Acesso rápido"
                className="mt-4 flex gap-2 overflow-x-auto pb-1"
              >
                {navigationItems.map((item) => (
                  <NavigationLink key={item.to} {...item} />
                ))}
              </nav>
            </header>

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
