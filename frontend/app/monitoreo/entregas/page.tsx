"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Entrega {
  id_entrega: string;
  codigo: string;
  fecha_entrega: string;
  lugar_entrega: string;
  estado_entrega: {
    id_estado_entrega: string;
    nombre: string;
  };
  contenedor: {
    id_contenedor: string;
    codigo: string;
  };
  importador: {
    id_importador: string;
    razon_social: string;
  };
}

interface EstadoEntrega {
  id_estado_entrega: string;
  nombre: string;
}

interface EntregasResponse {
  entregas: Entrega[];
  total: number;
  pagina: number;
  total_paginas: number;
  por_pagina: number;
}

interface EstadisticasEntregas {
  total: number;
  este_mes: number;
  pendientes: number;
}

export default function EntregasPage() {
  const [data, setData] = useState<EntregasResponse | null>(null);
  const [estadisticas, setEstadisticas] = useState<EstadisticasEntregas | null>(null);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [estados, setEstados] = useState<EstadoEntrega[]>([]);
  const [filtros, setFiltros] = useState({
    estado: "",
    desde: "",
    hasta: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entregaAEliminar, setEntregaAEliminar] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [paginaActual, filtros]);

  useEffect(() => {
    // Cargar estadísticas
    fetch("http://localhost:3001/monitoreo/entregas/estadisticas")
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
      .catch((err) => console.error("Error cargando estadísticas:", err));

    // Cargar estados de entrega
    fetch("http://localhost:3001/monitoreo/entregas/estados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEstados(data);
        } else {
          console.error("Estados de entrega no es un array:", data);
          setEstados([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando estados de entrega:", err);
        setEstados([]);
      });
  }, []);

  const cargarDatos = () => {
    setLoading(true);
    const params = new URLSearchParams({
      pagina: paginaActual.toString(),
      limite: "10",
      ...(filtros.estado && { estado: filtros.estado }),
      ...(filtros.desde && { desde: filtros.desde }),
      ...(filtros.hasta && { hasta: filtros.hasta }),
    });

    fetch(`http://localhost:3001/monitoreo/entregas?${params}`)
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

  const handleEliminar = (id: string) => {
    setEntregaAEliminar(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = () => {
    if (!entregaAEliminar) return;

    fetch(`http://localhost:3001/monitoreo/entregas/${entregaAEliminar}`, {
      method: "DELETE",
    })
      .then(() => {
        setShowDeleteModal(false);
        setEntregaAEliminar(null);
        cargarDatos();
      })
      .catch((err) => {
        console.error("Error eliminando:", err);
        alert("Error al eliminar la entrega");
      });
  };

  const limpiarFiltros = () => {
    setFiltros({ estado: "", desde: "", hasta: "" });
    setPaginaActual(1);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Entregada":
        return "bg-green-100 text-green-700 border-green-200";
      case "En Transito":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "En Almacen":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelada":
        return "bg-red-100 text-red-700 border-red-200";
      case "Con Incidencia":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Gestión de Entregas</h1>
            <p className="text-sm text-zinc-500">Administra las entregas de contenedores a importadores</p>
          </div>
          <Link
            href="/monitoreo/entregas/nueva"
            className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nueva Entrega
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Total de Entregas</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{estadisticas?.total ?? 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-primary">local_shipping</span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Este Mes</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{estadisticas?.este_mes ?? 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-green-600">calendar_month</span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500">Pendientes</p>
                <p className="mt-2 text-3xl font-bold text-zinc-900">{estadisticas?.pendientes ?? 0}</p>
              </div>
              <span className="material-symbols-outlined text-4xl text-yellow-600">pending_actions</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900">Filtros</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Estado</label>
              <select
                value={filtros.estado}
                onChange={(e) => {
                  setFiltros({ ...filtros, estado: e.target.value });
                  setPaginaActual(1);
                }}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos</option>
                {estados.map((estado) => (
                  <option key={estado.id_estado_entrega} value={estado.id_estado_entrega}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
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
                className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-200"
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
          ) : data && data.entregas.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-zinc-200 bg-zinc-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Contenedor</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Importador</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Lugar</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-zinc-600">Estado</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-zinc-600">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {data.entregas.map((entrega: Entrega) => (
                      <tr key={entrega.id_entrega} className="transition-colors hover:bg-zinc-50">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-zinc-900">{entrega.codigo}</span>
                        </td>
                        <td className="px-6 py-4">
                          {entrega.contenedor ? (
                            <Link
                              href={`/monitoreo/contenedores/${entrega.contenedor.id_contenedor}`}
                              className="text-sm font-medium text-blue-600 hover:underline"
                            >
                              {entrega.contenedor.codigo}
                            </Link>
                          ) : (
                            <span className="text-sm text-zinc-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {entrega.importador ? (
                            <Link
                              href={`/monitoreo/importadores/${entrega.importador.id_importador}`}
                              className="line-clamp-1 text-sm font-medium text-blue-600 hover:underline"
                            >
                              {entrega.importador.razon_social}
                            </Link>
                          ) : (
                            <span className="line-clamp-1 text-sm text-zinc-500">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="line-clamp-1 text-sm text-zinc-600">{entrega.lugar_entrega}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-zinc-600">
                            {new Date(entrega.fecha_entrega).toLocaleDateString("es-ES")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getEstadoColor(
                              entrega.estado_entrega?.nombre
                            )}`}
                          >
                            {entrega.estado_entrega?.nombre || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/monitoreo/entregas/${entrega.id_entrega}`}
                              className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                              title="Ver"
                            >
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </Link>
                            <Link
                              href={`/monitoreo/entregas/${entrega.id_entrega}/editar`}
                              className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </Link>
                            <button
                              onClick={() => handleEliminar(entrega.id_entrega)}
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
                    {Math.min(data.pagina * data.por_pagina, data.total)} de {data.total} entregas
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
              <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">local_shipping</span>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">No hay entregas</h3>
              <p className="text-sm text-zinc-500">No se encontraron entregas con los filtros seleccionados</p>
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
              ¿Estás seguro de que deseas eliminar esta entrega? Esta acción no se puede deshacer.
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
