"use client";

import { useState } from "react";

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/use-auth-store";

export default function AdminSidebar() {
  const router = useRouter()
  //
  const logout = useAuthStore((state) => state.logout)
  
    const handleLogout = () => {
      logout()
  
      router.push('/auth/login')
    }
    //
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      localStorage.getItem("admin-sidebar") ===
      "true"
    );
  });

  const toggleSidebar = () => {
    const newValue = !collapsed;

    setCollapsed(newValue);

    localStorage.setItem(
      "admin-sidebar",
      String(newValue)
    );
  };

  return (
    <aside
      className={`hidden md:flex flex-col justify-between bg-[#e8eaf0] p-6 shadow-xl transition-all duration-300 ${
        collapsed ? "w-24" : "w-72"
      }`}
    >
      <div>
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold">
                Panel Admin
              </h2>

              <p className="text-sm text-slate-500">
                Centro de Operaciones
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              collapsed
                ? "Expandir sidebar"
                : "Colapsar sidebar"
            }
            title={
              collapsed
                ? "Expandir sidebar"
                : "Colapsar sidebar"
            }
            className="rounded-xl p-2 shadow-md"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <SidebarItem
            icon={LayoutDashboard}
            label={collapsed ? "" : "Resumen"}
            href="/admin"
          />

          <SidebarItem
            icon={FileText}
            label={
              collapsed
                ? ""
                : "Aprobaciones"
            }
            href="/admin/approval
"
          />

          <SidebarItem
            icon={Users}
            label={
              collapsed
                ? ""
                : "Contratistas"
            }
            href="/admin/contractors"
          />

          <SidebarItem
            icon={Archive}
            label={collapsed ? "" : "Archivo"}
            href="/admin/archivo"
          />
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-3 border-t border-slate-300 pt-5">
        <SidebarItem
          icon={HelpCircle}
          label={collapsed ? "" : "Ayuda"}
          href="/admin/ayuda"
        />

        <SidebarItem
          icon={LogOut}
          onClick={handleLogout}
          label={
            collapsed
              ? ""
              : "Cerrar Sesión"
          }
          href="/"
        />
      </div>
    </aside>
  );
}