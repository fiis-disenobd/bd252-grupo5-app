"use client";

import { useState, useEffect } from "react";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import Link from "next/link";

interface Contenedor {
  id_contenedor: string;
  codigo: string;
  peso: number;
  capacidad: number;
  dimensiones: string;
  estado_contenedor?: {
    nombre: string;
    id_estado_contenedor?: string;
  };
  tipo_contenedor?: {
    nombre: string;
    id_tipo_contenedor?: string;
  };
}

interface Estadisticas {
  total: number;
  porEstado: Array<{
    estado: string;
    cantidad: string;
  }>;
}

export default function ContenedoresPage() {
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({ total: 0, porEstado: [] });
  const [paginaActual, setPaginaActual] = useState(1);
  const contenedoresPorPagina = 12;

  // Cargar contenedores
  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:3001/monitoreo/contenedores";
        const params = new URLSearchParams();
        
        if (filtroEstado) params.append("estado", filtroEstado);
        if (filtroTipo) params.append("tipo", filtroTipo);
        
        if (params.toString()) url += `?${params.toString()}`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setContenedores(Array.isArray(data) ? data : []);
        } else {
          setContenedores([]);
        }
      } catch (error) {
        console.error("Error:", error);
        setContenedores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContenedores();
  }, [filtroEstado, filtroTipo]);

  // Cargar estadísticas
  useEffect(() => {
    fetch("http://localhost:3001/monitoreo/contenedores/estadisticas")
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
      .catch((err) => console.error("Error estadísticas:", err));
  }, [contenedores]);

  // Filtrar por búsqueda
  const contenedoresFiltrados = contenedores.filter((c) => {
    if (!busqueda) return true;
    const searchLower = busqueda.toLowerCase();
    return (
      c.codigo.toLowerCase().includes(searchLower) ||
      c.estado_contenedor?.nombre?.toLowerCase().includes(searchLower) ||
      c.tipo_contenedor?.nombre?.toLowerCase().includes(searchLower)
    );
  });

  // Paginación local
  const indexUltimo = paginaActual * contenedoresPorPagina;
  const indexPrimero = indexUltimo - contenedoresPorPagina;
  const contenedoresActuales = contenedoresFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(contenedoresFiltrados.length / contenedoresPorPagina) || 1;

  // Función para obtener color según estado de contenedor (badge en tarjetas)
  const getEstadoColor = (estado?: string) => {
    if (!estado) return "bg-gray-100 text-gray-700";

    const key = estado.toLowerCase();

    const colors: Record<string, string> = {
      // Disponible
      "disponible": "bg-emerald-50 text-emerald-700",
      // En Transito
      "en transito": "bg-blue-50 text-blue-700",
      // En Puerto
      "en puerto": "bg-indigo-50 text-indigo-700",
      // En Reparacion
      "en reparacion": "bg-amber-50 text-amber-700",
      // Fuera de Servicio
      "fuera de servicio": "bg-red-50 text-red-700",
    };

    return colors[key] || "bg-gray-100 text-gray-700";
  };

  // Configuración de íconos/colores para estadísticas por estado
  const getEstadoStatsConfig = (estado: string) => {
    const key = (estado || "").toLowerCase();

    if (key === "disponible") {
      return {
        icon: "inventory_2",
        iconBg: "bg-emerald-50",
        iconColor: "text-emerald-600",
      };
    }

    if (key === "en transito") {
      return {
        icon: "local_shipping",
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      };
    }

    if (key === "en puerto") {
      return {
        icon: "sailing",
        iconBg: "bg-indigo-50",
        iconColor: "text-indigo-600",
      };
    }

    if (key === "en reparacion") {
      return {
        icon: "build",
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      };
    }

    if (key === "fuera de servicio") {
      return {
        icon: "report_problem",
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
      };
    }

    return {
      icon: "category",
      iconBg: "bg-zinc-100",
      iconColor: "text-zinc-600",
    };
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* Header Simplificado */}
      <MapHeader />

      {/* Main Content - Sin Sidebar */}
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-zinc-900">Contenedores</h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    Gestión y monitoreo de contenedores
                  </p>
                </div>
                <Link
                  href="/monitoreo/contenedores/nuevo"
                  className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Nuevo Contenedor
                </Link>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <span className="material-symbols-outlined text-2xl text-primary">inventory_2</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Total Contenedores</p>
                    <p className="text-2xl font-bold text-zinc-900">{estadisticas.total}</p>
                  </div>
                </div>
              </div>
              
              {estadisticas.porEstado.slice(0, 3).map((stat, index) => {
                const cfg = getEstadoStatsConfig(stat.estado);
                return (
                  <div key={index} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${cfg.iconBg}`}>
                        <span className={`material-symbols-outlined text-2xl ${cfg.iconColor}`}>{cfg.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">{stat.estado || 'Sin estado'}</p>
                        <p className="text-2xl font-bold text-zinc-900">{stat.cantidad}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Filtros y Búsqueda */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {/* Búsqueda */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">search</span>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar por código, estado, tipo..."
                    className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Filtro Estado */}
              <select
                value={filtroEstado}
                onChange={(e) => {
                  setFiltroEstado(e.target.value);
                  setPaginaActual(1);
                }}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="En Transito">En Transito</option>
                <option value="En Puerto">En Puerto</option>
                <option value="En Reparacion">En Reparacion</option>
                <option value="Fuera de Servicio">Fuera de Servicio</option>
              </select>

              {/* Filtro Tipo */}
              <select
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value);
                  setPaginaActual(1);
                }}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los tipos</option>
                <option value="20 Pies Estandar">20 Pies Estandar</option>
                <option value="40 Pies Estandar">40 Pies Estandar</option>
                <option value="40 Pies High Cube">40 Pies High Cube</option>
                <option value="20 Pies Refrigerado">20 Pies Refrigerado</option>
                <option value="40 Pies Refrigerado">40 Pies Refrigerado</option>
                <option value="20 Pies Open Top">20 Pies Open Top</option>
                <option value="40 Pies Open Top">40 Pies Open Top</option>
              </select>

              {/* Limpiar filtros */}
              {(filtroEstado || filtroTipo || busqueda) && (
                <button
                  onClick={() => {
                    setFiltroEstado("");
                    setFiltroTipo("");
                    setBusqueda("");
                    setPaginaActual(1);
                  }}
                  className="flex h-10 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                  Limpiar
                </button>
              )}
            </div>

            {/* Grid de Contenedores */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : contenedoresFiltrados.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white py-12">
                <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">inventory_2</span>
                <p className="text-lg font-semibold text-zinc-700">No se encontraron contenedores</p>
                <p className="text-sm text-zinc-500">Intenta con otros filtros de búsqueda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {contenedoresActuales.map((contenedor) => (
                  <div
                    key={contenedor.id_contenedor}
                    className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header de la tarjeta */}
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <span className="material-symbols-outlined text-2xl text-primary">inventory_2</span>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoColor(contenedor.estado_contenedor?.nombre)}`}>
                        {contenedor.estado_contenedor?.nombre || "Sin estado"}
                      </span>
                    </div>

                    {/* Código del contenedor */}
                    <h3 className="mb-3 text-lg font-bold text-zinc-900">
                      {contenedor.codigo}
                    </h3>

                    {/* Información */}
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center justify-between text-zinc-600">
                        <span>Tipo:</span>
                        <span className="font-medium text-zinc-900">
                          {contenedor.tipo_contenedor?.nombre || "No especificado"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600">
                        <span>Peso:</span>
                        <span className="font-medium text-zinc-900">
                          {contenedor.peso ? `${contenedor.peso} kg` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600">
                        <span>Capacidad:</span>
                        <span className="font-medium text-zinc-900">
                          {contenedor.capacidad ? `${contenedor.capacidad} kg` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-600">
                        <span>Dimensiones:</span>
                        <span className="font-medium text-zinc-900">
                          {contenedor.dimensiones || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Link
                        href={`/monitoreo/contenedores/${contenedor.id_contenedor}`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                      >
                        <span className="material-symbols-outlined text-base">visibility</span>
                        Ver
                      </Link>
                      <Link
                        href={`/monitoreo/contenedores/${contenedor.id_contenedor}`}
                        className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                      >
                        <span className="material-symbols-outlined text-base">sensors</span>
                        Sensores
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resultados */}
            {!loading && contenedoresFiltrados.length > 0 && (
              <>
                <div className="mt-6 text-center text-sm text-zinc-500">
                  Mostrando
                  {" "}
                  <span className="font-medium">{indexPrimero + 1}</span>
                  {" "}
                  a
                  {" "}
                  <span className="font-medium">{Math.min(indexUltimo, contenedoresFiltrados.length)}</span>
                  {" "}
                  de
                  {" "}
                  <span className="font-medium">{contenedoresFiltrados.length}</span>
                  {" "}
                  contenedores
                  {busqueda && contenedoresFiltrados.length !== contenedores.length && (
                    <span className="ml-1 text-zinc-400">(filtrado de {contenedores.length})</span>
                  )}
                </div>

                {/* Paginación */}
                {totalPaginas > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                      disabled={paginaActual === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {(() => {
                        const maxVisibles = 5;
                        if (totalPaginas <= maxVisibles) {
                          return Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => (
                            <button
                              key={numPagina}
                              onClick={() => setPaginaActual(numPagina)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                                paginaActual === numPagina
                                  ? "border border-orange-500 bg-orange-50 text-orange-600"
                                  : "border border-transparent text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              {numPagina}
                            </button>
                          ));
                        }

                        const start = Math.max(1, Math.min(paginaActual - 2, totalPaginas - maxVisibles + 1));
                        const end = Math.min(totalPaginas, start + maxVisibles - 1);
                        const paginas = [] as number[];
                        for (let p = start; p <= end; p++) paginas.push(p);

                        return (
                          <>
                            {start > 1 && (
                              <>
                                <button
                                  onClick={() => setPaginaActual(1)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                                    paginaActual === 1
                                      ? "border border-orange-500 bg-orange-50 text-orange-600"
                                      : "border border-transparent text-zinc-600 hover:bg-zinc-100"
                                  }`}
                                >
                                  1
                                </button>
                                {start > 2 && <span className="text-zinc-400">...</span>}
                              </>
                            )}

                            {paginas.map((numPagina) => (
                              <button
                                key={numPagina}
                                onClick={() => setPaginaActual(numPagina)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                                  paginaActual === numPagina
                                    ? "border border-orange-500 bg-orange-50 text-orange-600"
                                    : "border border-transparent text-zinc-600 hover:bg-zinc-100"
                                }`}
                              >
                                {numPagina}
                              </button>
                            ))}

                            {end < totalPaginas && (
                              <>
                                {end < totalPaginas - 1 && <span className="text-zinc-400">...</span>}
                                <button
                                  onClick={() => setPaginaActual(totalPaginas)}
                                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                                    paginaActual === totalPaginas
                                      ? "border border-orange-500 bg-orange-50 text-orange-600"
                                      : "border border-transparent text-zinc-600 hover:bg-zinc-100"
                                  }`}
                                >
                                  {totalPaginas}
                                </button>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                      disabled={paginaActual === totalPaginas}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
    </div>
  );
}
