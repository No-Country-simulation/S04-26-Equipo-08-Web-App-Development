"use client";

import { useInvitation } from "@/hooks/queries/useInvitation";

interface Props {
  token: string;
}

export default function InvitationCard({
  token,
}: Props) {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useInvitation(token);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-400" />

          <div>
            <h2 className="font-semibold text-yellow-300">
              Verificando invitación
            </h2>

            <p className="mt-1 text-sm text-yellow-200/80">
              Estamos validando el enlace de acceso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error/10 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-3 w-3 rounded-full bg-error" />

          <div>
            <h2 className="font-semibold text-error">
              Invitación inválida
            </h2>

            <p className="mt-1 text-sm text-on-error-container">
              El enlace puede haber expirado o no ser válido.
            </p>

            {error instanceof Error && (
              <p className="mt-2 text-xs opacity-70">
                {error.message}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 h-3 w-3 animate-pulse rounded-full bg-primary" />

        <div className="w-full">
          <h1 className="text-xl font-bold text-on-background">
            Invitación válida
          </h1>

          <p className="mt-2 text-sm text-on-surface-variant">
            Has sido invitado a unirte a la plataforma.
          </p>

          <div className="mt-5 space-y-3 rounded-xl bg-surface p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                Correo
              </p>
                      <p className="font-medium text-on-surface">
                {data?.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-on-surface-variant">
                Rol asignado
              </p>

              <p className="font-medium text-on-surface">
                {data?.role}
              </p>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-xl bg-primary px-4 py-3 font-medium text-on-primary transition-all hover:opacity-90"
          >
            Continuar registro
          </button>
        </div>
      </div>
    </div>
  );
}