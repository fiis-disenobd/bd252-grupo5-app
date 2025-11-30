"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

interface Reporte {
  id_reporte: string;
  codigo: string;
  fecha_reporte: string;
  detalle: string;
}

export default function ReportesPage() {
  const [data, setData] = useState<any>({ reportes: [], total: 0 });
  const [estadisticas, setEstadisticas] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtros, setFiltros] = useState({
    desde: "",
    hasta: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reporteAEliminar, setReporteAEliminar] = useState<string | null>(null);
  const [fechaCorteBatch, setFechaCorteBatch] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [paginaActual, filtros]);

  useEffect(() => {
    // Cargar estadísticas
    fetch(`${API_URL}/monitoreo/reportes/estadisticas`)
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));
  }, []);

  const cargarDatos = () => {
    setLoading(true);
    const params = new URLSearchParams({
      pagina: paginaActual.toString(),
      limite: "10",
      ...(filtros.desde && { desde: filtros.desde }),
      ...(filtros.hasta && { hasta: filtros.hasta }),
    });

    fetch(`${API_URL}/monitoreo/reportes?${params}`)
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

  const ejecutarCierreDiario = async () => {
    try {
      setBatchLoading(true);
      setBatchMessage(null);

      const res = await fetch(
        `${API_URL}/monitoreo/reportes/cierre-diario`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fecha_corte: fechaCorteBatch }),
        },
      );

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data = await res.json();
      setBatchMessage(
        `Batch ejecutado para la fecha ${data.fecha_corte}.`,
      );

      // Recargar la lista de reportes
      cargarDatos();
    } catch (error) {
      console.error("Error ejecutando cierre diario:", error);
      setBatchMessage("Ocurrió un error al ejecutar el proceso batch.");
    } finally {
      setBatchLoading(false);
    }
  };

  const ejecutarCierreRango120 = async () => {
    try {
      setBatchLoading(true);
      setBatchMessage(null);

      const res = await fetch(
        `${API_URL}/monitoreo/reportes/cierre-rango-120`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fecha_fin: fechaCorteBatch }),
        },
      );

      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}`);
      }

      const data = await res.json();
      setBatchMessage(
        `Batch ejecutado para el rango ${data.fecha_inicio} a ${data.fecha_fin}.`,
      );

      // Recargar la lista de reportes
      cargarDatos();
    } catch (error) {
      console.error("Error ejecutando cierre de rango 120 días:", error);
      setBatchMessage(
        "Ocurrió un error al ejecutar el proceso batch de 120 días.",
      );
    } finally {
      setBatchLoading(false);
    }
  };

  const handleEliminar = (id: string) => {
    setReporteAEliminar(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    if (!reporteAEliminar) return;

    fetch(`${API_URL}/monitoreo/reportes/${reporteAEliminar}`, {
      method: "DELETE",
    })
      .then(() => {
        setShowDeleteModal(false);
        setReporteAEliminar(null);
        cargarDatos();
      })
      .catch((err) => {
        console.error("Error eliminando:", err);
        alert("Error al eliminar el reporte");
      });
  };

  const limpiarFiltros = () => {
    setFiltros({ desde: "", hasta: "" });
    setPaginaActual(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Gestión de Reportes</h1>
            <p className="text-sm text-zinc-500">Crea, visualiza y administra reportes del sistema</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/monitoreo/reportes/analytics"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <span className="material-symbols-outlined text-lg">insights</span>
              Analítica
            </Link>
            <Link
              href="/monitoreo/reportes/nuevo"
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nuevo Reporte
            </Link>
          </div>
        </div>

        {/* Proceso Batch Analítico */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900">
                Proceso batch de cierre diario
              </h3>
              <p className="text-sm text-zinc-500">
                Ejecuta el proceso analítico que consolida operaciones completadas
                en el esquema monitoreo_analytics para la fecha seleccionada.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700">
                  Fecha de corte
                </label>
                <input
                  type="date"
                  value={fechaCorteBatch}
                  onChange={(e) => setFechaCorteBatch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={ejecutarCierreDiario}
                  disabled={batchLoading || !fechaCorteBatch}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {batchLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">sync</span>
                  )}
                  <span>
                    {batchLoading
                      ? "Ejecutando batch..."
                      : "Ejecutar cierre diario"}
                  </span>
                </button>
                <button
                  onClick={ejecutarCierreRango120}
                  disabled={batchLoading || !fechaCorteBatch}
                  className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {batchLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <span className="material-symbols-outlined text-lg">query_stats</span>
                  )}
                  <span>
                    {batchLoading
                      ? "Ejecutando rango 120 días..."
                      : "Cierre últimos 120 días"}
                  </span>
                </button>
              </div>
            </div>
          </div>
          {batchMessage && (
            <p className="mt-3 text-sm text-zinc-600">{batchMessage}</p>
          )}
        </div>

        {/* Estadísticas */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Total de Reportes</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{estadisticas.total || 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-primary">description</span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Este Mes</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{estadisticas.este_mes || 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-green-600">calendar_month</span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Último Reporte</p>
                <p className="mt-2 text-lg font-bold text-zinc-900">
                  {estadisticas.ultimo_reporte?.codigo || "N/A"}
                </p>
              </div>
              <span className="material-symbols-outlined text-4xl text-blue-600">history</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900">Filtros</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Desde</label>
              <input
                type="date"
                value={filtros.desde}
                onChange={(e) => setFiltros({ ...filtros, desde: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Hasta</label>
              <input
                type="date"
                value={filtros.hasta}
                onChange={(e) => setFiltros({ ...filtros, hasta: e.target.value })}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={limpiarFiltros}
                className="w-full rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-200"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : data.reportes.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-200 bg-zinc-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Detalle</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-zinc-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {data.reportes.map((reporte: Reporte) => (
                      <tr key={reporte.id_reporte} className="transition-colors hover:bg-zinc-50">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-zinc-900">{reporte.codigo}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-600">
                            {new Date(reporte.fecha_reporte).toLocaleDateString("es-ES")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="line-clamp-2 text-sm text-zinc-600">{reporte.detalle}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/monitoreo/reportes/${reporte.id_reporte}`}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                              title="Ver"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </Link>
                            <Link
                              href={`/monitoreo/reportes/${reporte.id_reporte}/editar`}
                              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Link>
                            <button
                              onClick={() => handleEliminar(reporte.id_reporte)}
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
                    {Math.min(data.pagina * data.por_pagina, data.total)} de {data.total} reportes
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
              <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">description</span>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">No hay reportes</h3>
              <p className="text-sm text-zinc-500">No se encontraron reportes con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal Eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-zinc-900">Confirmar Eliminación</h3>
            <p className="mb-6 text-sm text-zinc-600">
              ¿Estás seguro de que deseas eliminar este reporte? Esta acción no se puede deshacer.
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
