import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";

export default function NuevaOperacionMaritimaPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f8] text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <Header />
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#0459af]">
                  Registro de Operación Marítima
                </h1>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      calendar_today
                    </span>
                    <span>21/05/2024 (Automático)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      schedule
                    </span>
                    <span>10:30 AM (Automático)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      person
                    </span>
                    <span>Usuario: J. Perez</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">
                      anchor
                    </span>
                    <span>Puerto: Algeciras</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-semibold">Nº Operación:</span>
                  <span className="bg-gray-200 dark:bg-slate-700 px-3 py-1.5 rounded-md text-xs">
                    OP-20240521-001 (Automático)
                  </span>
                </span>
                <Image
                  alt="User avatar"
                  className="h-10 w-10 rounded-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2dLT5BTromXioK4wV6ALN_C3AVwem9YEyECyzr_g3OdNVYl29mRg_6k022s4sGJGUPmlez7iw5trFen4hklRqRY85XMGGVh1bNX5XfDzQ5fAFGB3xTSrFmpQYHAnVxdP-ofkPK6KDtFp6o_NBTU64w2YgfwgxNgV6QaQKq6po2IH5eLSanYNkRWZVsgrJz6qYh44KXZ_LDkYQPDGqWKsF9hoLNi3Jwdpdey2IzmWgcPLgQxoUG3d4y9Ve9oqaLIcQAdurOi2jYSzJ"
                  height={40}
                  width={40}
                />
              </div>
            </div>
          </header>

          <div className="mb-8 flex space-x-4">
            <button
              type="button"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#e6f0fa] dark:hover:bg-[#0459af]/20 text-gray-600 dark:text-gray-400 hover:text-[#0459af] dark:hover:text-white bg-white dark:bg-slate-800 shadow-sm border border-gray-200 dark:border-slate-700"
            >
              <span className="material-symbols-outlined">print</span>
              <span>Generar Documentos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            <div className="xl:col-span-3 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0459af] text-2xl">
                    directions_boat
                  </span>
                  Información de la Embarcación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="vessel-name"
                    >
                      Nombre
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      HMM Algeciras
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="vessel-id"
                    >
                      Número de matrícula/IMO
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      9863297
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="vessel-capacity"
                    >
                      Capacidad (TEUs)
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      12000
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="vessel-weight"
                    >
                      Peso (t)
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      150000.00
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="vessel-location"
                    >
                      Ubicación actual
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      8.9824 N, 79.5199 W
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/operaciones-maritimas/nueva/embarcacion"
                    className="flex items-center gap-2 px-4 py-2 bg-[#e6f0fa] text-[#0459af] text-sm font-semibold rounded-lg hover:bg-[#0459af]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      swap_horiz
                    </span>
                    Cambiar Embarcación
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0459af] text-2xl">
                    list_alt
                  </span>
                  Detalles de la Operación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Estado
                    </label>
                    <span className="block w-full rounded-lg bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800/50 px-4 py-2.5 text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                      Planificada
                    </span>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="start-time"
                    >
                      Hora Inicio Estimada
                    </label>
                    <input
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="start-time"
                      type="datetime-local"
                      defaultValue="2024-05-21T15:00"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="end-time"
                    >
                      Hora Fin Estimada
                    </label>
                    <input
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="end-time"
                      type="datetime-local"
                      defaultValue="2024-05-21T23:00"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="origin-dock"
                    >
                      Muelle de origen
                    </label>
                    <select
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="origin-dock"
                      defaultValue="Muelle 7B"
                    >
                      <option>Muelle 5A</option>
                      <option>Muelle 7B</option>
                      <option>Muelle 3C</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="destination-dock"
                    >
                      Muelle de destino
                    </label>
                    <select
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="destination-dock"
                    >
                      <option>Seleccione un muelle</option>
                      <option>Muelle 1A</option>
                      <option>Muelle 2B</option>
                      <option>Muelle 4D</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0459af] text-2xl">
                    route
                  </span>
                  Ruta Marítima
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="route-code"
                    >
                      Código
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      RM-CALLAO-VALPO
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="distance"
                    >
                      Distancia
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      10500
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="origin-port"
                    >
                      Puerto de Origen
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      Puerto de Singapur (SGSIN)
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="destination-port"
                    >
                      Puerto de Destino
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      Puerto de Algeciras (ESALG)
                    </p>
                  </div>
                  <Link
                    href="/operaciones-maritimas/nueva/ruta"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e6f0fa] text-[#0459af] text-sm font-semibold rounded-lg hover:bg-[#0459af]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0459af] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit_road
                    </span>
                    Modificar Ruta
                  </Link>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0459af] text-2xl">
                    groups
                  </span>
                  Tripulación Asignada
                </h2>
                <div className="space-y-6">
                  <div>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Capitán:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Juan Rodriguez
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Jefe de Máquinas:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Carlos Sánchez
                        </span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          Primer Oficial:
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          Maria López
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e6f0fa] text-[#0459af] text-sm font-semibold rounded-lg hover:bg-[#0459af]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0459af] transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          group_add
                        </span>
                        Asignar tripulación
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#0459af] text-2xl">
                    view_in_ar
                  </span>
                  Información de Contenedores
                </h2>
                <Link
                  href="/operaciones-maritimas/nueva/contenedores"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0459af] text-white text-sm font-semibold rounded-lg hover:bg-[#0459af]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0459af] transition-colors self-start md:self-center"
                >
                  <span className="material-symbols-outlined text-lg">
                    settings
                  </span>
                  Gestionar contenedores
                </Link>
              </div>
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-4" scope="col">
                        Código
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Peso (Kg)
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Capacidad (Kg)
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Dimensiones (ft)
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Mercancía
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Estado
                      </th>
                      <th className="px-6 py-4" scope="col">
                        Tipo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">CONT-123</td>
                      <td className="px-6 py-4">2500.00</td>
                      <td className="px-6 py-4">33500.00</td>
                      <td className="px-6 py-4">20x8x8.5</td>
                      <td className="px-6 py-4">Productos electrónicos</td>
                      <td className="px-6 py-4">En tránsito</td>
                      <td className="px-6 py-4">Refrigerado</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">CONT-456</td>
                      <td className="px-6 py-4">2800.50</td>
                      <td className="px-6 py-4">33500.00</td>
                      <td className="px-6 py-4">20x8x8.5</td>
                      <td className="px-6 py-4">Textiles</td>
                      <td className="px-6 py-4">En puerto</td>
                      <td className="px-6 py-4">Carga seca</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">CONT-789</td>
                      <td className="px-6 py-4">5500.00</td>
                      <td className="px-6 py-4">67000.00</td>
                      <td className="px-6 py-4">40x8x8.5</td>
                      <td className="px-6 py-4">Automóviles</td>
                      <td className="px-6 py-4">En tránsito</td>
                      <td className="px-6 py-4">Open Top</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-end gap-4 xl:col-span-5">
            <button
              type="button"
              className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#10b981] text-white text-sm font-bold rounded-lg hover:bg-[#10b981]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#10b981] disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
              disabled
            >
              <span className="material-symbols-outlined text-lg">
                play_arrow
              </span>
              Iniciar Operación
            </button>
          </footer>
        </div>
      </main>
    </div>
  );
}

