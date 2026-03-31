import type { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Building2,
  CircleAlert,
  LoaderCircle,
  Lock,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/features/feedback/store/toast-store";
import { getApiErrorMessage } from "@/lib/axios";
import { demoCredentials } from "@/mocks/user";
import { paths } from "@/routes/paths";

const loginSchema = z.object({
  email: z.email("Digite um e-mail válido."),
  password: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LocationState = {
  from?: string;
};

export function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: demoCredentials.email,
      password: demoCredentials.password,
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values);
      showSuccessToast(
        "Login realizado",
        "Sessão mock iniciada com sucesso. Redirecionando para o dashboard.",
      );

      const state = location.state as LocationState | null;
      const nextPath =
        state?.from && state.from !== paths.login
          ? state.from
          : paths.dashboard;

      void navigate(nextPath, {
        replace: true,
      });
    } catch (error) {
      const message = getApiErrorMessage(error, "Não foi possível autenticar.");

      setError("root", {
        message,
      });
      showErrorToast("Falha na autenticação", message);
    }
  }

  function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    void handleSubmit(onSubmit)(event);
  }

  function handleSsoClick() {
    showInfoToast(
      "SSO corporativo indisponível",
      "No ambiente mock, utilize o acesso preenchido automaticamente.",
    );
  }

  return (
    <form className="space-y-6" noValidate onSubmit={handleLoginSubmit}>
      <div className="rounded-[1.4rem] border border-teal-100 bg-teal-50/80 px-4 py-3 text-sm text-teal-900 dark:border-teal-400/15 dark:bg-teal-400/10 dark:text-teal-100">
        <div className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="leading-6">
              Certifique-se de que está acessando o ambiente oficial de
              avaliação. O login mock já vem preenchido com{" "}
              <span className="font-semibold">{demoCredentials.email}</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
          htmlFor="email"
        >
          E-mail corporativo
        </Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <Input
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-12 rounded-xl border-slate-200 bg-white pl-11 shadow-none dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
            id="email"
            placeholder="nome@onda.finance"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-sm text-destructive" id="email-error" role="alert">
            {errors.email.message}
          </p>
        ) : (
          <p
            className="text-sm text-slate-500 dark:text-slate-400"
            id="email-hint"
          >
            Use o acesso mock preenchido automaticamente para validar o fluxo.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label
            className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400"
            htmlFor="password"
          >
            Senha
          </Label>
          <button
            className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-teal-700 transition-colors hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-200"
            onClick={() =>
              showInfoToast(
                "Recuperação de senha indisponível",
                "Esse fluxo não foi implementado no ambiente mock.",
              )
            }
            type="button"
          >
            Esqueci a senha
          </button>
        </div>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />
          <Input
            aria-describedby={
              errors.password ? "password-error" : "password-hint"
            }
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            className="h-12 rounded-xl border-slate-200 bg-white pl-11 shadow-none dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
            id="password"
            type="password"
            {...register("password")}
          />
        </div>
        {errors.password ? (
          <p
            className="text-sm text-destructive"
            id="password-error"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : (
          <p
            className="text-sm text-slate-500 dark:text-slate-400"
            id="password-hint"
          >
            Credenciais mock seguras para demonstração, sem qualquer integração
            externa.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <input
          className="size-4 rounded border-slate-300 text-teal-600 focus:ring-2 focus:ring-teal-200 dark:border-white/15 dark:bg-slate-950/70 dark:text-teal-300 dark:focus:ring-teal-300/30"
          id="remember-session"
          type="checkbox"
        />
        <Label
          className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-300"
          htmlFor="remember-session"
        >
          Manter conectado por 30 dias
        </Label>
      </div>

      {errors.root?.message ? (
        <div
          className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errors.root.message}
        </div>
      ) : null}

      <Button
        className="h-12 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Validando acesso...
          </>
        ) : (
          <>
            Acessar dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
          ou acesse com
        </span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <Button
        className="h-12 w-full rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100 dark:hover:bg-white/6"
        onClick={handleSsoClick}
        type="button"
        variant="outline"
      >
        <Building2 className="size-4" aria-hidden="true" />
        SSO corporativo
      </Button>

      <p className="text-center text-sm leading-6 text-slate-500 dark:text-slate-400">
        Não possui acesso?{" "}
        <button
          className="font-medium text-teal-700 transition-colors hover:text-teal-600 dark:text-teal-300 dark:hover:text-teal-200"
          onClick={() =>
            showInfoToast(
              "Contato institucional",
              "No ambiente real, esse atalho direcionaria para o time da sua instituição.",
            )
          }
          type="button"
        >
          Solicite aqui à sua instituição.
        </button>
      </p>
    </form>
  );
}
