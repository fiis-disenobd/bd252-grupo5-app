import { Header } from "@/components/Header";

const voyages = [
  {
    code: "OPM-2025-001",
    containers: 350,
    status: "Navegando",
    progress: 75,
    ship: "IMO-9347438",
  },
  {
    code: "OPM-2025-002",
    containers: 280,
    status: "En puerto",
    progress: 100,
    ship: "IMO-9234567",
  },
  {
    code: "OPM-2025-003",
    containers: 420,
    status: "En tránsito",
    progress: 50,
    ship: "IMO-9123456",
  },
  {
    code: "OPM-2025-004",
    containers: 150,
    status: "Navegando",
    progress: 90,
    ship: "IMO-9456789",
  },
  {
    code: "OPM-2025-005",
    containers: 300,
    status: "En puerto",
    progress: 100,
    ship: "IMO-9567890",
  },
];

const statusStyles: Record<
  string,
  { badge: string; text: string; bg: string }
> = {
  Navegando: {
    badge:
      "text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200",
    text: "text-blue-800",
    bg: "bg-blue-100",
  },
  "En puerto": {
    badge:
      "text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200",
    text: "text-green-800",
    bg: "bg-green-100",
  },
  "En tránsito": {
    badge:
      "text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200",
    text: "text-yellow-800",
    bg: "bg-yellow-100",
  },
};

export default function DashboardOperacionesMaritimas() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f8] text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <Header />
      <main className="container mx-auto flex flex-grow flex-col px-6 py-8">
        <section className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            <span className="text-[#f06c00] underline decoration-[#f06c00] decoration-2 underline-offset-4">
              Operaciones
            </span>{" "}
            marítimas
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-[#0459af]/20 px-4 py-2 font-semibold text-[#0459af] transition-colors hover:bg-[#0459af]/30"
            >
              Actualizar Dashboard
            </button>
            <button
              type="button"
              className="rounded-lg bg-[#0459af] px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-[#0459af]/90"
            >
              Nueva Operación Marítima
            </button>
          </div>
        </section>

        <section className="rounded-xl bg-white shadow-md dark:bg-[#172335]/70">
          <div className="p-6">
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar operaciones por código o buque"
                  className="w-full rounded-lg border border-gray-300 bg-[#f5f7f8] py-2 pl-10 pr-4 text-gray-900 focus:border-[#0459af] focus:outline-none focus:ring-[#0459af] dark:border-gray-700 dark:bg-[#0f1923] dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-4 md:w-auto md:flex-row md:items-center">
                <select className="form-select rounded-lg border border-gray-300 bg-[#f5f7f8] text-gray-900 transition-colors focus:border-[#0459af] focus:outline-none focus:ring-[#0459af] dark:border-gray-700 dark:bg-[#0f1923] dark:text-white">
                  <option>Estatus Navegación</option>
                  <option>Navegando</option>
                  <option>En puerto</option>
                  <option>En tránsito</option>
                </select>
                <button
                  type="button"
                  className="text-gray-600 transition-colors hover:text-[#0459af] dark:text-gray-300 dark:hover:text-[#0459af]"
                >
                  Filtros
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-[#f5f7f8] text-xs uppercase text-gray-700 dark:bg-[#111b2c] dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Código
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cantidad Contenedores
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Estatus Navegación
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Trayecto Completado
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Matrícula de Buque
                  </th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {voyages.map((voyage) => {
                  const styles = statusStyles[voyage.status];
                  return (
                    <tr
                      key={voyage.code}
                      className="border-b bg-white text-gray-900 transition-colors hover:bg-[#f5f7f8] dark:border-gray-800 dark:bg-[#172335]/70 dark:text-gray-100 dark:hover:bg-[#1e2b42]"
                    >
                      <th
                        scope="row"
                        className="whitespace-nowrap px-6 py-4 font-medium"
                      >
                        {voyage.code}
                      </th>
                      <td className="px-6 py-4">{voyage.containers}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${styles?.badge ?? ""}`}
                        >
                          {voyage.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-2.5 rounded-full bg-[#0459af]"
                              style={{ width: `${voyage.progress}%` }}
                            />
                          </div>
                          <span className="font-medium">
                            {voyage.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{voyage.ship}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="font-medium text-[#0459af] hover:underline"
                        >
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

