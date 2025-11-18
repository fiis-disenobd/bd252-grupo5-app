"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Operacion {
  id_operacion: string;
  codigo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  descripcion?: string;
  estado_operacion: {
    id_estado_operacion: string;
    nombre: string;
  };
  operador?: {
    id_operador: string;
    nombre: string;
  };
  vehiculo?: {
    id_vehiculo: string;
    placa: string;
  };
  buque?: {
    id_buque: string;
    nombre: string;
    matricula: string;
  };
  contenedores?: any[];
}

export default function DetalleOperacionPage() {
  const params = useParams();
  const router = useRouter();
  const [operacion, setOperacion] = useState<Operacion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:3001/monitoreo/operaciones/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Operación no encontrada");
          return res.json();
        })
        .then((data) => {
          setOperacion(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { bg: string; text: string; dot: string }> = {
      "Completada": { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
      "En curso": { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
      "Programada": { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500" },
      "Cancelada": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
      "En tránsito": { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    };
    return badges[estado] || { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-zinc-600">Cargando...</p>
            </div>
          </main>
      </div>
    );
  }

  if (!operacion) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
            <div className="text-center">
              <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">error</span>
              <h2 className="mb-2 text-xl font-bold text-zinc-900">Operación no encontrada</h2>
              <p className="mb-4 text-zinc-600">La operación que buscas no existe</p>
              <Link
                href="/monitoreo/operaciones"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver a Operaciones
              </Link>
            </div>
          </main>
      </div>
    );
  }

  const badge = getEstadoBadge(operacion.estado_operacion.nombre);
  const medioTransporte = operacion.buque ? "Marítimo" : "Terrestre";
  const iconoTransporte = operacion.buque ? "sailing" : "local_shipping";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <Link
                href="/monitoreo/operaciones"
                className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver a Operaciones
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900">Operación {operacion.codigo}</h1>
              <p className="mt-1 text-sm text-zinc-500">Detalles completos de la operación</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/monitoreo/operaciones/${operacion.id_operacion}/editar`}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Editar
              </Link>
              <button
                className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined text-lg">print</span>
                Imprimir
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información General */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Información General</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Código de Operación</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">{operacion.codigo}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Estado</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full ${badge.bg} px-3 py-1 text-xs font-semibold ${badge.text}`}>
                        <span className={`h-2 w-2 rounded-full ${badge.dot}`}></span>
                        {operacion.estado_operacion.nombre}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Fecha de Inicio</label>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {new Date(operacion.fecha_inicio).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Fecha de Fin</label>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {operacion.fecha_fin
                        ? new Date(operacion.fecha_fin).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "En curso"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-zinc-500">Medio de Transporte</label>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-zinc-600">{iconoTransporte}</span>
                      <span className="text-sm font-medium text-zinc-900">{medioTransporte}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de Transporte */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Detalles de Transporte</h2>
                {operacion.vehiculo && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                        <span className="material-symbols-outlined text-2xl text-primary">local_shipping</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Vehículo</p>
                        <p className="text-sm font-bold text-zinc-900">{operacion.vehiculo.placa}</p>
                      </div>
                    </div>
                  </div>
                )}
                {operacion.buque && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-zinc-50 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                        <span className="material-symbols-outlined text-2xl text-primary">sailing</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-zinc-500">Buque</p>
                        <p className="text-sm font-bold text-zinc-900">{operacion.buque.nombre}</p>
                        <p className="text-xs text-zinc-500">Matrícula: {operacion.buque.matricula}</p>
                      </div>
                    </div>
                  </div>
                )}
                {!operacion.vehiculo && !operacion.buque && (
                  <p className="text-sm text-zinc-500">No hay información de transporte disponible</p>
                )}
              </div>

              {/* Contenedores */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">
                  Contenedores ({operacion.contenedores?.length || 0})
                </h2>
                {operacion.contenedores && operacion.contenedores.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {operacion.contenedores.map((contenedor: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 rounded-lg border border-zinc-200 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{contenedor.codigo || `CNT-${index + 1}`}</p>
                          <p className="text-xs text-zinc-500">{contenedor.tipo || "Estándar"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No hay contenedores asignados</p>
                )}
              </div>
            </div>

            {/* Columna Lateral */}
            <div className="space-y-6">
              {/* Operador */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Operador Asignado</h3>
                {operacion.operador ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-xl text-primary">person</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{operacion.operador.nombre}</p>
                      <p className="text-xs text-zinc-500">Operador Principal</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500">No asignado</p>
                )}
              </div>

              {/* Acciones Rápidas */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Acciones Rápidas</h3>
                <div className="space-y-2">
                  <Link
                    href={`/monitoreo/mapa?operacion=${operacion.id_operacion}`}
                    className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    Ver en Mapa GPS
                  </Link>
                  <Link
                    href={`/monitoreo/incidencias?operacion=${operacion.id_operacion}`}
                    className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-lg">error</span>
                    Ver Incidencias
                  </Link>
                  <button className="flex w-full items-center gap-3 rounded-lg border border-zinc-200 p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50">
                    <span className="material-symbols-outlined text-lg">description</span>
                    Generar Reporte
                  </button>
                </div>
              </div>

              {/* Timeline (Opcional) */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-zinc-900">Historial</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <span className="material-symbols-outlined text-sm text-green-600">check</span>
                      </div>
                      <div className="h-full w-0.5 bg-zinc-200"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-xs font-semibold text-zinc-900">Operación Creada</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(operacion.fecha_inicio).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                      <span className="material-symbols-outlined text-sm text-blue-600">pending</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-900">En Progreso</p>
                      <p className="text-xs text-zinc-500">Estado actual</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
