import { HelpCircle, Mail, FileText, Users, Archive } from "lucide-react";

const faqs = [
  {
    icon: Mail,
    title: "¿Cómo invitar a un contratista?",
    description:
      "Ve a 'Agregar' en el menú lateral. Ingresa el correo electrónico o número de WhatsApp del contratista y envía la invitación.",
  },
  {
    icon: Users,
    title: "¿Cómo revisar contratistas?",
    description:
      "En la sección 'Contratistas' puedes ver el listado completo. Haz clic en el ojo para ver los detalles y aprobar o rechazar cada paso.",
  },
  {
    icon: FileText,
    title: "¿Cómo aprobar un paso del onboarding?",
    description:
      "Ingresa al detalle del contratista desde 'Contratistas'. Verás cada paso con botones 'Aprobar' o 'Rechazar'.",
  },
  {
    icon: Archive,
    title: "¿Qué hay en el Archivo?",
    description:
      "El archivo contiene contratistas cuyo proceso ha finalizado (activos o rechazados).",
  },
];

export default function HelpPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <HelpCircle className="text-primary" size={32} />
        <h1 className="text-3xl font-bold text-[var(--on-surface)]">Ayuda</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq) => (
          <div
            key={faq.title}
            className="rounded-3xl bg-[#e8eaf0] p-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-3 shadow-md">
                <faq.icon className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-2">{faq.title}</h2>
                <p className="text-slate-500 text-sm">{faq.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
