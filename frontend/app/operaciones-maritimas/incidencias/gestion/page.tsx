"use client";

import { Header } from "@/components/Header";

const operacionesMock = [
  {
    codigo: "OP-56789",
    tipoOperacion: "Descarga",
    buque: "MSC Gülsün",
    tipoIncidencia: "Daño a la carga",
    gravedad: "Alta",
    fecha: "2024-05-20",
    ameritaInvestigacion: true,
  },
  {
    codigo: "OP-12345",
    tipoOperacion: "Carga",
    buque: "Ever Ace",
    tipoIncidencia: "Retraso en la salida",
    gravedad: "Media",
    fecha: "2024-05-18",
    ameritaInvestigacion: false,
  },
  {
    codigo: "OP-98765",
    tipoOperacion: "Maniobra",
    buque: "HMM Algeciras",
    tipoIncidencia: "Incidente menor en puerto",
    gravedad: "Baja",
    fecha: "2024-05-15",
    ameritaInvestigacion: false,
  },
  {
    codigo: "OP-24680",
    tipoOperacion: "Descarga",
    buque: "CMA CGM Jacques Saadé",
    tipoIncidencia: "Pérdida de contenedor",
    gravedad: "Crítica",
    fecha: "2024-05-12",
    ameritaInvestigacion: false,
  },
];

export default function GestionIncidenciasOperacionesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-gray-900">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        <section>
          <h1 className="text-3xl font-bold text-[#003d5c] md:text-4xl">
            Operaciones con Incidencias
          </h1>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-3 rounded-md border border-gray-200 px-3 py-2">
              <span className="text-lg" aria-hidden>
                🔍
              </span>
              <input
                type="text"
                placeholder="Buscar por código de operación, nombre del buque..."
                className="w-full border-none bg-transparent text-sm outline-none placeholder:text-gray-400 md:text-base"
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#003d5c] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#00547a] md:text-base"
           >
              <span aria-hidden>☰</span>
              <span>Filtrar</span>
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-[#003d5c]">
                <tr>
                  <th className="px-4 py-3">Código Operación</th>
                  <th className="px-4 py-3">Tipo Operación</th>
                  <th className="px-4 py-3">Nombre del Buque</th>
                  <th className="px-4 py-3">Tipo Incidencia</th>
                  <th className="px-4 py-3">Gravedad</th>
                  <th className="px-4 py-3">Fecha Incidencia</th>
                  <th className="px-4 py-3">¿Amerita Investigación?</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                {operacionesMock.map((op) => (
                  <tr key={op.codigo} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {op.codigo}
                    </td>
                    <td className="px-4 py-3 text-sm">{op.tipoOperacion}</td>
                    <td className="px-4 py-3 text-sm">{op.buque}</td>
                    <td className="px-4 py-3 text-sm">{op.tipoIncidencia}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          op.gravedad === "Crítica"
                            ? "bg-red-100 text-red-800"
                            : op.gravedad === "Alta"
                            ? "bg-rose-100 text-rose-700"
                            : op.gravedad === "Media"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-cyan-100 text-cyan-800"
                        }`}
                      >
                        {op.gravedad}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{op.fecha}</td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        defaultChecked={op.ameritaInvestigacion}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button className="text-sm font-medium text-orange-500 hover:underline">
                        Ver Detalles de Incidencia
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 md:flex-row">
            <span>
              Mostrando {operacionesMock.length} de 12 incidencias
            </span>
            <div className="inline-flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
                {"<"}
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded border border-orange-500 bg-orange-500 text-sm font-semibold text-white">
                1
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
                2
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
                3
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50">
                {">"}
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-6 text-xl font-semibold text-[#003d5c] md:text-2xl">
            Registrar Nueva Inspección
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Tipo de Inspección
              </label>
              <select className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option>Seleccionar Tipo</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Prioridad</label>
              <select className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option>Seleccionar Prioridad</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Fecha de Creación
              </label>
              <input
                type="date"
                defaultValue="2024-05-23"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Hora de Creación
              </label>
              <input
                type="time"
                defaultValue="10:30"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-200"
            >
              Volver al Dashboard
            </button>
            <button
              type="button"
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-600"
            >
              Marcar para Investigación
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
