import { Navigate } from "react-router-dom";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { paths } from "@/routes/paths";

const highlights = [
  {
    title: "Visão financeira clara",
    description: "Saldo, entradas e saídas organizados em um dashboard enxuto.",
    icon: TrendingUp,
  },
  {
    title: "Transferência validada",
    description: "Fluxo com RHF + Zod e atualização imediata do dashboard.",
    icon: ShieldCheck,
  },
  {
    title: "Interface moderna",
    description: "Editorial, responsiva e com foco total em legibilidade.",
    icon: Sparkles,
  },
] as const;

export function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate replace to={paths.dashboard} />;
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#e9f3f5_0%,#f5f8fb_100%)] transition-colors dark:bg-[linear-gradient(180deg,#050b12_0%,#07111b_100%)]">
      <div className="min-h-screen w-full lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(440px,30vw)] 2xl:grid-cols-[minmax(0,1fr)_560px]">
        <section className="flex bg-[#06113b] px-6 py-8 text-slate-50 sm:px-10 sm:py-10 lg:px-12 lg:py-12 xl:px-16 2xl:px-20">
          <div className="mx-auto flex w-full max-w-[880px] flex-col">
            <div className="flex items-center justify-between gap-4">
              <p className="text-2xl font-semibold tracking-tight text-white">
                Onda Finance
              </p>
            </div>

            <div className="mt-28 max-w-[720px]">
              <h1 className="max-w-[640px] text-5xl font-semibold tracking-tight text-white sm:text-6xl 2xl:max-w-[700px] 2xl:text-[4.5rem] 2xl:leading-[0.98]">
                Excelência institucional, navegação sob medida.
              </h1>
              <p className="mt-6 max-w-[620px] text-base leading-8 text-slate-300 sm:text-xl">
                Gerencie ativos globais com a infraestrutura robusta que seu
                portfólio exige e a clareza que você merece.
              </p>
            </div>

            <div className="mt-10 grid max-w-[860px] gap-4 md:grid-cols-3">
              {highlights.map(({ description, icon: Icon, title }) => (
                <article
                  className="min-w-0 rounded-[1.6rem] border border-white/8 bg-white/6 p-5 backdrop-blur"
                  key={title}
                >
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#102452] text-teal-300">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h2 className="mt-5 break-words text-base leading-[1.15] font-semibold text-white">
                    {title}
                  </h2>
                  <p className="mt-3 text-[0.875rem] leading-7 text-slate-300">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="flex bg-white px-6 py-8 transition-colors dark:bg-[#07111b] sm:px-10 sm:py-10 lg:border-l lg:border-slate-200/80 lg:px-12 lg:py-12 dark:lg:border-white/10">
          <div className="mx-auto flex w-full max-w-md flex-col xl:max-w-lg">
            <div className="flex justify-end">
              <ThemeToggle compact />
            </div>

            <div className="mt-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300">
                  Acesso seguro
                </p>
                <h2 className="mt-4 max-w-sm text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                  Entre para acessar sua plataforma financeira.
                </h2>
              </div>

              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
