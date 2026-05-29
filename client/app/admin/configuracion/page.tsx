"use client";

import { useState } from "react";
import { Settings, Bell, Globe, Lock, Shield, User, Save } from "lucide-react";

export default function ConfiguracionPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState("es");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleStyle = (on: boolean) =>
    `relative w-11 h-6 rounded-full transition-colors cursor-pointer ${on ? "bg-indigo-500" : "bg-slate-300"}`;

  const knobStyle = (on: boolean) =>
    `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${on ? "translate-x-5" : "translate-x-0"}`;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#e8eaf0] p-3 shadow-xl">
          <Settings className="text-indigo-500" size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Configuración</h1>
          <p className="text-sm text-slate-500">Preferencias de la plataforma</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Bell size={20} className="text-indigo-500" />
            Notificaciones
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Notificaciones del sistema</p>
              <p className="text-xs text-slate-400">Recibir alertas de actividad</p>
            </div>
            <div className={toggleStyle(notifications)} onClick={() => setNotifications(!notifications)}>
              <div className={knobStyle(notifications)} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Reportes por correo</p>
              <p className="text-xs text-slate-400">Resumen semanal de actividad</p>
            </div>
            <div className={toggleStyle(emailReports)} onClick={() => setEmailReports(!emailReports)}>
              <div className={knobStyle(emailReports)} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Globe size={20} className="text-indigo-500" />
            Preferencias Regionales
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Idioma</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Zona Horaria</label>
            <select
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none"
              defaultValue="America/Mexico_City"
            >
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
              <option value="America/Bogota">Bogotá (GMT-5)</option>
              <option value="America/Santiago">Santiago (GMT-4)</option>
            </select>
          </div>
        </div>

        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <Shield size={20} className="text-indigo-500" />
            Seguridad
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-700">Autenticación de dos factores</p>
              <p className="text-xs text-slate-400">Capa adicional de seguridad</p>
            </div>
            <div className={toggleStyle(twoFactor)} onClick={() => setTwoFactor(!twoFactor)}>
              <div className={knobStyle(twoFactor)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Cambiar contraseña</label>
            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none mb-3"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <User size={20} className="text-indigo-500" />
            Perfil
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Nombre</label>
            <input
              type="text"
              defaultValue="Admin NorthPay"
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Correo electrónico</label>
            <input
              type="email"
              defaultValue="admin@northpay.com"
              className="w-full rounded-xl bg-[#e8eaf0] px-4 py-3 text-slate-700 shadow-inner outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-500 text-white font-semibold shadow-xl hover:bg-indigo-600 transition-all"
        >
          <Save size={18} />
          {saved ? "Guardado" : "Guardar Cambios"}
        </button>
      </div>
    </div>
  );
}
