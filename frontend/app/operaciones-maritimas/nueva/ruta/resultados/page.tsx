import { Header } from "@/components/Header";
import Link from "next/link";

export default function RutasDisponiblesPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f5f7f8] dark:bg-[#0f1923] font-display">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rutas Disponibles por Puertos
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Callao
              </span>
              <span className="mx-2 text-[#0459af]">→</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Valparaíso
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Seleccione una ruta para ver los detalles y confirmar la operación.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Código
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Distancia
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Duración
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Puertos Intermedios
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Tarifa (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    RM-CALLAO-VALPO1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    3,400 km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    5 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    N/A
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    4,850.75
                  </td>
                </tr>
                <tr className="bg-[#0459af]/10 hover:bg-[#0459af]/20 dark:bg-[#0459af]/20 dark:hover:bg-[#0459af]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0459af]/80 dark:text-gray-300">
                    RM-CALLAO-VALPO2
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0459af]/80 dark:text-gray-300">
                    3,550 km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0459af]/80 dark:text-gray-300">
                    6 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0459af]/80 dark:text-gray-300">
                    Arica
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#0459af]/80 dark:text-gray-300">
                    5,120.00
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    RM-CALLAO-VALPO3
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    3,800 km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    7 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Iquique, Antofagasta
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    5,300.50
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    RM-CALLAO-VALPO4
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    3,450 km
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    5.5 días
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Mejillones
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    4,990.25
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href="/operaciones-maritimas/nueva/ruta"
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              Volver a Selección de Puertos
            </Link>
            <button
              type="button"
              className="rounded-lg bg-[#0459af] px-4 py-2 text-sm font-medium text-white hover:bg-[#0459af]/90"
            >
              Confirmar Ruta Seleccionada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

