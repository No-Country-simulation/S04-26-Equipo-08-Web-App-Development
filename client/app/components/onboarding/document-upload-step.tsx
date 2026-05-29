"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS, STEP_LABELS } from "@/app/store/use-onboarding-store";
import { useDocumentUpload } from "@/hooks/queries/useDocumentUpload";
import { DOC_TYPE_LABELS, type DocType } from "@/services/document.service";
import { useAppToast } from "@/app/providers/ToastProvider";
import { CheckCircle, XCircle, Loader2, Upload, Trash2 } from "lucide-react";

interface UploadEntry {
  id: string;
  file: File;
  docType: DocType;
  status: "pending" | "uploading" | "success" | "error";
  errorMessage?: string;
}

const DOC_TYPES = Object.entries(DOC_TYPE_LABELS) as [DocType, string][];

export default function DocumentUploadStep() {
  const router = useRouter();
  const { currentStep, completedSteps, nextStep } = useOnboardingStore();
  const { showToast } = useAppToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [selectedDocType, setSelectedDocType] = useState<DocType>("id_card");
  const uploadMutation = useDocumentUpload();

  const currentStepName = STEPS[currentStep];
  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);
  const hasSuccess = uploads.some((u) => u.status === "success");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const entry: UploadEntry = {
      id: crypto.randomUUID(),
      file,
      docType: selectedDocType,
      status: "pending",
    };

    setUploads((prev) => [...prev, entry]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async (entryId: string) => {
    const entry = uploads.find((u) => u.id === entryId);
    if (!entry || entry.status === "uploading") return;

    setUploads((prev) =>
      prev.map((u) => (u.id === entryId ? { ...u, status: "uploading" as const } : u)),
    );

    try {
      await uploadMutation.mutateAsync({ file: entry.file, docType: entry.docType });
      setUploads((prev) =>
        prev.map((u) => (u.id === entryId ? { ...u, status: "success" as const } : u)),
      );
      showToast(`${DOC_TYPE_LABELS[entry.docType]} subido correctamente`, undefined, "success");
    } catch (err) {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === entryId
            ? { ...u, status: "error" as const, errorMessage: typeof err === "string" ? err : "Error al subir" }
            : u,
        ),
      );
      showToast(`Error al subir ${DOC_TYPE_LABELS[entry.docType]}`, undefined, "error");
    }
  };

  const handleUploadAll = async () => {
    const pending = uploads.filter((u) => u.status === "pending");
    for (const entry of pending) {
      await handleUpload(entry.id);
    }
  };

  const removeEntry = (entryId: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== entryId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    useOnboardingStore.getState().updateDocuments({
      files: uploads.reduce(
        (acc, u) => {
          acc[u.id] = u.file;
          return acc;
        },
        {} as Record<string, File | null>,
      ),
    });

    nextStep();
    router.push("/contractors/step3");
  };

  const statusIcon = (status: UploadEntry["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle size={18} className="text-green-500" />;
      case "error":
        return <XCircle size={18} className="text-red-500" />;
      case "uploading":
        return <Loader2 size={18} className="text-primary animate-spin" />;
      default:
        return <Upload size={18} className="text-on-surface-variant" />;
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8">
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
              Sube tus documentos personales, certificados y títulos profesionales.
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

        <section className="md:col-span-8 flex flex-col gap-8">
          <div className="neo-raised bg-background p-8 rounded-xl">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-on-surface mb-2">
                Sube tus documentos
              </h1>
              <p className="text-on-surface-variant">
                Selecciona el tipo de documento y agrega los archivos. Puedes subir identificación, certificados, títulos y más.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-end gap-4">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant">
                    Tipo de documento
                  </label>
                  <select
                    value={selectedDocType}
                    onChange={(e) => setSelectedDocType(e.target.value as DocType)}
                    className="w-full px-4 py-3 rounded-xl bg-background neo-inset text-on-surface text-sm focus:outline-none"
                  >
                    {DOC_TYPES.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="neo-raised bg-background text-primary px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Upload size={16} />
                    Agregar Archivo
                  </button>
                </div>
              </div>

              {uploads.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                    Archivos pendientes ({uploads.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {uploads.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-background neo-inset"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {statusIcon(entry.status)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-on-surface truncate">
                              {entry.file.name}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {DOC_TYPE_LABELS[entry.docType]} &mdash; {(entry.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {entry.status === "pending" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpload(entry.id)}
                                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:opacity-90 transition-all"
                              >
                                Subir
                              </button>
                              <button
                                type="button"
                                onClick={() => removeEntry(entry.id)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                          {entry.status === "error" && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpload(entry.id)}
                                className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition-all"
                              >
                                Reintentar
                              </button>
                              <button
                                type="button"
                                onClick={() => removeEntry(entry.id)}
                                className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {uploads.some((u) => u.status === "pending") && (
                    <button
                      type="button"
                      onClick={handleUploadAll}
                      className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all mt-2"
                    >
                      Subir Todo ({uploads.filter((u) => u.status === "pending").length} pendientes)
                    </button>
                  )}
                </div>
              )}
            </div>

            {hasSuccess && (
              <form onSubmit={handleSubmit} className="flex items-center justify-between pt-6 mt-6 border-t border-outline-variant/30">
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
                  className="neo-raised group flex items-center justify-center w-14 h-14 rounded-xl bg-background hover:scale-105 active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-200"
                >
                  <span className="text-primary text-3xl transition-transform group-hover:translate-x-1 font-bold">→</span>
                </button>
              </form>
            )}

            {!hasSuccess && uploads.length === 0 && (
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.push("/contractors/step1")}
                  className="text-on-surface-variant text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">←</span>
                  Atrás
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <p className="text-[10px] text-on-surface-variant">Procesamiento instantáneo</p>
              </div>
            </div>
            <div className="neo-raised bg-background p-4 rounded-lg flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg neo-inset flex items-center justify-center text-secondary">
                <span className="text-lg">📋</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Múltiples Tipos</p>
                <p className="text-[10px] text-on-surface-variant">Sube certificados y títulos</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
