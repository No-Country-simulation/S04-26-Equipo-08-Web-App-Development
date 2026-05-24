'use client'
import { LoginFormData, loginSchema } from "@/schema/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/queries/useLogin";
import { useAppToast } from "@/app/providers/ToastProvider";
import { useRouter } from "next/navigation";


import { useAuthStore } from "@/app/store/use-auth-store";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLogin();
  const { showToast } = useAppToast();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(
  data: LoginFormData
) {
  
  try {

  const response =
    await loginMutation
      .mutateAsync(data);

  login(response.accessToken, {
    id: response.user.id,
    name: `${response.user.firstname} ${response.user.lastname}`,
    email: response.user.email,
    role: response.user.role,
  });

  showToast(
    "Login successful",
    undefined,
    "success"
  );

  if (response.user.role === 'admin') {
    router.push('/admin');
  } else {
    router.push('/');
  }

} catch (error) {

  showToast(
    typeof error === "string"
      ? error
      : "Unexpected error",
    undefined,
    "error"
  );
}
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container p-8 shadow-sm">
        
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-on-primary">
              N
            </div>

            <div>
              <h1 className="font-headline text-2xl font-bold text-on-background">
                NorthPay
              </h1>

              <p className="text-sm text-on-surface-variant">
                Accede a tu cuenta
              </p>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant">
            Ingresa tus credenciales para
            continuar utilizando la plataforma.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@northpay.com"
              {...register("email")}
              className={`
                w-full rounded-lg border
                bg-surface px-4 py-3
                text-on-surface outline-none
                transition-all
                placeholder:text-on-surface-variant/60
                focus:ring-4

                ${
                  errors.email
                    ? `
                      border-error
                      focus:border-error
                      focus:ring-error/20
                    `
                    : `
                      border-outline
                      focus:border-primary
                      focus:ring-primary/20
                    `
                }
              `}
            />

            {errors.email && (
              <p className="text-sm text-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-on-surface">
                Contraseña
              </label>

              <button
                type="button"
                className="text-sm text-primary transition-opacity hover:opacity-80"
              >
                Olvidé mi contraseña
              </button>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`
                w-full rounded-lg border
                bg-surface px-4 py-3
                text-on-surface outline-none
                transition-all
                placeholder:text-on-surface-variant/60
                focus:ring-4

                ${
                  errors.password
                    ? `
                      border-error
                      focus:border-error
                      focus:ring-error/20
                    `
                    : `
                      border-outline
                      focus:border-primary
                      focus:ring-primary/20
                    `
                }
              `}
            />

            {errors.password && (
              <p className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex w-full items-center justify-center
              rounded-lg bg-primary px-4 py-3
              font-medium text-on-primary
              transition-all duration-200
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-outline-variant pt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            Plataforma segura y protegida.
          </p>
        </div>
      </div>
    </section>
  );
}