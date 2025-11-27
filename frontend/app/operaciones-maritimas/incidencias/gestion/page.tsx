"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  operacionesIncidenciasAPI,
  type OperacionConIncidencias,
} from "@/lib/api/operaciones-incidencias";

export default function GestionIncidenciasOperacionesPage() {
  const [operaciones, setOperaciones] = useState<OperacionConIncidencias[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [severidadMin, setSeveridadMin] = useState<number | undefined>();
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchOperaciones();
  }, [page, search, severidadMin]);

  const fetchOperaciones = async () => {
    setLoading(true);
    try {
      const response = await operacionesIncidenciasAPI.getOperacionesConIncidencias(
        page,
        limit,
        search || undefined,
        severidadMin,
      );
      setOperaciones(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching operaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getSeveridadLabel = (grado: number) => {
    if (grado >= 5) return "Crítica";
    if (grado >= 4) return "Alta";
    if (grado >= 3) return "Media";
    return "Baja";
  };

  const getSeveridadClass = (grado: number) => {
    if (grado >= 5) return "bg-red-100 text-red-800";
    if (grado >= 4) return "bg-rose-100 text-rose-700";
    if (grado >= 3) return "bg-amber-100 text-amber-800";
    return "bg-cyan-100 text-cyan-800";
  };

  const handleVerDetalles = (incident: any) => {
    setSelectedIncident(incident);
    setShowModal(true);
  };

  const handleRowClick = (codigoOperacion: string) => {
    setSelectedRowId(codigoOperacion === selectedRowId ? null : codigoOperacion);
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#003d5c] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#00547a] md:text-base"
            >
              <span aria-hidden>🔍</span>
              <span>Buscar</span>
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSeveridadMin(undefined);
                setPage(1);
              }}
              className={`rounded-md px-3 py-1 text-sm ${severidadMin === undefined
                ? "bg-[#003d5c] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Todas
            </button>
            <button
              onClick={() => {
                setSeveridadMin(5);
                setPage(1);
              }}
              className={`rounded-md px-3 py-1 text-sm ${severidadMin === 5
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
            >
              Críticas
            </button>
            <button
              onClick={() => {
                setSeveridadMin(4);
                setPage(1);
              }}
              className={`rounded-md px-3 py-1 text-sm ${severidadMin === 4
                ? "bg-rose-600 text-white"
                : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                }`}
            >
              Altas
            </button>
            <button
              onClick={() => {
                setSeveridadMin(3);
                setPage(1);
              }}
              className={`rounded-md px-3 py-1 text-sm ${severidadMin === 3
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                }`}
            >
              Medias
            </button>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#003d5c] border-t-transparent"></div>
          </div>
        ) : (
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
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-gray-700">
                  {operaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No se encontraron operaciones con incidencias
                      </td>
                    </tr>
                  ) : (
                    operaciones.map((op) => {
                      const incidenciaMasReciente = op.incidencias[0];
                      return (
                        <tr
                          key={op.codigo_operacion}
                          className={`cursor-pointer transition-colors ${selectedRowId === op.codigo_operacion
                              ? "bg-blue-50 hover:bg-blue-100"
                              : "hover:bg-gray-50"
                            }`}
                          onClick={() => handleRowClick(op.codigo_operacion)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {op.codigo_operacion}
                          </td>
                          <td className="px-4 py-3 text-sm">{op.tipo_operacion}</td>
                          <td className="px-4 py-3 text-sm">{op.buque}</td>
                          <td className="px-4 py-3 text-sm">
                            {incidenciaMasReciente?.tipo_incidencia || "N/A"}
                            {op.incidencias.length > 1 && (
                              <span className="ml-2 text-xs text-gray-500">
                                (+{op.incidencias.length - 1} más)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getSeveridadClass(
                                incidenciaMasReciente?.grado_severidad || 1
                              )}`}
                            >
                              {getSeveridadLabel(incidenciaMasReciente?.grado_severidad || 1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {incidenciaMasReciente?.fecha_hora
                              ? new Date(incidenciaMasReciente.fecha_hora).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerDetalles(incidenciaMasReciente);
                              }}
                              className="text-sm font-medium text-orange-500 hover:underline"
                            >
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 md:flex-row">
              <span>
                Mostrando {operaciones.length} de {total} operaciones
              </span>
              <div className="inline-flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {"<"}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-sm font-semibold ${page === pageNum
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-300 bg-white hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {">"}
                </button>
              </div>
            </div>
          </section>
        )}

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
                <option>Inspección de Seguridad</option>
                <option>Inspección de Carga</option>
                <option>Inspección Ambiental</option>
                <option>Inspección Técnica</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Prioridad</label>
              <select className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500">
                <option>Seleccionar Prioridad</option>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
                <option>Crítica</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Fecha de Creación
              </label>
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Hora de Creación
              </label>
              <input
                type="time"
                defaultValue={new Date().toTimeString().slice(0, 5)}
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => window.location.href = '/operaciones-maritimas'}
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

        {/* Modal para mostrar detalles de incidencia */}
        {showModal && selectedIncident && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#003d5c]">
                  Detalles de Incidencia
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Código:
                    </label>
                    <p className="text-gray-900">{selectedIncident.codigo}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Grado de Severidad:
                    </label>
                    <p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getSeveridadClass(
                          selectedIncident.grado_severidad
                        )}`}
                      >
                        {getSeveridadLabel(selectedIncident.grado_severidad)}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Estado:
                    </label>
                    <p className="text-gray-900">{selectedIncident.estado}</p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700">
                      Fecha y Hora:
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedIncident.fecha_hora).toLocaleString()}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Usuario que Registró:
                    </label>
                    <p className="text-gray-900">{selectedIncident.usuario}</p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Descripción:
                    </label>
                    <p className="text-gray-900">{selectedIncident.descripcion}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="rounded-md bg-[#003d5c] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#00547a]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
