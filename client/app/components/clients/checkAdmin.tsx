"use client";

import { useAdminCheck } from "@/hooks/queries/useAdminCheck";

export default function CheckAdminComponent() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAdminCheck();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-300">
        <div className="h-2 w-2 animate-pulse rounded-full bg-yellow-400" />

        <span>
          Verificando permisos administrativos...
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-red-500" />

          <div>
            <h2 className="font-semibold text-red-400">
              Error de verificación
            </h2>

            <p className="mt-1 text-sm text-red-300/80">
              No fue posible validar el estado
              administrativo del usuario.
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
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        data
          ? "border-blue-500/20 bg-blue-500/10"
          : "border-zinc-500/20 bg-zinc-500/10"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 h-3 w-3 rounded-full ${
            data
              ? "animate-pulse bg-blue-400"
              : "bg-zinc-400"
          }`}
        />

        <div>
          <h2 className="font-semibold">
            {data
              ? " Usuario administrador"
              : " Actalmente No existe una sesión administrativa activa"}
          </h2>
        </div>
      </div>
    </div>
  );
}