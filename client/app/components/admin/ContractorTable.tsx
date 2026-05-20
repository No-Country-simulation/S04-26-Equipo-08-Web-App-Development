import { contractors } from "@/data/admin-data";

import ContractorRow from "./ContractorRow";

export default function ContactorTable() {
  return (
    <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
      <h3 className="mb-6 text-2xl font-bold">
        Contratistas
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="pb-4">
                Contratista
              </th>

              <th className="pb-4">
                Especialidad
              </th>

              <th className="pb-4">
                Fecha de Registro
              </th>

              <th className="pb-4">
                Estado
              </th>

              <th className="pb-4 text-right">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {contractors.map((contractor) => (
              <ContractorRow
                key={contractor.email}
                contractor={contractor}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}