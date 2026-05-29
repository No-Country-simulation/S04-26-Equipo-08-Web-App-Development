"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS } from "@/app/store/use-onboarding-store";
import { useContractSign, useContractComplete } from "@/hooks/queries/useContractSign";
import { useAppToast } from "@/app/providers/ToastProvider";
import { Loader2, FileText, ArrowLeft, ExternalLink } from "lucide-react";

export default function ContractSignStep() {
  const router = useRouter();
  const { currentStep, nextStep } = useOnboardingStore();
  const contractSign = useContractSign();
  const contractComplete = useContractComplete();
  const { showToast } = useAppToast();
  const [embedSrc, setEmbedSrc] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const progressPercent = Math.round((currentStep / (STEPS.length - 1)) * 100);

  useEffect(() => {
    const existing = document.querySelector('script[src*="docuseal"]');
    if (existing) {
      setScriptLoaded(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.docuseal.com/js/form.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleInitSign = useCallback(async () => {
    try {
      const result = await contractSign.mutateAsync();
      setEmbedSrc(result.embedSrc);
    } catch {
      showToast("Error al iniciar la firma del contrato", undefined, "error");
    }
  }, [contractSign]);

  const handleCompleted = useCallback(async () => {
    try {
      await contractComplete.mutateAsync();
    } catch {
      // continue even if backend call fails — store state is enough
    }
    useOnboardingStore.getState().signContract("docuseal");
    nextStep();
    router.push("/contractors/step4");
  }, [nextStep, router, contractComplete]);

  useEffect(() => {
    if (!embedSrc) return;
    const el = document.querySelector("docuseal-form");
    if (!el) return;
    el.addEventListener("completed", handleCompleted);
    return () => el.removeEventListener("completed", handleCompleted);
  }, [embedSrc, handleCompleted]);

  return (
    <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-3xl w-full flex flex-col gap-8">
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-on-surface-variant">
              Paso 3 de 5
            </span>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Firma de Contrato
            </span>
          </div>
          <div className="h-4 w-full bg-background rounded-full neo-inset flex items-center px-1">
            <div
              className="h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-background rounded-xl p-8 sm:p-12 neo-raised flex flex-col gap-8">
          {!embedSrc && (
            <>
              <header className="space-y-2">
                <h1 className="text-3xl font-semibold text-on-surface tracking-tight">
                  Firma del Contrato
                </h1>
                <p className="text-on-surface-variant text-base">
                  Revisa y firma tu contrato digitalmente a través de DocuSeal. Es seguro y legalmente vinculante.
                </p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg neo-inset flex items-start gap-3">
                  <FileText size={20} className="text-primary mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase">
                      Plataforma
                    </span>
                    <span className="text-sm font-medium text-on-surface">
                      DocuSeal
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-lg neo-inset flex items-start gap-3">
                  <ExternalLink size={20} className="text-primary mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-on-surface-variant uppercase">
                      Fecha de Efectividad
                    </span>
                    <span className="text-sm font-medium text-on-surface">
                      Inmediatamente al firmar
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center py-8">
                <button
                  type="button"
                  onClick={handleInitSign}
                  disabled={contractSign.isPending || !scriptLoaded}
                  className="px-8 py-4 rounded-xl bg-primary text-white font-semibold text-lg hover:opacity-90 transition-all neo-raised flex items-center gap-3 disabled:opacity-50"
                >
                  {contractSign.isPending ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Preparando contrato...
                    </>
                  ) : (
                    <>
                      <FileText size={20} />
                      Iniciar Firma Digital
                    </>
                  )}
                </button>
              </div>

              {!scriptLoaded && (
                <p className="text-xs text-on-surface-variant text-center">
                  Cargando plataforma de firma segura...
                </p>
              )}

              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => router.push("/contractors/step2")}
                  className="px-6 py-3 rounded-lg text-on-surface-variant font-medium hover:text-primary transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} />
                  Atrás
                </button>
              </div>
            </>
          )}

          {embedSrc && scriptLoaded && (
            <div className="w-full min-h-[600px] rounded-xl overflow-hidden">
              {/* @ts-expect-error - docuseal-form is a web component loaded from CDN */}
              <docuseal-form
                data-src={embedSrc}
                data-language="es"
                className="w-full h-full"
              />
            </div>
          )}

          {embedSrc && !scriptLoaded && (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          )}
        </div>

        <div className="p-6 rounded-xl border border-dashed border-outline-variant/50 text-center">
          <p className="text-xs text-on-surface-variant leading-relaxed flex items-center justify-center gap-2">
            <span>🦭</span>
            Plataforma de firma electrónica segura proveída por DocuSeal.
            Al firmar, aceptas los Términos de Servicio y la Política de Privacidad.
          </p>
        </div>
      </div>
    </main>
  );
}
