"use client";

import { useHealth } from "@/hooks/queries/useServer";

export default function ServerOnline() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useHealth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
        <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

        <span>
          Verificando estado del servidor...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-red-500" />

          <div>
            <h2 className="font-semibold text-red-400">
              Servidor no disponible
            </h2>

            <p className="mt-1 text-sm text-red-300/80">
              Actualmente estamos teniendo
              problemas para conectar con el
              servidor. Intenta nuevamente en
              unos minutos.
            </p>

            {error instanceof Error && (
              <p className="mt-2 text-xs text-red-400/70">
                {error.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
      <div className="flex items-center gap-3">
        <div className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

        <div>
          <h2 className="font-semibold ">
            Servidor operativo
          </h2>

          <p className="mt-1 text-sm">
            Todos los servicios están funcionando
            correctamente.
          </p>
        </div>
      </div>
    </div>
  );
}