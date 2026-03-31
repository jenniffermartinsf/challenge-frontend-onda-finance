import { Navigate } from "react-router-dom";
import { ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { demoCredentials } from "@/mocks/user";
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d9f4ef_0%,transparent_38%),linear-gradient(180deg,#f7f8fb_0%,#eef4f6_48%,#f7f9fb_100%)] px-4 py-6 transition-colors dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12)_0%,transparent_34%),linear-gradient(180deg,#07111b_0%,#0c1724_48%,#050b12_100%)] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/75 bg-slate-950 p-8 text-slate-50 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.8)] sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-200">
            Onda Finance
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Controle seu dinheiro com uma experiência leve, segura e elegante.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Este mock foi pensado para o teste técnico: fluxo ponta a ponta,
            validação correta, layout responsivo e base pronta para escalar.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map(({ description, icon: Icon, title }) => (
              <article
                className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4"
                key={title}
              >
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/10 text-teal-200">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-medium text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[2rem] border border-white/80 bg-white/92 p-8 shadow-[0_35px_90px_-55px_rgba(15,23,42,0.55)] backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-950/82 dark:shadow-[0_35px_90px_-50px_rgba(2,6,23,0.95)] sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-700 dark:text-teal-300">
                  Login mock
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  Entre para visualizar seu dashboard financeiro.
                </h2>
              </div>
              <ThemeToggle compact />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              O acesso já vem preenchido para facilitar a avaliação do fluxo.
              Você também pode editar os campos e testar as validações.
            </p>

            <div className="mt-6 rounded-[1.6rem] border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900 dark:border-teal-400/15 dark:bg-teal-400/10 dark:text-teal-100">
              <p className="font-medium">Credenciais mock</p>
              <p className="mt-1 break-all text-teal-800 dark:text-teal-100">
                {demoCredentials.email} • {demoCredentials.password}
              </p>
            </div>

            <div className="mt-8">
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
