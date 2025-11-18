"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import { SensorCard } from "@/components/monitoreo/SensorCard";

interface Contenedor {
  id_contenedor: string;
  codigo: string;
  peso: number;
  capacidad: number;
  dimensiones: string;
  estado_contenedor?: {
    nombre: string;
  };
  tipo_contenedor?: {
    nombre: string;
  };
  sensores?: any[];
  ultima_posicion?: {
    id_posicion: string;
    latitud: number;
    longitud: number;
    fecha_hora: string;
  };
  historial_posiciones?: any[];
}

export default function ContenedorDetallePage() {
  const params = useParams();
  const [contenedor, setContenedor] = useState<Contenedor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/monitoreo/contenedores/${params.id}/detalle`)
      .then((res) => res.json())
      .then((data) => {
        setContenedor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [params.id]);

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

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-zinc-600">Cargando detalles del contenedor...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!contenedor) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">error</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Contenedor no encontrado</h2>
            <p className="mb-4 text-zinc-600">El contenedor que buscas no existe</p>
            <Link
              href="/monitoreo/contenedores"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Contenedores
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/monitoreo/contenedores"
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Contenedores
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">{contenedor.codigo}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Detalles completos del contenedor y sus sensores
              </p>
            </div>
            <div className="flex gap-3">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${getEstadoColor(contenedor.estado_contenedor?.nombre)}`}>
                <span className="h-2 w-2 rounded-full bg-current"></span>
                {contenedor.estado_contenedor?.nombre || "Sin estado"}
              </span>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna Principal (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información General */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Información General</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Tipo de Contenedor</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {contenedor.tipo_contenedor?.nombre || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Peso</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {contenedor.peso ? `${contenedor.peso.toLocaleString()} kg` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Capacidad</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {contenedor.capacidad ? `${contenedor.capacidad.toLocaleString()} kg` : "N/A"}
                    </p>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs font-medium text-zinc-500">Dimensiones</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {contenedor.dimensiones || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sensores Asociados */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">
                    Sensores Asociados ({contenedor.sensores?.length || 0})
                  </h2>
                </div>
                
                {contenedor.sensores && contenedor.sensores.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {contenedor.sensores.map((sensor) => (
                      <SensorCard
                        key={sensor.id_sensor}
                        sensor={sensor}
                        contenedorId={params.id as string}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="material-symbols-outlined mb-2 text-4xl text-zinc-300">sensors_off</span>
                    <p className="text-sm text-zinc-500">No hay sensores asociados</p>
                  </div>
                )}
              </div>

              {/* Historial de Posiciones */}
              {contenedor.historial_posiciones && contenedor.historial_posiciones.length > 0 && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-zinc-900">
                    Historial de Movimientos
                  </h2>
                  <div className="space-y-3">
                    {contenedor.historial_posiciones.slice(0, 5).map((pos: any, index: number) => (
                      <div
                        key={pos.id_posicion}
                        className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                          <span className="material-symbols-outlined text-blue-600">location_on</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-900">
                            Lat: {Number(pos.latitud).toFixed(6)}, Lng: {Number(pos.longitud).toFixed(6)}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(pos.fecha_hora).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Última Posición GPS */}
              {contenedor.ultima_posicion && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-zinc-900">Última Posición GPS</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-500">Latitud</label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {Number(contenedor.ultima_posicion.latitud).toFixed(6)}°
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500">Longitud</label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {Number(contenedor.ultima_posicion.longitud).toFixed(6)}°
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-zinc-500">Última Actualización</label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {new Date(contenedor.ultima_posicion.fecha_hora).toLocaleString("es-ES")}
                      </p>
                    </div>
                    <Link
                      href="/monitoreo/mapa"
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      <span className="material-symbols-outlined text-lg">map</span>
                      Ver en Mapa GPS
                    </Link>
                  </div>
                </div>
              )}

              {/* Acciones Rápidas */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Acciones Rápidas</h2>
                <div className="space-y-2">
                  <button className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                    <span className="material-symbols-outlined text-lg">description</span>
                    Generar Reporte
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Exportar Datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}