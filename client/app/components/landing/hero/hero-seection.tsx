import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-8 pt-20 pb-32 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="z-10">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wider text-primary uppercase neo-raised rounded-full">
            Excelencia Profesional
          </span>

          <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-on-surface mb-6">
            Únete a nuestra red{' '}
            <span className="text-primary">
              profesional.
            </span>
          </h1>

          <p className="text-lg text-on-surface-variant mb-10 max-w-lg leading-relaxed">
            Completa tu registro en minutos y comienza a trabajar.
            Conéctate con oportunidades premium dentro de nuestra plataforma.
          </p>

          <div className="flex flex-wrap gap-6">
            <button className="px-8 py-4 text-primary font-semibold rounded-xl neo-raised hover:scale-[1.02] active:scale-95 active:neo-inset transition-all duration-200">
              Comenzar ahora
            </button>

            <button className="px-8 py-4 text-on-surface-variant font-medium rounded-xl hover:text-on-surface transition-all duration-200">
              Ver oportunidades
            </button>
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          <div className="w-full aspect-square max-w-lg neo-raised rounded-3xl overflow-hidden relative p-4">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPqolH04RdcI637p-q1dqJUMrRohETZ7CeOqKy20OXbYQGSz2adAY-iL3iYBRyN-AC5tGlQlF7P68QWN_A39mzn9mk9Y25o9beeE5p3kZGwS1TVvVcaD9dMFIQR38syOrfMSmwn33kJDnVd88R2PlD4gVTo6t821VKbOxfqHZr3d9vu7nc7U5GO5Q4PqmK9EUH91H9pCb0vY4_z9m7-e7wdmEYtYSxhE9D42U0N0V4qnH2m8bOI9O7iACzmoYvgS78P6sl0oqGiWa6"
              alt="Profesional usando tablet"
              width={800}
              height={800}
              className="w-full h-full object-cover rounded-2xl grayscale-[0.2]"
            />

            <div className="absolute bottom-10 -left-6 px-6 py-4 neo-raised rounded-2xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white">
                  ✓
                </div>

                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Aprobación rápida
                  </p>

                  <p className="text-sm font-semibold text-on-surface">
                    Identidad verificada
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-10 -right-6 px-6 py-4 neo-raised rounded-2xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-white">
                  ↗
                </div>

                <div>
                  <p className="text-xs text-on-surface-variant font-medium">
                    Crecimiento de la red
                  </p>

                  <p className="text-sm font-semibold text-on-surface">
                    +12k Profesionales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}