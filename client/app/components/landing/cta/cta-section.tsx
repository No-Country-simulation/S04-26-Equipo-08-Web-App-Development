export default function CTASection() {
  return (
    <section className="px-8 py-32">
      <div className="max-w-4xl mx-auto p-12 neo-raised rounded-[2rem] text-center">
        <h2 className="text-4xl font-semibold text-on-surface mb-6">
          ¿Listo para transformar tu forma de trabajar?
        </h2>

        <p className="text-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Únete a miles de profesionales independientes que optimizaron
          su flujo de trabajo y aumentaron sus oportunidades.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-10 py-4 text-primary font-semibold rounded-xl neo-raised hover:scale-[1.02] active:neo-inset active:scale-95 transition-all">
            Comenzar ahora
          </button>

          <button className="px-10 py-4 text-on-surface-variant font-medium rounded-xl hover:text-on-surface transition-all">
            Descargar folleto
          </button>
        </div>
      </div>
    </section>
  )
}