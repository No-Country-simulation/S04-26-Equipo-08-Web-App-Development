import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#e8eaf0] px-6 text-center">
      <h1 className="text-7xl font-black text-indigo-500">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-bold">
        Página no encontrada
      </h2>

      <p className="mt-3 max-w-md text-slate-500">
        La página que intentas visitar no existe
        o fue movida.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-2xl bg-indigo-500 px-6 py-3 font-medium text-white shadow-lg transition hover:scale-105"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}