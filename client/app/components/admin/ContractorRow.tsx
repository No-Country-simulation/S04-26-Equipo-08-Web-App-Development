"use client";

import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Contractor } from "@/types/admin";
import { statusColors } from "@/data/admin-data";

interface Props {
  contractor: Contractor;
  onDelete?: (id: string) => void;
}

export default function ContractorRow({ contractor, onDelete }: Props) {
  return (
    <tr className="border-b border-slate-200">
      <td className="py-5">
        <div className="flex items-center gap-4">
          <Image
            width={200}
            height={200}
            src={contractor.image}
            alt={contractor.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{contractor.name}</p>
            <p className="text-sm text-slate-500">{contractor.email}</p>
          </div>
        </div>
      </td>
      <td>{contractor.specialty}</td>
      <td>{contractor.date}</td>
      <td>
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[contractor.status] || "text-slate-600 bg-slate-100"
          }`}
        >
          {contractor.status === "Verified"
            ? "Verificado"
            : contractor.status === "Pending Review"
            ? "Pendiente"
            : "En Revisión"}
        </span>
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
