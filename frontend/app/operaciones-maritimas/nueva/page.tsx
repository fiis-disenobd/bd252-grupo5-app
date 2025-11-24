import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { ContenedoresInfo } from "@/components/operaciones-maritimas/ContenedoresInfo";

type Buque = {
  id_buque: string;
  matricula: string;
  nombre: string;
  capacidad: number;
  peso: number | string;
  ubicacion_actual: string | null;
};

type NuevaOperacionMaritimaPageProps = {
  searchParams: Promise<{
    id_buque?: string;
    routeId?: string;
    routeCode?: string;
    originName?: string;
    destinationName?: string;
    distance?: string;
    duration?: string;
    originDockCode?: string;
    destinationDockCode?: string;
    contenedores?: string;
  }>;
};

export default async function NuevaOperacionMaritimaPage({
  searchParams,
}: NuevaOperacionMaritimaPageProps) {
  const resolvedSearchParams = await searchParams;
  const idBuque = resolvedSearchParams.id_buque;
  const routeId = resolvedSearchParams.routeId;
  const routeCode = resolvedSearchParams.routeCode ?? "-";
  const routeOriginName = resolvedSearchParams.originName ?? "-";
  const routeDestinationName = resolvedSearchParams.destinationName ?? "-";
  const routeDistance = resolvedSearchParams.distance ?? "-";
  const routeDuration = resolvedSearchParams.duration ?? "-";
  const routeOriginDockCode = resolvedSearchParams.originDockCode ?? "-";
  const routeDestinationDockCode = resolvedSearchParams.destinationDockCode ?? "-";
  const contenedoresSeleccionados = resolvedSearchParams.contenedores;

  const routeQuery = new URLSearchParams();
  if (routeId) routeQuery.set("routeId", routeId);
  if (routeCode && routeCode !== "-") routeQuery.set("routeCode", routeCode);
  if (routeOriginName && routeOriginName !== "-") routeQuery.set("originName", routeOriginName);
  if (routeDestinationName && routeDestinationName !== "-")
    routeQuery.set("destinationName", routeDestinationName);
  if (routeDistance && routeDistance !== "-") routeQuery.set("distance", routeDistance);
  if (routeDuration && routeDuration !== "-") routeQuery.set("duration", routeDuration);
  if (routeOriginDockCode && routeOriginDockCode !== "-")
    routeQuery.set("originDockCode", routeOriginDockCode);
  if (routeDestinationDockCode && routeDestinationDockCode !== "-")
    routeQuery.set("destinationDockCode", routeDestinationDockCode);
  if (idBuque) routeQuery.set("id_buque", idBuque);
  if (contenedoresSeleccionados)
    routeQuery.set("contenedores", contenedoresSeleccionados);

  const cambiarEmbarcacionHref = (() => {
    const qs = routeQuery.toString();
    return qs
      ? `/operaciones-maritimas/nueva/embarcacion?${qs}`
      : "/operaciones-maritimas/nueva/embarcacion";
  })();

  let buque: Buque | null = null;

  if (idBuque) {
    try {
      const response = await fetch(
        `http://localhost:3001/monitoreo/buques/${idBuque}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        buque = (await response.json()) as Buque | null;
      }
    } catch (error) {
      console.error("Error al obtener buque para la operación:", error);
    }
  }

  const vesselNombre = buque?.nombre ?? "Sin embarcación seleccionada";
  const vesselMatricula = buque?.matricula ?? "-";
  const vesselCapacidad =
    typeof buque?.capacidad === "number" ? buque?.capacidad.toString() : "-";
  const vesselPeso =
    buque?.peso !== undefined && buque?.peso !== null
      ? buque.peso.toString()
      : "-";
  const vesselUbicacion = buque?.ubicacion_actual ?? "-";

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
                      {vesselNombre}
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
                      {vesselMatricula}
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
                      {vesselCapacidad}
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
                      {vesselPeso}
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
                      {vesselUbicacion}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href={cambiarEmbarcacionHref}
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
                  {/* Estado */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Estado
                    </label>
                    <select className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4">
                      <option>Seleccione estado</option>
                      <option>En Planificación</option>
                      <option>En Progreso</option>
                      <option>Completada</option>
                      <option>Cancelada</option>
                      <option>En Espera</option>
                    </select>
                  </div>

                  {/* Fecha y hora estimada de inicio / fin */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="start-time"
                    >
                      Fecha y hora estimada de inicio
                    </label>
                    <input
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="start-time"
                      type="datetime-local"
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="end-time"
                    >
                      Fecha y hora estimada de fin
                    </label>
                    <input
                      className="block w-full rounded-lg bg-[#f5f7f8] dark:bg-slate-700 border-gray-200 dark:border-slate-700 shadow-sm focus:border-[#0459af] focus:ring focus:ring-[#0459af] focus:ring-opacity-50 text-sm py-2.5 px-4"
                      id="end-time"
                      type="datetime-local"
                    />
                  </div>

                  {/* (Se han eliminado Puerto/Muelle de origen y destino según solicitud) */}
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
                      {routeCode}
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
                      {routeDistance}
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
                      {routeOriginName}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="origin-dock-route"
                    >
                      Muelle de Origen
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      {routeOriginDockCode}
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
                      {routeDestinationName}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="destination-dock-route"
                    >
                      Muelle de Destino
                    </label>
                    <p className="block w-full rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent px-4 py-2.5 text-sm">
                      {routeDestinationDockCode}
                    </p>
                  </div>
                  <Link
                    href={
                      routeQuery.toString()
                        ? `/operaciones-maritimas/nueva/ruta?${routeQuery.toString()}`
                        : "/operaciones-maritimas/nueva/ruta"
                    }
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
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Todavía no se ha asignado tripulación
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#e6f0fa] text-[#0459af] text-sm font-semibold rounded-lg hover:bg-[#0459af]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0459af] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      group_add
                    </span>
                    <span>Asignar Tripulación</span>
                  </button>
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
                  href={routeQuery.toString()
                    ? `/operaciones-maritimas/nueva/contenedores?${routeQuery.toString()}`
                    : "/operaciones-maritimas/nueva/contenedores"}
                  className="flex items-center gap-2 px-4 py-2 bg-[#e6f0fa] text-[#0459af] text-sm font-semibold rounded-lg hover:bg-[#0459af]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0459af] transition-colors self-start md:self-center"
                >
                  <span className="material-symbols-outlined text-lg">
                    settings
                  </span>
                  Gestionar contenedores
                </Link>
              </div>
              <ContenedoresInfo selectedIdsParam={contenedoresSeleccionados} />
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

