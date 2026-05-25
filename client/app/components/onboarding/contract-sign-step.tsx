"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore, STEPS } from "@/app/store/use-onboarding-store";

export default function ContractSignStep() {
  const router = useRouter();
  const { currentStep, nextStep } = useOnboardingStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const progressPercent = Math.round(((currentStep) / (STEPS.length - 1)) * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      ctx.strokeStyle = "#2e3040";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSignature) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");

    useOnboardingStore.getState().signContract(dataUrl);
    nextStep();
    router.push("/contractors/step4");
  };

  return (
    <main className="flex-grow flex items-center justify-center p-6 sm:p-12">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        {/* Progress Indicator */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-on-surface-variant">
              Paso 3 de 5
            </span>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Fase de Verificación
            </span>
          </div>
          <div className="h-4 w-full bg-background rounded-full neo-inset flex items-center px-1">
            <div
              className="h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-background rounded-xl p-8 sm:p-12 neo-raised flex flex-col gap-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold text-on-surface tracking-tight">
              Firma del Contrato
            </h1>
            <p className="text-on-surface-variant text-base">
              Firma a continuación para finalizar tu acuerdo.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg neo-inset flex items-start gap-3">
              <span className="text-primary mt-0.5">📄</span>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface-variant uppercase">
                  ID de Documento
                </span>
                <span className="text-sm font-medium text-on-surface">
                  SP-2024-0812-B
                </span>
              </div>
            </div>
            <div className="p-4 rounded-lg neo-inset flex items-start gap-3">
              <span className="text-primary mt-0.5">📅</span>
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

          {/* Signature Pad */}
          <form onSubmit={handleSubmit}>
            <div className="relative w-full aspect-[21/9] bg-background rounded-xl neo-inset overflow-hidden group">
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10 touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={clearSignature}
                  className="p-2 rounded-lg neo-raised hover:scale-105 active:scale-95 transition-all bg-background text-on-surface-variant cursor-pointer"
                >
                  ↩
                </button>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none">
                <div className="w-48 h-px bg-outline-variant" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">
                  Línea de Firma
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => router.push("/contractors/step2")}
                className="px-6 py-3 rounded-lg text-on-surface-variant font-medium hover:text-primary transition-colors flex items-center gap-2"
              >
                <span>←</span>
                Atrás
              </button>

              <button
                type="submit"
                disabled={!hasSignature}
                className="relative group p-1 rounded-full overflow-hidden bg-primary/10 transition-all duration-300 disabled:opacity-50"
              >
                <div className="bg-background p-4 rounded-full neo-raised group-hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all active:scale-95 flex items-center justify-center">
                  <span className="text-primary text-3xl font-bold">→</span>
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Legal Disclaimer */}
        <div className="p-6 rounded-xl border border-dashed border-outline-variant/50 text-center">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Al proporcionar tu firma digital, reconoces que has leído y entendido los Términos de Servicio y la Política de Privacidad. Esta firma es legalmente vinculante y tiene el mismo valor que una firma manuscrita según la Ley de Firmas Electrónicas (ESIGN).
          </p>
        </div>
      </div>
    </main>
  );
}
