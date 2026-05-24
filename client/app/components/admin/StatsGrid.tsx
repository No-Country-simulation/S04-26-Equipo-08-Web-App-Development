import {
  FileText,
  Hourglass,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total de Solicitantes"
        value="148"
        icon={UserPlus}
      />

      <StatCard
        title="Revisión Pendiente"
        value="32"
        icon={Hourglass}
      />

      <StatCard
        title="Verificados Hoy"
        value="85"
        icon={ShieldCheck}
      />

      <StatCard
        title="En Revisión"
        value="14"
        icon={FileText}
      />
    </div>
  );
}