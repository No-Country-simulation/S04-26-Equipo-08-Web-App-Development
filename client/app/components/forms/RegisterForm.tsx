"use client";

import { RegisterFormData, registerSchema } from "@/schema/registerSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegister } from "@/hooks/queries/useRegister";
import { useAppToast } from "@/app/providers/ToastProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegister();
  const { showToast } = useAppToast();

  const defaultEmail = searchParams.get("email") || "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: defaultEmail,
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        role: "contractor",
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phone,
      });

      showToast(
        "Registro exitoso",
        "Ahora puedes iniciar sesión",
        "success"
      );

      router.push("/auth/login");
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Error al registrar",
        undefined,
        "error"
      );
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-outline-variant bg-surface-container p-8 shadow-sm">
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
                Crea tu cuenta de contratista
              </p>
            </div>
          </div>

          <p className="text-sm text-on-surface-variant">
            Completa tus datos para registrarte en la plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">
                Nombre
              </label>

              <input
                type="text"
                placeholder="Juan"
                {...register("firstname")}
                className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                  errors.firstname
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-outline focus:border-primary focus:ring-primary/20"
                }`}
              />

              {errors.firstname && (
                <p className="text-sm text-error">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-on-surface">
                Apellido
              </label>

              <input
                type="text"
                placeholder="Pérez"
                {...register("lastname")}
                className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                  errors.lastname
                    ? "border-error focus:border-error focus:ring-error/20"
                    : "border-outline focus:border-primary focus:ring-primary/20"
                }`}
              />

              {errors.lastname && (
                <p className="text-sm text-error">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@northpay.com"
              {...register("email")}
              className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                errors.email
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-outline focus:border-primary focus:ring-primary/20"
              }`}
            />

            {errors.email && (
              <p className="text-sm text-error">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">
              Teléfono
            </label>

            <input
              type="tel"
              placeholder="+1234567890"
              {...register("phone")}
              className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                errors.phone
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-outline focus:border-primary focus:ring-primary/20"
              }`}
            />

            {errors.phone && (
              <p className="text-sm text-error">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                errors.password
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-outline focus:border-primary focus:ring-primary/20"
              }`}
            />

            {errors.password && (
              <p className="text-sm text-error">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-on-surface">
              Confirmar contraseña
            </label>

            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full rounded-lg border bg-surface px-4 py-3 text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:ring-4 ${
                errors.confirmPassword
                  ? "border-error focus:border-error focus:ring-error/20"
                  : "border-outline focus:border-primary focus:ring-primary/20"
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-sm text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 font-medium text-on-primary transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 border-t border-outline-variant pt-6 text-center">
          <p className="text-sm text-on-surface-variant">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-primary hover:underline"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function RegisterForm() {
  return (
    <Suspense>
      <RegisterFormInner />
    </Suspense>
  );
}
