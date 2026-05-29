"use client";

import { useState, useEffect } from "react";

import {
  Archive,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MailCheckIcon,
  Settings,
  Shield,
  Users,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/use-auth-store";

export default function AdminSidebar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === "admin";
  
    const handleLogout = () => {
      logout()
  
      router.push('/auth/login')
    }
    //
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar");
    if (stored === "true") {
      setCollapsed(true);
    }
  }, []);

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
            icon={MailCheckIcon}
            label={collapsed ? "" : "Agregar"}
            href="/admin/add-contractor"
          />

          {isAdmin && (
            <SidebarItem
              icon={Shield}
              label={collapsed ? "" : "Roles"}
              href="/admin/roles"
            />
          )}

          <SidebarItem
            icon={FileText}
            label={
              collapsed
                ? ""
                : "Aprobaciones"
            }
            href="/admin/approval"
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
            icon={BarChart3}
            label={collapsed ? "" : "Reportes"}
            href="/admin/reportes"
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
          icon={Settings}
          label={collapsed ? "" : "Configuración"}
          href="/admin/configuracion"
        />

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