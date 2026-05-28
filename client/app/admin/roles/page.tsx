"use client";

import { useAllUsers, useUpdateUserRole } from "@/hooks/queries/useRoles";
import { useAuthStore } from "@/app/store/use-auth-store";
import { Shield } from "lucide-react";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  operator: "Operador",
  contractor: "Contratista",
};

const roleColors: Record<string, string> = {
  admin: "text-purple-600 bg-purple-100",
  operator: "text-blue-600 bg-blue-100",
  contractor: "text-green-600 bg-green-100",
};

export default function RolesPage() {
  const { data: users, isLoading, error } = useAllUsers();
  const updateRole = useUpdateUserRole();
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.role === "admin";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        Error al cargar usuarios. Intenta de nuevo.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="neo-raised rounded-xl p-3">
          <Shield className="text-indigo-500" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Roles</h1>
          <p className="text-sm text-slate-500">
            Administra los permisos de los usuarios en la plataforma
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="neo-inset rounded-xl bg-amber-50 p-4 text-amber-700 text-sm">
          Solo los administradores pueden modificar roles. Tienes acceso de solo lectura.
        </div>
      )}

      <div className="neo-raised overflow-hidden rounded-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/50">
              <th className="px-5 py-3 font-semibold text-slate-600">Nombre</th>
              <th className="px-5 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-5 py-3 font-semibold text-slate-600">Rol</th>
              <th className="px-5 py-3 font-semibold text-slate-600">Creado</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr
                key={user.id}
                className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
                      {(user.firstname?.[0] ?? user.email[0]).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {user.firstname && user.lastname
                          ? `${user.firstname} ${user.lastname}`
                          : "—"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600">{user.email}</td>
                <td className="px-5 py-4">
                  {isAdmin ? (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        updateRole.mutate({ id: user.id, role: e.target.value })
                      }
                      disabled={updateRole.isPending}
                      className={`neo-inset rounded-lg px-3 py-1.5 text-sm font-medium outline-none transition-all disabled:opacity-50 ${roleColors[user.role] || "text-slate-600 bg-slate-100"}`}
                    >
                      <option value="admin">Admin</option>
                      <option value="operator">Operador</option>
                      <option value="contractor">Contratista</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-block rounded-lg px-3 py-1.5 text-sm font-medium ${roleColors[user.role] || "bg-slate-100 text-slate-600"}`}
                    >
                      {roleLabels[user.role] || user.role}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-500">
                  {new Date(user.created_at).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(!users || users.length === 0) && (
        <div className="py-12 text-center text-slate-400">
          No hay usuarios registrados.
        </div>
      )}
    </div>
  );
}
