import { lazy, Suspense } from "react";

const AppShell = lazy(async () => {
  const module = await import("@/components/common/app-shell");

  return { default: module.AppShell };
});

const DashboardPage = lazy(async () => {
  const module = await import("@/features/dashboard/pages/dashboard-page");

  return { default: module.DashboardPage };
});

const TransferPage = lazy(async () => {
  const module = await import("@/features/transfer/pages/transfer-page");

  return { default: module.TransferPage };
});

function RouteFallback() {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/85 p-6 text-sm text-slate-600 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300 dark:shadow-[0_20px_60px_-45px_rgba(2,6,23,0.95)]">
      Carregando ambiente...
    </div>
  );
}

export function AppShellRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <AppShell />
    </Suspense>
  );
}

export function DashboardPageRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <DashboardPage />
    </Suspense>
  );
}

export function TransferPageRoute() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <TransferPage />
    </Suspense>
  );
}
