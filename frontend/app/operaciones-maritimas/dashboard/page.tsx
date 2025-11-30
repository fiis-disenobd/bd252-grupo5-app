"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { conciliacionAPI, type DashboardMetricas, type OperacionMaritima } from "@/lib/api/conciliacion";

export default function DashboardOperacionesMaritimas() {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null);
  const [operaciones, setOperaciones] = useState<OperacionMaritima[]>([]);
  const [loading, setLoading] = useState(true);
  const [ejecutandoBatch, setEjecutandoBatch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [metricasData, operacionesData] = await Promise.all([
        conciliacionAPI.getMetricas(),
        conciliacionAPI.getOperaciones(),
      ]);
      setMetricas(metricasData);
      setOperaciones(operacionesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      alert("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteConciliation = async () => {
    const ok = window.confirm(
      "¿Desea ejecutar el proceso de conciliación nocturna manualmente? Esto puede tomar varios minutos.",
    );
    if (!ok) return;

    try {
      setEjecutandoBatch(true);
      await conciliacionAPI.ejecutarBatch();
      alert("Proceso de conciliación ejecutado correctamente");
      await cargarDatos(); // Recargar datos
    } catch (error) {
      console.error("Error al ejecutar conciliación:", error);
      alert("Error al ejecutar el proceso de conciliación");
    } finally {
      setEjecutandoBatch(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f5f7fa] text-gray-900">
        <Header />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e54c2a] border-t-transparent" />
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </main>
      </div>
    );
  }

  const kpis = metricas?.kpis || {
    total_operaciones: 0,
    operaciones_activas: 0,
    operaciones_finalizadas: 0,
    total_incidencias: 0,
    incidencias_criticas: 0,
    correcciones_recientes: 0,
    intervencion_manual: 0,
  };

  // Paginación
  const totalPages = Math.ceil(operaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOperaciones = operaciones.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa] text-gray-900">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            <span className="text-[#e54c2a]">Dashboard</span> Operaciones Marítimas
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Monitoreo y conciliación automática de operaciones
          </p>
        </header>

        {/* Métricas KPI */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border-l-4 border-[#e54c2a] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Operaciones (30d)</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {kpis.total_operaciones}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {kpis.operaciones_activas} activas
            </p>
          </article>

          <article className="rounded-lg border-l-4 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Correcciones Aplicadas (7d)
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {kpis.correcciones_recientes}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Última ejecución batch
            </p>
          </article>

          <article className="rounded-lg border-l-4 border-amber-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Requieren Atención</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {kpis.intervencion_manual}
            </p>
            <p className="mt-1 text-xs text-gray-600">Intervención manual</p>
          </article>

          <article className="rounded-lg border-l-4 border-red-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Incidencias Críticas</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {kpis.incidencias_criticas}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              de {kpis.total_incidencias} totales
            </p>
          </article>
        </section>

        {/* Controles */}
        <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExecuteConciliation}
              disabled={ejecutandoBatch}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{ejecutandoBatch ? "⏳" : "🔄"}</span>
              <span>
                {ejecutandoBatch ? "Ejecutando..." : "Ejecutar Conciliación"}
              </span>
            </button>
            <Link
              href="/operaciones-maritimas/nueva"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e54c2a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#c94122]"
            >
              <span>➕</span>
              <span>Nueva Operación</span>
            </Link>
            <Link
              href="/operaciones-maritimas/hallazgos"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span>📋</span>
              <span>Hallazgos</span>
            </Link>
          </div>
        </section>

        {/* Tabla de Operaciones Marítimas */}
        <section className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Operaciones Marítimas (Últimos 30 días)
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {operaciones.length} operaciones encontradas
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Buque</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Progreso</th>
                  <th className="px-4 py-3 text-left">Incidencias</th>
                  <th className="px-4 py-3 text-left">Fecha Inicio</th>
                  <th className="px-4 py-3 text-left">Corrección</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedOperaciones.map((op) => (
                  <tr key={op.id_operacion} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {op.codigo_operacion}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      <div>{op.buque}</div>
                      <div className="text-xs text-gray-500">{op.matricula}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800">
                        {op.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-sky-500"
                            style={{ width: `${op.porcentaje_trayecto}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {op.porcentaje_trayecto.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-gray-700">{op.total_incidencias}</div>
                      {op.incidencias_criticas > 0 && (
                        <div className="text-xs text-red-600">
                          {op.incidencias_criticas} críticas
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(op.fecha_inicio).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      {op.fue_corregida ? (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
                            <span>✓</span>
                            <span>Corregida</span>
                          </span>
                          {op.tipo_correccion && (
                            <span className="text-xs text-gray-500" title={op.descripcion_correccion || ''}>
                              {op.tipo_correccion.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedOperaciones.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No se encontraron operaciones en los últimos 30 días
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {operaciones.length > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-600 sm:flex-row">
              <span>
                Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, operaciones.length)} de {operaciones.length} operaciones
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex h-8 w-8 items-center justify-center rounded border text-sm ${pageNum === currentPage
                        ? "border-[#e54c2a] bg-[#e54c2a] font-semibold text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')} |
          Próxima conciliación automática: Hoy 02:00 AM
        </p>
      </main>
    </div>
  );
}
