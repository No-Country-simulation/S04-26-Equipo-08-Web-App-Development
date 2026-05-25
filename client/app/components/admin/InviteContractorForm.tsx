"use client";

import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { sendInvitation } from "@/services/invitation.service";

export default function InviteContractorForm() {
  const [method, setMethod] = useState<"email" | "whatsapp">("email");
  const [contactInfo, setContactInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await sendInvitation({ contact: contactInfo, method });
      setIsLoading(false);
      setSuccessMessage("¡Invitación enviada exitosamente!");
      setContactInfo("");
    } catch {
      setIsLoading(false);
      setErrorMessage("Error al enviar la invitación. Intenta de nuevo.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="neo-raised p-8">
        <h2 className="mb-2 text-2xl font-bold text-[var(--on-surface)]">
          Invitar Nuevo Contratista
        </h2>
        <p className="mb-8 text-[var(--on-surface-variant)]">
          Envía una invitación a futuros contratistas ingresando su correo electrónico o número de WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setMethod("email");
                setContactInfo("");
                setSuccessMessage("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
                method === "email"
                  ? "neo-inset text-[var(--primary)]"
                  : "neo-raised text-[var(--on-surface-variant)]"
              }`}
            >
              <Mail size={20} />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod("whatsapp");
                setContactInfo("");
                setSuccessMessage("");
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all ${
                method === "whatsapp"
                  ? "neo-inset text-emerald-600"
                  : "neo-raised text-[var(--on-surface-variant)]"
              }`}
            >
              <Phone size={20} />
              WhatsApp
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[var(--on-surface)]">
              {method === "email" ? "Correo Electrónico" : "Número de WhatsApp"}
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[var(--outline)]">
                {method === "email" ? <Mail size={20} /> : <Phone size={20} />}
              </div>
              <input
                type={method === "email" ? "email" : "tel"}
                placeholder={
                  method === "email"
                    ? "ejemplo@correo.com"
                    : "+1234567890"
                }
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                required
                className="neo-inset w-full rounded-xl py-3 pl-12 pr-4 outline-none transition-all focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !contactInfo}
            className="primary-button flex w-full items-center justify-center gap-2 py-3 text-lg font-bold disabled:opacity-50"
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send size={20} />
                Enviar Invitación
              </>
            )}
          </button>

          {successMessage && (
            <div className="neo-inset mt-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-500/10 p-4 text-emerald-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="neo-inset mt-4 rounded-xl border-l-4 border-red-500 bg-red-500/10 p-4 text-red-700">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
