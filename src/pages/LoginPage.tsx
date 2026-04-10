import { useMutation } from '@tanstack/react-query';
import { useId } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { loginRequest, type LoginCredentials } from '../api/auth';
import { HandArrowIcon } from '../components/icons/HandArrowIcon';

const EMAIL_ID = 'login-email';
const PASSWORD_ID = 'login-password';

export function LoginPage() {
  const navigate = useNavigate();
  const formErrorId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: () => {
      navigate('/dashboard', { replace: true });
    },
  });

  const onSubmit = handleSubmit(data => {
    loginMutation.mutate(data);
  });

  const serverError =
    loginMutation.isError && loginMutation.error instanceof Error
      ? loginMutation.error.message
      : loginMutation.isError
        ? 'Sign-in failed. Please try again.'
        : null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-raito-bg px-4 py-12">
      <div className="w-full max-w-[400px]">
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="mb-8 flex items-center gap-3" aria-hidden="true">
            <HandArrowIcon size={44} className="shrink-0" />
            <span className="text-2xl font-bold tracking-tight text-white">RAITO</span>
            <span className="text-2xl font-semibold tracking-tight text-raito-brand">Admin</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">Sign in</h1>
          <p className="mt-2 text-base text-slate-400">Access the administration panel</p>
        </header>

        <form
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          noValidate
          aria-describedby={serverError ? formErrorId : undefined}
        >
          {serverError ? (
            <p
              id={formErrorId}
              role="alert"
              className="rounded-md border border-red-500/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
            >
              {serverError}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <label
              htmlFor={EMAIL_ID}
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Email
            </label>
            <input
              id={EMAIL_ID}
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="admin@raito.app"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? `${EMAIL_ID}-error` : undefined}
              className="min-h-[44px] rounded-md border border-slate-800 bg-raito-surface px-3 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus-visible:border-raito-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raito-brand focus-visible:ring-offset-2 focus-visible:ring-offset-raito-bg"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address.',
                },
              })}
            />
            {errors.email ? (
              <p id={`${EMAIL_ID}-error`} role="alert" className="text-sm text-red-300">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={PASSWORD_ID}
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Password
            </label>
            <input
              id={PASSWORD_ID}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? `${PASSWORD_ID}-error` : undefined}
              className="min-h-[44px] rounded-md border border-slate-800 bg-raito-surface px-3 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus-visible:border-raito-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-raito-brand focus-visible:ring-offset-2 focus-visible:ring-offset-raito-bg"
              {...register('password', {
                required: 'Password is required.',
                minLength: { value: 1, message: 'Password is required.' },
              })}
            />
            {errors.password ? (
              <p id={`${PASSWORD_ID}-error`} role="alert" className="text-sm text-red-300">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            aria-busy={loginMutation.isPending}
            className="min-h-[48px] w-full rounded-md bg-raito-brand px-4 py-3 text-center text-base font-semibold text-slate-950 transition-colors hover:bg-raito-brand-hover active:bg-raito-brand-active disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
