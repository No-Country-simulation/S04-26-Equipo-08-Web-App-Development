"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";

const contactInfo = [
  { icon: Phone, label: "Teléfono", value: "+52 (55) 1234 5678", detail: "Lun–Vie, 9:00–18:00" },
  { icon: Mail, label: "Correo", value: "soporte@northpay.mx", detail: "Respuesta en 24h" },
  { icon: MapPin, label: "Dirección", value: "Av. Insurgentes Sur 123", detail: "Col. Roma, CDMX" },
  { icon: Clock, label: "Horario", value: "Lun–Vie 9:00–18:00", detail: "Sábados 9:00–14:00" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <main className="flex-grow">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--on-surface)] tracking-tight">
            Contáctanos
          </h1>
          <p className="text-lg text-[var(--on-surface-variant)] max-w-xl mx-auto">
            ¿Tienes dudas o necesitas ayuda? Estamos aquí para ti.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item) => (
            <div key={item.label} className="rounded-3xl bg-[var(--background)] p-6 shadow-xl text-center space-y-3">
              <div className="inline-flex rounded-2xl bg-white p-3 shadow-md">
                <item.icon size={24} className="text-[var(--primary)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--on-surface-variant)] uppercase tracking-wider">
                {item.label}
              </p>
              <p className="text-base font-semibold text-[var(--on-surface)]">{item.value}</p>
              <p className="text-xs text-[var(--outline)]">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-[var(--background)] p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--on-surface)] mb-2">Envíanos un mensaje</h2>
          <p className="text-sm text-[var(--on-surface-variant)] mb-8">
            Completa el formulario y te responderemos a la brevedad.
          </p>

          {sent ? (
            <div className="rounded-2xl bg-green-50 border border-green-200 p-8 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <Send size={28} className="text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-800">¡Mensaje enviado!</p>
              <p className="text-sm text-green-600">Te contactaremos pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--on-surface-variant)] ml-2">
                    Nombre
                  </label>
                  <div className="rounded-xl bg-[var(--background)] shadow-inner p-1">
                    <input
                      required
                      className="w-full bg-transparent px-4 py-3 text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none"
                      placeholder="Tu nombre"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--on-surface-variant)] ml-2">
                    Correo
                  </label>
                  <div className="rounded-xl bg-[var(--background)] shadow-inner p-1">
                    <input
                      required
                      type="email"
                      className="w-full bg-transparent px-4 py-3 text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--on-surface-variant)] ml-2">
                  Asunto
                </label>
                <div className="rounded-xl bg-[var(--background)] shadow-inner p-1">
                  <input
                    required
                    className="w-full bg-transparent px-4 py-3 text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none"
                    placeholder="¿Sobre qué nos quieres escribir?"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--on-surface-variant)] ml-2">
                  Mensaje
                </label>
                <div className="rounded-xl bg-[var(--background)] shadow-inner p-1">
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-transparent px-4 py-3 text-[var(--on-surface)] placeholder:text-[var(--outline)] outline-none resize-none"
                    placeholder="Escribe tu mensaje aquí..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold shadow-xl hover:opacity-90 transition-all"
                >
                  <Send size={18} />
                  Enviar mensaje
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
