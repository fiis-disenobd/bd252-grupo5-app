"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

interface IncidenciaDetalle {
  id_incidencia: string;
  codigo: string;
  descripcion: string;
  grado_severidad: number;
  fecha_hora: string;
  id_operacion: string;
  tipo_incidencia?: {
    nombre: string;
  };
  estado_incidencia?: {
    nombre: string;
  };
  operacion?: {
    id_operacion: string;
    codigo: string;
  };
}

export default function DetalleIncidenciaPage() {
  const params = useParams();
  const [incidencia, setIncidencia] = useState<IncidenciaDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    fetch(`${API_URL}/monitoreo/incidencias/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Incidencia no encontrada");
        return res.json();
      })
      .then((data) => {
        setIncidencia(data);
        setLoading(false);
      })
      .catch(() => {
        setIncidencia(null);
        setLoading(false);
      });
  }, [params.id]);

  const getSeveridadBadge = (sev: number) => {
    if (sev >= 4) return { bg: "bg-red-50", text: "text-red-700" };
    if (sev >= 3) return { bg: "bg-amber-50", text: "text-amber-700" };
    return { bg: "bg-blue-50", text: "text-blue-700" };
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-zinc-600">Cargando incidencia...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!incidencia) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">error</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Incidencia no encontrada</h2>
            <p className="mb-4 text-sm text-zinc-600">La incidencia que buscas no existe</p>
            <Link
              href="/monitoreo/incidencias"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Incidencias
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const severidadBadge = getSeveridadBadge(incidencia.grado_severidad);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <Link
                href="/monitoreo/incidencias"
                className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver a Incidencias
              </Link>
              <h1 className="text-3xl font-bold text-zinc-900">Incidencia {incidencia.codigo}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Detalle completo de la incidencia asociada a la operación
              </p>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Información General</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Código de Incidencia</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">
                      {incidencia.codigo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Tipo</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {incidencia.tipo_incidencia?.nombre || "Sin tipo"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Estado</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {incidencia.estado_incidencia?.nombre || "Sin estado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Fecha y Hora</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">
                      {new Date(incidencia.fecha_hora).toLocaleString("es-ES")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Severidad</p>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${severidadBadge.bg} ${severidadBadge.text}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        Nivel {incidencia.grado_severidad}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-500">Operación Relacionada</p>
                    {incidencia.operacion ? (
                      <Link
                        href={`/monitoreo/operaciones/${incidencia.operacion.id_operacion}`}
                        className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        <span className="material-symbols-outlined text-sm">local_shipping</span>
                        {incidencia.operacion.codigo}
                      </Link>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-500">Sin operación asociada</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-3 text-lg font-bold text-zinc-900">Descripción</h2>
                <p className="text-sm text-zinc-700 whitespace-pre-line">{incidencia.descripcion}</p>
              </div>
            </div>

            {/* Lateral */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="mb-3 text-sm font-bold text-zinc-900">Acciones Rápidas</h3>
                <div className="space-y-2">
                  {incidencia.operacion && (
                    <Link
                      href={`/monitoreo/operaciones/${incidencia.operacion.id_operacion}`}
                      className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 p-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                    >
                      <span className="material-symbols-outlined text-base">local_shipping</span>
                      Ver Operación
                    </Link>
                  )}
                  <Link
                    href="/monitoreo/incidencias"
                    className="flex w-full items-center gap-2 rounded-lg border border-zinc-200 p-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-base">list</span>
                    Volver a listado
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
