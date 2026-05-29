"use client";

import { BarChart3, Users, CheckCircle2, Clock, Archive, TrendingUp, Activity, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/services/api";

interface DashboardStats {
  total: number;
  active: number;
  pending: number;
  archived: number;
  stepsProgress: { stepName: string; total: number; completed: number; percentage: number }[];
  recentActivity: {
    id: string;
    event_type: string;
    description: string;
    created_at: string;
    user_email: string;
    firstname: string;
    lastname: string;
  }[];
}

function useStats() {
  return useQuery<DashboardStats>({
    queryKey: ["adminStats"],
    queryFn: () => apiFetch<DashboardStats>("/stats"),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

const STEP_LABELS: Record<string, string> = {
  personal_info: "Datos Personales",
  document_upload: "Documentos",
  contract_sign: "Firma de Contrato",
  payment_setup: "Método de Pago",
  identity_verification: "Verificación",
};

const STEP_COLORS: Record<string, string> = {
  personal_info: "bg-green-500",
  document_upload: "bg-indigo-500",
  contract_sign: "bg-amber-500",
  payment_setup: "bg-blue-500",
  identity_verification: "bg-purple-500",
};

export default function ReportesPage() {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={24} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  const statsCards = [
    { icon: Users, label: "Total Contratistas", value: stats?.total ?? 0, color: "text-indigo-500" },
    { icon: CheckCircle2, label: "Activos", value: stats?.active ?? 0, color: "text-green-500" },
    { icon: Clock, label: "Pendientes", value: stats?.pending ?? 0, color: "text-amber-500" },
    { icon: Archive, label: "Archivados", value: stats?.archived ?? 0, color: "text-slate-500" },
  ];

  const stepsData = (stats?.stepsProgress ?? []).map((s) => ({
    label: STEP_LABELS[s.stepName] || s.stepName,
    pct: s.percentage,
    color: STEP_COLORS[s.stepName] || "bg-slate-500",
    completed: s.completed,
    total: s.total,
  }));

  const recentActivity = (stats?.recentActivity ?? []).map((a) => ({
    user: `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim() || a.user_email,
    action: a.description || a.event_type,
    time: formatRelativeTime(a.created_at),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#e8eaf0] p-3 shadow-xl">
          <BarChart3 className="text-indigo-500" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Reportes</h1>
          <p className="text-sm text-slate-500">Resumen general de la plataforma</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((s) => (
          <div key={s.label} className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-xl bg-white p-3 shadow-md">
                <s.icon className={s.color} size={22} />
              </div>
              <TrendingUp size={18} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-indigo-500" />
            Progreso por Fase
          </h2>
          <div className="space-y-5">
            {stepsData.length === 0 && (
              <p className="text-sm text-slate-400">No hay datos de progreso aún.</p>
            )}
            {stepsData.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="font-semibold text-slate-700">{s.pct}% ({s.completed}/{s.total})</span>
                </div>
                <div className="h-3 rounded-full bg-slate-300/60 shadow-inner overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${s.color}`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-700 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-indigo-500" />
            Actividad Reciente
          </h2>
          <div className="space-y-4">
            {recentActivity.length === 0 && (
              <p className="text-sm text-slate-400">No hay actividad reciente.</p>
            )}
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3 pb-4 border-b border-slate-300/50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-indigo-500 flex-shrink-0">
                  {a.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">{a.user}</span> {a.action}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? "s" : ""}`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} día${days > 1 ? "s" : ""}`;
}
