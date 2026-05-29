"use client";

import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Contractor } from "@/types/admin";

interface Props {
  contractor: Contractor;
  onDelete?: (id: string) => void;
}

export default function ContractorRow({ contractor, onDelete }: Props) {
  return (
    <tr className="border-b border-slate-200">
      <td className="py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-lg font-bold text-primary">
            {contractor.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{contractor.name}</p>
            <p className="text-sm text-slate-500">{contractor.email}</p>
          </div>
        </div>
      </td>
      <td>
        {new Date(contractor.created_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/contractors/${contractor.id}`}
            className="rounded-xl p-2 shadow-md inline-block hover:shadow-lg transition-shadow"
          >
            <Eye className="text-indigo-500" size={18} />
          </Link>
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(contractor.id)}
              className="rounded-xl p-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <Trash2 className="text-red-500" size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
