"use client";

import { useUsers, useDeleteUser } from "@/hooks/queries/useUsers";
import ContractorRow from "@/app/components/admin/ContractorRow";

export default function ArchivePage() {
  const { data: archived, isLoading, error } = useUsers();
  const deleteMutation = useDeleteUser();

  const contractors = archived?.filter((c) => !c.is_active);

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--on-surface)] mb-8">
        Archivo
      </h1>
      {isLoading ? (
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <p className="text-slate-500">Cargando...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <p className="text-red-500">Error al cargar contratistas</p>
        </div>
      ) : !contractors?.length ? (
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <p className="text-center text-slate-500 py-8">
            No hay contratistas archivados.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 text-left">
                  <th className="pb-4">Contratista</th>
                  <th className="pb-4">Fecha de Registro</th>
                  <th className="pb-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contractors.map((contractor) => (
                  <ContractorRow
                    key={contractor.id}
                    contractor={contractor}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
