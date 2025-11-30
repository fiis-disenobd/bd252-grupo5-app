"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Incidencia {
  id_incidencia: string;
  codigo: string;
  descripcion: string;
  grado_severidad: number;
  fecha_hora: string;
  tipo_incidencia?: {
    nombre: string;
  };
  estado_incidencia?: {
    nombre: string;
  };
  operacion?: {
    codigo: string;
  };
}

interface IncidenciasResponse {
  incidencias: Incidencia[];
  total: number;
  pagina: number;
  total_paginas: number;
  por_pagina: number;
}

interface TipoIncidencia {
  id_tipo_incidencia: string;
  nombre: string;
}

interface EstadoIncidencia {
  id_estado_incidencia: string;
  nombre: string;
}

interface Estadisticas {
  total: number;
  por_tipo: Array<{ tipo: string; cantidad: string }>;
  por_estado: Array<{ estado: string; cantidad: string }>;
  por_severidad: Array<{ severidad: number; cantidad: string }>;
}

export default function IncidenciasPage() {
  const [data, setData] = useState<IncidenciasResponse | null>(null);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [tipos, setTipos] = useState<TipoIncidencia[]>([]);
  const [estados, setEstados] = useState<EstadoIncidencia[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [codigoFiltro, setCodigoFiltro] = useState("");

  // Modal crear/editar
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [incidenciaActual, setIncidenciaActual] = useState<Incidencia | null>(null);

  // Modal eliminar
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [incidenciaEliminar, setIncidenciaEliminar] = useState<string | null>(null);

  const limite = 10;

  useEffect(() => {
    cargarDatos();
  }, [paginaActual, tipoFiltro, estadoFiltro, codigoFiltro]);

  const cargarDatos = () => {
    setLoading(true);

    const params = new URLSearchParams({
      pagina: paginaActual.toString(),
      limite: limite.toString(),
    });

    if (tipoFiltro) params.append("tipo", tipoFiltro);
    if (estadoFiltro) params.append("estado", estadoFiltro);
    if (codigoFiltro) params.append("codigo", codigoFiltro);

    fetch(`${API_URL}/monitoreo/incidencias?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Cargar datos auxiliares
    fetch(`${API_URL}/monitoreo/incidencias/estadisticas`)
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));

    fetch(`${API_URL}/monitoreo/incidencias/tipos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTipos(data);
        } else {
          console.error("Tipos no es un array:", data);
          setTipos([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando tipos:", err);
        setTipos([]);
      });

    fetch(`${API_URL}/monitoreo/incidencias/estados`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error("Estados no es un array:", data);
          setEstados([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando estados:", err);
        setEstados([]);
      });
  }, []);

  const limpiarFiltros = () => {
    setTipoFiltro("");
    setEstadoFiltro("");
    setCodigoFiltro("");
    setPaginaActual(1);
  };

  const handleNuevaIncidencia = () => {
    setModoEdicion(false);
    setIncidenciaActual(null);
    setShowModal(true);
  };

  const handleEditarIncidencia = (incidencia: Incidencia) => {
    setModoEdicion(true);
    setIncidenciaActual(incidencia);
    setShowModal(true);
  };

  const handleEliminarIncidencia = (id: string) => {
    setIncidenciaEliminar(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    if (!incidenciaEliminar) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    fetch(`${API_URL}/monitoreo/incidencias/${incidenciaEliminar}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res
            .json()
            .catch(() => ({}))
            .then((err) => {
              throw new Error(err.message || `Error ${res.status}`);
            });
        }
        setShowDeleteModal(false);
        setIncidenciaEliminar(null);
        cargarDatos();
      })
      .catch((err) => console.error("Error al eliminar incidencia:", err));
  };

  const getSeveridadColor = (severidad: number) => {
    if (severidad >= 4) return "bg-red-100 text-red-700 border-red-200";
    if (severidad >= 3) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getSeveridadLabel = (severidad: number) => {
    if (severidad >= 4) return "Crítica";
    if (severidad >= 3) return "Media";
    return "Baja";
  };

  const getEstadoColor = (estado?: string) => {
    const nombre = estado?.toLowerCase() || "";
    if (nombre.includes("abierta") || nombre.includes("pendiente"))
      return "bg-yellow-100 text-yellow-700";
    if (nombre.includes("proceso") || nombre.includes("investigacion"))
      return "bg-blue-100 text-blue-700";
    if (nombre.includes("cerrada") || nombre.includes("resuelta"))
      return "bg-green-100 text-green-700";
    return "bg-zinc-100 text-zinc-700";
  };

  const incidenciasFiltradas = data
    ? data.incidencias.filter((inc) => {
        if (!codigoFiltro) return true;
        return inc.codigo.toLowerCase().includes(codigoFiltro.toLowerCase());
      })
    : [];

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header con Botón Nuevo */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Gestión de Incidencias</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Registro y seguimiento de incidencias operacionales
              </p>
            </div>
            <button
              onClick={handleNuevaIncidencia}
              className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nueva Incidencia
            </button>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="material-symbols-outlined text-blue-600">report</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Total Incidencias</p>
                    <p className="text-2xl font-bold text-zinc-900">{estadisticas.total}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <span className="material-symbols-outlined text-red-600">warning</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Alta Severidad (4-5)</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {estadisticas.por_severidad
                        .filter((s) => Number(s.severidad) >= 4)
                        .reduce((sum, s) => sum + Number(s.cantidad), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                    <span className="material-symbols-outlined text-yellow-600">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Pendientes / Reportadas</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {estadisticas.por_estado
                        .filter((e) => {
                          const nombre = e.estado.toLowerCase();
                          return (
                            nombre.includes("pendiente") ||
                            nombre.includes("reportada") ||
                            nombre.includes("investigacion")
                          );
                        })
                        .reduce((sum, e) => sum + Number(e.cantidad), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <span className="material-symbols-outlined text-green-600">task_alt</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Resueltas / Cerradas</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {estadisticas.por_estado
                        .filter((e) => {
                          const nombre = e.estado.toLowerCase();
                          return nombre.includes("resuelta") || nombre.includes("cerrada");
                        })
                        .reduce((sum, e) => sum + Number(e.cantidad), 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Filtros</h2>
              <button
                onClick={limpiarFiltros}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Limpiar Filtros
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Código de Incidencia
                </label>
                <input
                  type="text"
                  value={codigoFiltro}
                  onChange={(e) => {
                    setCodigoFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  placeholder="Ej: INC-2405-0001"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Tipo de Incidencia
                </label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => {
                    setTipoFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos los tipos</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id_tipo_incidencia} value={tipo.id_tipo_incidencia}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">Estado</label>
                <select
                  value={estadoFiltro}
                  onChange={(e) => {
                    setEstadoFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos los estados</option>
                  {estados.map((estado) => (
                    <option key={estado.id_estado_incidencia} value={estado.id_estado_incidencia}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-end">
                <button
                  onClick={cargarDatos}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-lg">search</span>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Tabla de Incidencias */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-900">
                Incidencias ({incidenciasFiltradas.length || 0})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : data && incidenciasFiltradas.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Severidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-zinc-600">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                      {incidenciasFiltradas.map((incidencia) => (
                        <tr
                          key={incidencia.id_incidencia}
                          className="transition-colors hover:bg-zinc-50"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-medium text-zinc-900">
                              {incidencia.codigo}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-zinc-900">
                              {incidencia.tipo_incidencia?.nombre || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="line-clamp-2 text-sm text-zinc-600">
                              {incidencia.descripcion}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getSeveridadColor(
                                incidencia.grado_severidad
                              )}`}
                            >
                              <span className="h-2 w-2 rounded-full bg-current"></span>
                              {getSeveridadLabel(incidencia.grado_severidad)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoColor(
                                incidencia.estado_incidencia?.nombre
                              )}`}
                            >
                              {incidencia.estado_incidencia?.nombre || "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-zinc-600">
                              {new Date(incidencia.fecha_hora).toLocaleDateString("es-ES")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/monitoreo/incidencias/${incidencia.id_incidencia}`}
                                className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                title="Ver detalle"
                              >
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </Link>
                              <button
                                onClick={() => handleEditarIncidencia(incidencia)}
                                className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button
                                onClick={() => handleEliminarIncidencia(incidencia.id_incidencia)}
                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                title="Eliminar"
                              >
                                <span className="material-symbols-outlined text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                {data.total_paginas > 1 && (
                  <div className="flex items-center justify-between border-t border-zinc-200 p-6">
                    <p className="text-sm text-zinc-600">
                      Mostrando {(data.pagina - 1) * data.por_pagina + 1} -{" "}
                      {Math.min(data.pagina * data.por_pagina, data.total)} de {data.total}{" "}
                      incidencias
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPaginaActual(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className="flex items-center gap-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                        Anterior
                      </button>

                      <div className="flex items-center gap-1">
                        {(() => {
                          const pages: number[] = [];
                          const total = data.total_paginas;
                          const current = paginaActual;
                          const windowSize = 5;

                          let start = Math.max(1, current - Math.floor(windowSize / 2));
                          let end = start + windowSize - 1;

                          if (end > total) {
                            end = total;
                            start = Math.max(1, end - windowSize + 1);
                          }

                          for (let i = start; i <= end; i++) pages.push(i);

                          return (
                            <>
                              {start > 1 && (
                                <>
                                  <button
                                    onClick={() => setPaginaActual(1)}
                                    className={`h-10 w-10 rounded-lg border bg-orange-100 text-sm font-medium transition-colors ${
                                      paginaActual === 1
                                        ? "border-primary bg-primary text-white"
                                        : "border-zinc-300 bg-orange-500 text-zinc-700 hover:bg-zinc-50"
                                    }`}
                                  >
                                    1
                                  </button>
                                  {start > 2 && (
                                    <span className="px-1 text-zinc-400">...</span>
                                  )}
                                </>
                              )}

                              {pages.map((page) => (
                                <button
                                  key={page}
                                  onClick={() => setPaginaActual(page)}
                                  className={`h-10 w-10 rounded-lg border bg-orange-100 text-sm font-medium transition-colors ${
                                    page === paginaActual
                                      ? "border-primary bg-primary text-white"
                                      : "border-zinc-300 bg-orange-500 text-zinc-700 hover:bg-zinc-50"
                                  }`}
                                >
                                  {page}
                                </button>
                              ))}

                              {end < total && (
                                <>
                                  {end < total - 1 && (
                                    <span className="px-1 text-zinc-400">...</span>
                                  )}
                                  <button
                                    onClick={() => setPaginaActual(total)}
                                    className={`h-10 w-10 rounded-lg border bg-orange-100 text-sm font-medium transition-colors ${
                                      paginaActual === total
                                        ? "border-primary bg-primary text-white"
                                        : "border-zinc-300 bg-orange-500 text-zinc-700 hover:bg-zinc-50"
                                    }`}
                                  >
                                    {total}
                                  </button>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>

                      <button
                        onClick={() => setPaginaActual(paginaActual + 1)}
                        disabled={paginaActual === data.total_paginas}
                        className="flex items-center gap-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Siguiente
                        <span className="material-symbols-outlined text-base">chevron_right</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">
                  assignment
                </span>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">No hay incidencias</h3>
                <p className="text-sm text-zinc-500">
                  No se encontraron incidencias con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Crear/Editar - Ver archivo 2 */}
      {showModal && (
        <ModalIncidencia
          show={showModal}
          modoEdicion={modoEdicion}
          incidencia={incidenciaActual}
          tipos={tipos}
          estados={estados}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            cargarDatos();
          }}
        />
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-zinc-900">Confirmar Eliminación</h3>
            <p className="mb-6 text-sm text-zinc-600">
              ¿Estás seguro de que deseas eliminar esta incidencia? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminar}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente Modal - CÓDIGO COMPLETO
function ModalIncidencia({ show, modoEdicion, incidencia, tipos, estados, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    id_tipo_incidencia: incidencia?.tipo_incidencia?.id_tipo_incidencia || "",
    descripcion: incidencia?.descripcion || "",
    grado_severidad: incidencia?.grado_severidad || 3,
    id_estado_incidencia: incidencia?.estado_incidencia?.id_estado_incidencia || "",
    id_operacion: incidencia?.id_operacion || "",
  });

  const [operaciones, setOperaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar operaciones disponibles
    fetch(`${API_URL}/monitoreo/operaciones`)
      .then((res) => res.json())
      .then((data) => setOperaciones(data))
      .catch((err) => console.error("Error cargando operaciones:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = modoEdicion
      ? `${API_URL}/monitoreo/incidencias/${incidencia.id_incidencia}`
      : `${API_URL}/monitoreo/incidencias`;

    const method = modoEdicion ? "PUT" : "POST";

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Error del servidor");
          });
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        onSuccess();
      })
      .catch((err) => {
        console.error("Error al guardar:", err);
        setLoading(false);
        alert(`Error al guardar la incidencia: ${err.message}`);
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-900">
            {modoEdicion ? "Editar Incidencia" : "Nueva Incidencia"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tipo de Incidencia */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tipo de Incidencia *
              </label>
              <select
                value={formData.id_tipo_incidencia}
                onChange={(e) => setFormData({ ...formData, id_tipo_incidencia: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((tipo: any) => (
                  <option key={tipo.id_tipo_incidencia} value={tipo.id_tipo_incidencia}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Operación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Operación Relacionada *
              </label>
              <select
                value={formData.id_operacion}
                onChange={(e) => setFormData({ ...formData, id_operacion: e.target.value })}
                required
                disabled={modoEdicion}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar operación</option>
                {operaciones.map((op: any) => (
                  <option key={op.id_operacion} value={op.id_operacion}>
                    {op.codigo}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado (solo en modo edición) */}
            {modoEdicion && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Estado *
                </label>
                <select
                  value={formData.id_estado_incidencia}
                  onChange={(e) => setFormData({ ...formData, id_estado_incidencia: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado: any) => (
                    <option key={estado.id_estado_incidencia} value={estado.id_estado_incidencia}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Grado de Severidad */}
            <div className={modoEdicion ? "" : "md:col-span-2"}>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Grado de Severidad: {formData.grado_severidad}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.grado_severidad}
                onChange={(e) => setFormData({ ...formData, grado_severidad: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>Baja (1-2)</span>
                <span>Media (3)</span>
                <span>Alta (4-5)</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Descripción Detallada *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                rows={4}
                placeholder="Describe la incidencia en detalle..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Guardando...
                </span>
              ) : modoEdicion ? (
                "Actualizar"
              ) : (
                "Crear Incidencia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}