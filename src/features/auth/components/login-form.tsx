import type { FormEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store/auth-store";
import {
  showErrorToast,
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

  return (
    <form className="space-y-5" noValidate onSubmit={handleLoginSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            aria-describedby={errors.email ? "email-error" : "email-hint"}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="h-11 rounded-xl border-slate-200 bg-white pl-10 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
            id="email"
            placeholder="voce@empresa.com"
            type="email"
            {...register("email")}
          />
        </div>
        {errors.email ? (
          <p className="text-sm text-destructive" id="email-error" role="alert">
            {errors.email.message}
          </p>
        ) : (
          <p className="text-sm text-slate-500" id="email-hint">
            Use o acesso mock preenchido automaticamente para validar o fluxo.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Lock
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <Input
            aria-describedby={
              errors.password ? "password-error" : "password-hint"
            }
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            className="h-11 rounded-xl border-slate-200 bg-white pl-10 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50"
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
          <p className="text-sm text-slate-500" id="password-hint">
            Credenciais mock seguras para demonstração, sem qualquer integração
            externa.
          </p>
        )}
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
        className="h-11 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Validando acesso...
          </>
        ) : (
          "Acessar dashboard"
        )}
      </Button>
    </form>
  );
}
