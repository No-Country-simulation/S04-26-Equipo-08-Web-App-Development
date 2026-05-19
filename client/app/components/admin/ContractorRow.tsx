import { Eye } from "lucide-react";
import Image from "next/image";
import { Contractor } from "@/types/admin";

interface Props {
  contractor: Contractor;
}

export default function ContractorRow({
  contractor,
}: Props) {
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
            <p className="font-semibold">
              {contractor.name}
            </p>

            <p className="text-sm text-slate-500">
              {contractor.email}
            </p>
          </div>
        </div>
      </td>

      <td>{contractor.specialty}</td>

      <td>{contractor.date}</td>

      <td>{contractor.status}</td>

      <td className="text-right">
        <button type="button" className="rounded-xl p-2 shadow-md">
          <Eye
            className="text-indigo-500"
            size={18}
          />
        </button>
      </td>
    </tr>
  );
}