"use client";

import { useUsers, useDeleteUser } from "@/hooks/queries/useUsers";
import ContractorRow from "./ContractorRow";

export default function ActivosTable() {
  const { data: contractors, isLoading, error } = useUsers();
  const deleteMutation = useDeleteUser();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
        <p className="text-slate-500">Cargando contratistas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
        <p className="text-red-500">Error al cargar contratistas</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
      <h3 className="mb-6 text-2xl font-bold">Activos</h3>
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
            {contractors?.map((contractor) => (
              <ContractorRow
                key={contractor.id}
                contractor={contractor}
                onDelete={handleDelete}
              />
            ))}
            {(!contractors || contractors.length === 0) && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500">
                  No hay contratistas activos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
