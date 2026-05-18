import BenefitCard from "./BenefitCard";

export default function BenefitsSection() {
  return (
    <section className="px-8 py-24 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-semibold text-on-surface mb-4">
            La ventaja de SilkPortal
          </h2>

          <p className="text-on-surface-variant">
            Simplificando la conexión entre profesionales y proyectos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            title="Pagos rápidos"
            description="Facturación automatizada y pagos liberados rápidamente."
          />

          <BenefitCard
            title="Coincidencia de proyectos"
            description="Nuestro algoritmo conecta tus habilidades con proyectos de alto valor."
          />

          <BenefitCard
            title="Soporte profesional"
            description="Gestores especializados disponibles 24/7 para ayudarte."
          />
        </div>
      </div>
    </section>
  )
}