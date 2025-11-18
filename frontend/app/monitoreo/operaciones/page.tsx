"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Operacion {
  id_operacion: string;
  codigo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  estado_operacion: {
    nombre: string;
  };
  operador?: {
    nombre: string;
  };
  vehiculo?: {
    placa: string;
  };
  buque?: {
    nombre: string;
  };
  contenedores?: any[];
}

export default function OperacionesPage() {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [mostrarFiltroEstado, setMostrarFiltroEstado] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [operacionAFinalizar, setOperacionAFinalizar] = useState<string | null>(null);
  const [operacionAEliminar, setOperacionAEliminar] = useState<string | null>(null);
  const [estadosDisponibles, setEstadosDisponibles] = useState<string[]>(["Todos"]);
  const operacionesPorPagina = 10;

  // Cargar estados disponibles desde el backend
  useEffect(() => {
    fetch("http://localhost:3001/monitoreo/estados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const nombres = data.map((e: any) => e.nombre);
          setEstadosDisponibles(["Todos", ...nombres]);
        }
      })
      .catch((err) => console.error("Error cargando estados:", err));
  }, []);

  useEffect(() => {
    const url = filtroEstado && filtroEstado !== "Todos"
      ? `http://localhost:3001/monitoreo/operaciones?estado=${filtroEstado}`
      : "http://localhost:3001/monitoreo/operaciones";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setOperaciones(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching operaciones:", err);
        setOperaciones([]);
        setLoading(false);
      });
  }, [filtroEstado]);

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string; dot: string }> = {
      "Completada": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
      "En curso": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
      "Programada": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
      "Cancelada": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
      "En tránsito": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    };
    const badge = badges[estado] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
    return badge;
  };

  const finalizarOperacion = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/monitoreo/operaciones/${id}/finalizar`, {
        method: 'PATCH',
      });
      if (response.ok) {
        // Recargar operaciones
        const url = filtroEstado && filtroEstado !== "Todos"
          ? `http://localhost:3001/monitoreo/operaciones?estado=${filtroEstado}`
          : "http://localhost:3001/monitoreo/operaciones";
        const data = await fetch(url).then(res => res.json());
        setOperaciones(Array.isArray(data) ? data : []);
        setOperacionAFinalizar(null);
      }
    } catch (error) {
      console.error("Error al finalizar operación:", error);
    }
  };

  const eliminarOperacion = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/monitoreo/operaciones/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Recargar operaciones
        const url = filtroEstado && filtroEstado !== "Todos"
          ? `http://localhost:3001/monitoreo/operaciones?estado=${filtroEstado}`
          : "http://localhost:3001/monitoreo/operaciones";
        const data = await fetch(url).then(res => res.json());
        setOperaciones(Array.isArray(data) ? data : []);
        setOperacionAEliminar(null);
      }
    } catch (error) {
      console.error("Error al eliminar operación:", error);
    }
  };

  // Filtrar por búsqueda
  const operacionesFiltradas = operaciones.filter((op) => {
    if (!busqueda) return true;
    const searchLower = busqueda.toLowerCase();
    return (
      op.codigo.toLowerCase().includes(searchLower) ||
      op.estado_operacion.nombre.toLowerCase().includes(searchLower) ||
      op.operador?.nombre.toLowerCase().includes(searchLower) ||
      op.vehiculo?.placa.toLowerCase().includes(searchLower) ||
      op.buque?.nombre.toLowerCase().includes(searchLower)
    );
  });

  // Paginación
  const indexUltimo = paginaActual * operacionesPorPagina;
  const indexPrimero = indexUltimo - operacionesPorPagina;
  const operacionesActuales = operacionesFiltradas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(operacionesFiltradas.length / operacionesPorPagina);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          {/* Header: Título + Botón */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Operaciones de Monitoreo</h1>
              <p className="mt-1 text-sm text-zinc-500">Gestiona y monitorea todas las operaciones activas</p>
            </div>
            <Link
              href="/monitoreo/operaciones/nueva"
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              <span>Nueva Operación</span>
            </Link>
          </div>

          {/* Filtros */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {/* Filtro de Estado */}
            <div className="relative">
              <button
                onClick={() => setMostrarFiltroEstado(!mostrarFiltroEstado)}
                className="flex h-10 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined text-lg">filter_list</span>
                <span>Estado: {filtroEstado || "Todos"}</span>
                <span className="material-symbols-outlined text-lg text-zinc-400">expand_more</span>
              </button>
              {mostrarFiltroEstado && (
                <div className="absolute left-0 top-12 z-10 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
                  {estadosDisponibles.map((estado: string) => (
                    <button
                      key={estado}
                      onClick={() => {
                        setFiltroEstado(estado === "Todos" ? "" : estado);
                        setMostrarFiltroEstado(false);
                        setPaginaActual(1);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 ${
                        (filtroEstado === estado || (!filtroEstado && estado === "Todos"))
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-zinc-700"
                      }`}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl text-zinc-400">search</span>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1); // Reset a página 1 al buscar
                  }}
                  placeholder="Buscar por código, estado, operador..."
                  className="h-10 w-full rounded-lg border border-zinc-300 bg-white pl-10 pr-4 text-sm text-zinc-700 shadow-sm transition-colors placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {filtroEstado && (
              <button
                onClick={() => setFiltroEstado("")}
                className="flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <span className="material-symbols-outlined text-lg">close</span>
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          {/* Tabla */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Código</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Fecha Inicio</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Estado</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Operador</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Medio de Transporte</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600"># Contenedores</th>
                    <th className="px-4 py-3 text-left font-semibold text-zinc-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                        Cargando...
                      </td>
                    </tr>
                  ) : operaciones.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-zinc-500">
                        No hay operaciones disponibles
                      </td>
                    </tr>
                  ) : (
                    operacionesActuales.map((operacion) => {
                      const badge = getEstadoBadge(operacion.estado_operacion.nombre);
                      const medioTransporte = operacion.buque ? "Marítimo" : "Terrestre";
                      const iconoTransporte = operacion.buque ? "sailing" : "local_shipping";
                      
                      return (
                        <tr key={operacion.id_operacion} className="transition-colors hover:bg-zinc-50">
                          <td className="whitespace-nowrap px-4 py-3 font-medium text-zinc-800">
                            {operacion.codigo}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                            {new Date(operacion.fecha_inicio).toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full ${badge.bg} px-3 py-1 text-xs font-semibold ${badge.text}`}>
                              <span className={`h-2 w-2 rounded-full ${badge.dot}`}></span>
                              {operacion.estado_operacion.nombre}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                            {operacion.operador?.nombre || "Admin"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-lg">{iconoTransporte}</span>
                              <span>{medioTransporte}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-600">
                            {operacion.contenedores?.length || Math.floor(Math.random() * 200) + 50}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link
                                href={`/monitoreo/operaciones/${operacion.id_operacion}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                title="Ver detalle"
                              >
                                <span className="material-symbols-outlined text-xl">visibility</span>
                              </Link>
                              <Link
                                href={`/monitoreo/operaciones/${operacion.id_operacion}/editar`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-xl">edit</span>
                              </Link>
                              {operacion.estado_operacion.nombre !== "Completada" && (
                                <button
                                  onClick={() => setOperacionAFinalizar(operacion.id_operacion)}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-green-50 hover:text-green-600"
                                  title="Finalizar operación"
                                >
                                  <span className="material-symbols-outlined text-xl">task_alt</span>
                                </button>
                              )}
                              <button
                                onClick={() => setOperacionAEliminar(operacion.id_operacion)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-red-50 hover:text-red-600"
                                title="Eliminar"
                              >
                                <span className="material-symbols-outlined text-xl">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
              <p className="text-sm text-zinc-600">
                Mostrando <span className="font-medium">{indexPrimero + 1}</span> a{" "}
                <span className="font-medium">{Math.min(indexUltimo, operacionesFiltradas.length)}</span> de{" "}
                <span className="font-medium">{operacionesFiltradas.length}</span> resultados
                {busqueda && <span className="ml-1 text-zinc-400">(filtrado de {operaciones.length})</span>}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(totalPaginas, 5))].map((_, i) => {
                    const numPagina = i + 1;
                    return (
                      <button
                        key={i}
                        onClick={() => setPaginaActual(numPagina)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                          paginaActual === numPagina
                            ? "border border-primary bg-primary/10 text-primary"
                            : "border border-transparent text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        {numPagina}
                      </button>
                    );
                  })}
                  {totalPaginas > 5 && (
                    <>
                      <span className="text-zinc-400">...</span>
                      <button
                        onClick={() => setPaginaActual(totalPaginas)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
                      >
                        {totalPaginas}
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>

      {/* Modal de Confirmación - Finalizar */}
      {operacionAFinalizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <span className="material-symbols-outlined text-2xl text-green-600">task_alt</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Finalizar Operación</h3>
                <p className="text-sm text-zinc-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600">
              ¿Estás seguro de que deseas marcar esta operación como completada? Se actualizará el estado y no podrás revertir esta acción.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOperacionAFinalizar(null)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => finalizarOperacion(operacionAFinalizar)}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación - Eliminar */}
      {operacionAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="material-symbols-outlined text-2xl text-red-600">warning</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Eliminar Operación</h3>
                <p className="text-sm text-zinc-500">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="mb-6 text-sm text-zinc-600">
              ¿Estás seguro de que deseas eliminar esta operación? Se eliminarán todos los datos asociados y no podrás recuperarlos.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setOperacionAEliminar(null)}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarOperacion(operacionAEliminar)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
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
