"use client";

import { useState } from "react";
import { contractors as initialContractors } from "@/data/admin-data";
import ContractorRow from "@/app/components/admin/ContractorRow";

export default function ArchivePage() {
  const [contractors, setContractors] = useState(
    initialContractors.filter(
      (c) =>
        c.onboardingStatus === "ACTIVE" ||
        c.onboardingStatus === "REJECTED"
    )
  );

  const handleDelete = (id: string) => {
    setContractors((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--on-surface)] mb-8">
        Archivo
      </h1>
      <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
        {contractors.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No hay contratistas archivados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-300 text-left">
                  <th className="pb-4">Contratista</th>
                  <th className="pb-4">Especialidad</th>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4">Estado</th>
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
        )}
      </div>
    </div>
  );
}
