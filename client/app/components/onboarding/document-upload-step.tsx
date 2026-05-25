"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS, STEP_LABELS, type StepName } from "@/app/store/use-onboarding-store";

type UploadZone = "id" | "tax";

export default function DocumentUploadStep() {
  const router = useRouter();
  const { currentStep, completedSteps, nextStep } = useOnboardingStore();
  const [files, setFiles] = useState<Record<UploadZone, File | null>>({ id: null, tax: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const taxRef = useRef<HTMLInputElement>(null);

  const currentStepName = STEPS[currentStep];

  const handleFileSelect = (zone: UploadZone, file: File | null) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [zone]: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    useOnboardingStore.getState().updateDocuments({
      files: files as unknown as Record<string, File | null>,
    });

    nextStep();
    router.push("/contractors/step3");
  };

  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-4 flex flex-col gap-6">
          <div className="neo-raised bg-background p-8 rounded-xl flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
                <circle
                  cx="48" cy="48" r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-primary"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * progressPercent) / 100}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-primary">
                {currentStep + 1}/{STEPS.length}
              </div>
            </div>
            <h2 className="text-lg font-semibold text-on-surface">
              Paso {currentStep + 1}: {STEP_LABELS[currentStepName]}
            </h2>
            <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Verifica tu identidad para desbloquear todas las funciones.
            </p>
          </div>

          <div className="neo-raised bg-background p-6 rounded-xl">
            <h3 className="text-sm font-semibold text-primary mb-4">Lista de Pasos</h3>
            <ul className="space-y-3">
              {STEPS.map((step, index) => {
                const isCompleted = completedSteps.includes(step);
                const isCurrent = index === currentStep;
                let icon = "radio_button_unchecked";
                let iconColor = "text-outline";
                if (isCompleted) {
                  icon = "check_circle";
                  iconColor = "text-primary";
                } else if (isCurrent) {
                  icon = "radio_button_checked";
                  iconColor = "text-primary";
                }
                return (
                  <li
                    key={step}
                    className={`flex items-center gap-3 text-sm ${
                      isCurrent ? "text-on-surface font-medium" : "text-on-surface-variant"
                    }`}
                  >
                    <span className={`${iconColor} text-lg`}>{icon === "check_circle" ? "✓" : icon === "radio_button_checked" ? "●" : "○"}</span>
                    {STEP_LABELS[step]}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-8 flex flex-col gap-8">
          <div className="neo-raised bg-background p-8 rounded-xl">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-on-surface mb-2">
                Sube tu identificación y documentación fiscal.
              </h1>
              <p className="text-on-surface-variant">
                Asegúrate de que los documentos sean de alta resolución y legibles para la verificación automática.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-on-surface-variant">
                  Identificación Oficial (INE/Pasaporte)
                </label>
                <div
                  onClick={() => idRef.current?.click()}
                  className="neo-inset bg-background rounded-xl p-10 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 transition-all hover:bg-surface-container-lowest cursor-pointer"
                >
                  <input
                    ref={idRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect("id", e.target.files?.[0] || null)}
                  />
                  <div className="neo-raised w-16 h-16 rounded-full flex items-center justify-center text-primary bg-background">
                    <span className="text-3xl font-bold text-primary">🪪</span>
                  </div>
                  <div className="text-center">
                    {files.id ? (
                      <p className="text-on-surface font-medium">{files.id.name}</p>
                    ) : (
                      <>
                        <p className="text-on-surface font-medium">Arrastra tu identificación aquí</p>
                        <p className="text-xs text-on-surface-variant mt-1">Soporta JPG, PNG o PDF (Máx 10MB)</p>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="neo-raised bg-background text-primary px-6 py-2 rounded-lg font-semibold text-sm mt-2 transition-all active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                    onClick={(e) => { e.stopPropagation(); idRef.current?.click(); }}
                  >
                    Seleccionar Archivo
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-on-surface-variant">
                Documentación Fiscal (W-9 / W-8BEN)
              </label>
                <div
                  onClick={() => taxRef.current?.click()}
                  className="neo-inset bg-background rounded-xl p-10 border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-4 transition-all hover:bg-surface-container-lowest cursor-pointer"
                >
                  <input
                    ref={taxRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect("tax", e.target.files?.[0] || null)}
                  />
                  <div className="neo-raised w-16 h-16 rounded-full flex items-center justify-center text-tertiary bg-background">
                    <span className="text-3xl font-bold text-tertiary">📄</span>
                  </div>
                  <div className="text-center">
                    {files.tax ? (
                      <p className="text-on-surface font-medium">{files.tax.name}</p>
                    ) : (
                      <>
                        <p className="text-on-surface font-medium">Arrastra tus formularios fiscales</p>
                        <p className="text-xs text-on-surface-variant mt-1">Soporta solo PDF (Máx 10MB)</p>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    className="neo-raised bg-background text-tertiary px-6 py-2 rounded-lg font-semibold text-sm mt-2 transition-all active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
                    onClick={(e) => { e.stopPropagation(); taxRef.current?.click(); }}
                  >
                    Seleccionar Archivo
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/contractors/step1")}
                  className="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">←</span>
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !files.id || !files.tax}
                  className="neo-raised group flex items-center justify-center w-14 h-14 rounded-xl bg-background hover:scale-105 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <span className="text-primary text-3xl transition-transform group-hover:translate-x-1 font-bold">→</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="neo-raised bg-background p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg neo-inset flex items-center justify-center text-primary">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Cifrado Seguro</p>
                <p className="text-[10px] text-on-surface-variant">Protección AES de 256 bits</p>
              </div>
            </div>
            <div className="neo-raised bg-background p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg neo-inset flex items-center justify-center text-tertiary">
                <span className="text-lg">✅</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Auto-Verificación</p>
                <p className="text-[10px] text-on-surface-variant">Procesamiento instantáneo activo</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
