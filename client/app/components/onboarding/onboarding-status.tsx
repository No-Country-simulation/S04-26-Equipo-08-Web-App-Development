"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS, STEP_LABELS, type StepName } from "@/app/store/use-onboarding-store";
import { useOnboardingProgress } from "@/hooks/queries/useOnboardingProgress";

const STEP_ROUTES = [
  "/contractors/step1",
  "/contractors/step2",
  "/contractors/step3",
  "/contractors/step4",
  "/contractors/step5",
];

export default function OnboardingStatus() {
  const router = useRouter();
  const { currentStep, completedSteps, setCurrentStep, completeStep } = useOnboardingStore();
  const { data: progress } = useOnboardingProgress();
  const synced = useRef(false);

  const progressPercent = Math.round((completedSteps.length / STEPS.length) * 100);

  useEffect(() => {
    if (!progress?.steps || progress.steps.length === 0) return;
    if (synced.current) return;
    synced.current = true;

    const store = useOnboardingStore.getState();
    const backendCompleted = progress.steps
      .filter((s) => s.completed)
      .map((s) => s.step_name as StepName);
    const backendStepNames = progress.steps.map((s) => s.step_name);

    const firstIncompleteIndex = backendStepNames.findIndex(
      (name) => !backendCompleted.includes(name as StepName),
    );
    const stepIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : backendStepNames.length - 1;

    for (const step of backendCompleted) {
      if (!store.completedSteps.includes(step)) {
        store.completeStep(step);
      }
    }

    if (store.currentStep !== stepIndex) {
      store.setCurrentStep(stepIndex);
    }

    // Auto-redirect to current step if not all completed
    if (backendCompleted.length < STEPS.length) {
      router.replace(STEP_ROUTES[stepIndex]);
    }
  }, [progress]);

  const currentStepName = STEPS[currentStep];
  const isAllCompleted = completedSteps.length >= STEPS.length;

  return (
    <main className="flex-grow flex items-center justify-center p-6">
      <div className="w-full max-w-2xl flex flex-col items-center gap-12">
        {/* Step Indicator */}
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="flex items-center gap-2">
            {STEPS.map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center rounded-full text-xs font-semibold transition-all ${
                    completedSteps.includes(STEPS[index])
                      ? "w-8 h-8 bg-surface-container-highest text-primary"
                      : index === currentStep
                      ? "w-10 h-10 bg-background neo-raised text-primary font-bold scale-110"
                      : "w-8 h-8 bg-surface-container-low text-on-surface-variant font-medium"
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div className="w-12 h-1 bg-surface-container-highest rounded-full neo-inset overflow-hidden">
                    {completedSteps.includes(STEPS[index]) && (
                      <div className="h-full w-full bg-primary rounded-full transition-all duration-500" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-background rounded-xl p-12 flex flex-col items-center text-center neo-raised space-y-8">
          <header>
            <h1 className="text-3xl font-semibold text-primary tracking-tight leading-tight">
              {isAllCompleted
                ? "¡Todos los pasos completados!"
                : "¡Genial! Espera mientras se completa la revisión..."}
            </h1>
            <p className="text-on-surface-variant mt-3 max-w-md mx-auto">
              {isAllCompleted
                ? "Tu documentación está siendo revisada. Recibirás una notificación cuando tu cuenta esté activa."
                : "Nuestro equipo de cumplimiento está verificando tu documentación. Este proceso suele tomar de 2 a 4 horas hábiles."}
            </p>
          </header>

          {/* Loading Icon */}
          <div className="relative py-8">
            <div className="w-48 h-48 rounded-full bg-background neo-raised flex items-center justify-center animate-pulse">
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-on-surface-variant px-1">
                <span>Fase Actual: {STEP_LABELS[currentStepName]}</span>
                <span className="text-primary">{progressPercent}% Completado</span>
              </div>
              <div className="h-4 w-full bg-background rounded-full neo-inset p-1">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg neo-inset flex flex-col items-center">
                <span className="text-xs text-on-surface-variant">
                  Paso {currentStep + 1} de {STEPS.length}
                </span>
                <span className="font-semibold text-on-surface">
                  {STEP_LABELS[currentStepName]}
                </span>
              </div>
              <div className="p-4 bg-background rounded-lg neo-inset flex flex-col items-center">
                <span className="text-xs text-on-surface-variant">Tiempo Est.</span>
                <span className="font-semibold text-on-surface">~15 Minutos</span>
              </div>
            </div>
          </div>

          {/* Continue / Info */}
          <div className="w-full flex flex-col items-start gap-6">
            {!isAllCompleted && (
              <button
                onClick={() => router.push(STEP_ROUTES[currentStep])}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-all neo-raised"
              >
                Continuar con {STEP_LABELS[currentStepName]}
                <span>→</span>
              </button>
            )}

            <div className="flex items-center gap-3 text-sm text-on-surface-variant opacity-80 italic">
              <span>ℹ️</span>
              Recibirás una notificación y un correo electrónico cuando el portal esté completamente activo.
            </div>
          </div>
        </div>

        {/* Supportive Footer */}
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
