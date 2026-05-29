"use client";

import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS } from "@/app/store/use-onboarding-store";

export default function VerificationPendingStep() {
  const router = useRouter();
  const { currentStep, nextStep } = useOnboardingStore();

  const handleBack = () => {
    router.push("/contractors/step3");
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Step Indicator */}
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-primary text-xs font-semibold">
                  {num}
                </div>
                {num < 3 && (
                  <div className="w-12 h-1 bg-surface-container-highest rounded-full neo-inset" />
                )}
              </div>
            ))}
            <div className="w-12 h-1 bg-surface-container-highest rounded-full neo-inset">
              <div className="h-full w-full bg-primary rounded-full transition-all duration-500" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-background neo-raised text-primary text-sm font-bold scale-110">
              4
            </div>
            <div className="w-12 h-1 bg-surface-container-highest rounded-full neo-inset" />
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant text-xs font-medium">
              5
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-background rounded-xl p-12 flex flex-col items-center text-center neo-raised space-y-8">
          <header>
            <h1 className="text-3xl font-semibold text-primary tracking-tight leading-tight">
              ¡Genial! Espera mientras se completa la revisión...
            </h1>
            <p className="text-on-surface-variant mt-3 max-w-md mx-auto">
              Nuestro equipo de cumplimiento está verificando tu documentación. Este proceso suele tomar al menos 72 horas.
            </p>
          </header>

          {/* Loading Icon Container */}
          <div className="relative py-8">
            <div className="w-48 h-48 rounded-full bg-background neo-raised flex items-center justify-center animate-pulse shadow-[6px_6px_12px_rgba(0,0,0,0.08),-6px_-6px_12px_rgba(255,255,255,0.6)]">
              <svg className="w-32 h-32 text-primary/60 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
              </svg>
            </div>

            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-background neo-raised flex items-center justify-center">
              <span className="text-primary text-xl">🛡️</span>
            </div>
            <div className="absolute bottom-4 -left-8 w-14 h-14 rounded-full bg-background neo-raised flex items-center justify-center">
              <span className="text-secondary text-2xl">✅</span>
            </div>
          </div>

          {/* Progress Details */}
          <div className="w-full max-w-sm space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg neo-inset flex flex-col items-center">
                <span className="text-xs text-on-surface-variant">Paso 4 de 5</span>
                <span className="font-semibold text-on-surface">Verificación Final</span>
              </div>
              <div className="p-4 bg-background rounded-lg neo-inset flex flex-col items-center">
                <span className="text-xs text-on-surface-variant">Tiempo Est.</span>
                <span className="font-semibold text-on-surface">~72 Horas</span>
              </div>
            </div>
          </div>

          {/* Back Button + Info */}
          <div className="w-full flex flex-col items-start gap-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-background neo-raised text-on-surface-variant hover:text-primary transition-all duration-300"
            >
              <span>←</span>
              <span className="text-sm font-semibold tracking-wide">Atrás</span>
            </button>

            <div className="flex items-center gap-3 text-sm text-on-surface-variant opacity-80 italic">
              <span>ℹ️</span>
              Recibirás una notificación y un correo electrónico cuando el portal esté completamente activo.
            </div>
          </div>
        </div>

        {/* Supportive Footer Visual */}
        <div className="flex gap-8 items-center justify-center opacity-60">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span className="text-xs font-medium text-on-surface-variant">Enlace SSL Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span className="text-xs font-medium text-on-surface-variant">Datos Cifrados</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🎧</span>
            <span className="text-xs font-medium text-on-surface-variant">Soporte 24/7</span>
          </div>
        </div>
      </div>
    </main>
  );
}
