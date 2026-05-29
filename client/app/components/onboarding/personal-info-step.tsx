"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnboardingStore } from "@/app/store/use-onboarding-store";
import { register } from "@/services/register.service";
import { useAuthStore } from "@/app/store/use-auth-store";
import { useAppToast } from "@/app/providers/ToastProvider";

function PersonalInfoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { personalInfo, updatePersonalInfo, nextStep } = useOnboardingStore();
  const authLogin = useAuthStore((s) => s.login);
  const { showToast } = useAppToast();

  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState(personalInfo.birth_date || "");
  const [phone, setPhone] = useState(personalInfo.phone || "");
  const [email, setEmail] = useState(searchParams.get("email") || personalInfo.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (personalInfo.firstname || personalInfo.lastname) {
      setFullName(`${personalInfo.firstname} ${personalInfo.lastname}`.trim());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", undefined, "error");
      setIsSubmitting(false);
      return;
    }

    const parts = fullName.trim().split(/\s+/);
    const firstname = parts[0] || "";
    const lastname = parts.slice(1).join(" ") || "";

    try {
      const user = await register({
        email,
        password,
        role: "contractor",
        firstname,
        lastname,
        phone,
      });

      authLogin("", {
        id: user.id,
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        role: user.role,
      });

      updatePersonalInfo({
        firstname,
        lastname,
        birth_date: birthDate,
        phone,
        email,
      });

      nextStep();
      router.push("/contractors/step2");
    } catch (error) {
      showToast(
        typeof error === "string" ? error : "Error al registrar",
        undefined,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-4 md:p-8">
      <div className="neo-raised max-w-4xl w-full flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-5/12 relative min-h-[240px] md:min-h-full bg-primary overflow-hidden flex flex-col justify-end p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          <img
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000"
            alt=""
          />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Bienvenido a NorthPay
            </h1>
            <p className="text-white/80 font-medium leading-relaxed">
              Comencemos con tus datos. Esta información nos ayuda a adaptar tu experiencia administrativa a tus necesidades profesionales.
            </p>
          </div>
          <div className="relative z-10 mt-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                Paso 1 de 5
              </span>
              <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                20% Completado
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full w-1/5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-12 bg-background">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-on-surface">
              Datos Personales
            </h2>
            <p className="text-on-surface-variant mt-1 text-sm">
              Completa tu información para crear tu cuenta.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-2">
                Nombre Completo
              </label>
              <div className="neo-inset rounded-lg p-1">
                <input
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline/50 outline-none"
                  placeholder="Juan Pérez"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-2">
                  Fecha de Nacimiento
                </label>
                <div className="neo-inset rounded-lg p-1">
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface outline-none"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-2">
                  Teléfono
                </label>
                <div className="neo-inset rounded-lg p-1">
                  <input
                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline/50 outline-none"
                    placeholder="6778902"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-2">
                Correo Electrónico
              </label>
              <div className="neo-inset rounded-lg p-1">
                <input
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline/50 outline-none"
                  placeholder="correo@ejemplo.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-2">
                Contraseña
              </label>
              <div className="neo-inset rounded-lg p-1 flex items-center">
                <input
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline/50 outline-none"
                  placeholder="••••••••"
                  type={showPasswords ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="px-3 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  {showPasswords ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-on-surface-variant ml-2">
                Repetir Contraseña
              </label>
              <div className="neo-inset rounded-lg p-1 flex items-center">
                <input
                  className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-on-surface placeholder:text-outline/50 outline-none"
                  placeholder="••••••••"
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="px-3 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  {showPasswords ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span className="text-lg">←</span>
                Volver al portal
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="neo-raised group flex items-center justify-center w-14 h-14 rounded-xl bg-background hover:scale-105 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <span className="text-primary text-3xl transition-transform group-hover:translate-x-1 font-bold">
                    →
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function PersonalInfoStep() {
  return (
    <Suspense>
      <PersonalInfoForm />
    </Suspense>
  );
}
