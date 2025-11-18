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

  // Función para obtener color según estado
  const getEstadoColor = (estado?: string) => {
    if (!estado) return "bg-gray-100 text-gray-700";
    
    const colors: Record<string, string> = {
      "Disponible": "bg-green-100 text-green-800",
      "En Tránsito": "bg-blue-100 text-blue-800",
      "En Almacén": "bg-yellow-100 text-yellow-800",
      "En Mantenimiento": "bg-red-100 text-red-800",
      "Asignado": "bg-purple-100 text-purple-800",
    };
    
    return colors[estado] || "bg-gray-100 text-gray-700";
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
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
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
              
              {estadisticas.porEstado.slice(0, 3).map((stat, index) => (
                <div key={index} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100">
                      <span className="material-symbols-outlined text-2xl text-zinc-600">category</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{stat.estado || 'Sin estado'}</p>
                      <p className="text-2xl font-bold text-zinc-900">{stat.cantidad}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="En Tránsito">En Tránsito</option>
                <option value="En Almacén">En Almacén</option>
                <option value="En Mantenimiento">En Mantenimiento</option>
                <option value="Asignado">Asignado</option>
              </select>

              {/* Filtro Tipo */}
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos los tipos</option>
                <option value="20' Standard">20' Standard</option>
                <option value="40' Standard">40' Standard</option>
                <option value="40' High Cube">40' High Cube</option>
                <option value="Refrigerado">Refrigerado</option>
              </select>

              {/* Limpiar filtros */}
              {(filtroEstado || filtroTipo || busqueda) && (
                <button
                  onClick={() => {
                    setFiltroEstado("");
                    setFiltroTipo("");
                    setBusqueda("");
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
                {contenedoresFiltrados.map((contenedor) => (
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
                        href={`/monitoreo/contenedores/${contenedor.id_contenedor}/sensores`}
                        className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
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
              <div className="mt-6 text-center text-sm text-zinc-500">
                Mostrando {contenedoresFiltrados.length} de {contenedores.length} contenedores
              </div>
            )}
          </div>
        </main>
    </div>
  );
}
