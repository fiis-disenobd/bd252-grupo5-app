"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface NotificacionDetalle {
  id_notificacion: string;
  codigo: string;
  fecha_hora: string;
  valor: number;
  tipo_notificacion?: {
    nombre: string;
  };
  sensor?: {
    id_sensor: string;
    codigo: string;
    nombre: string;
    tipo_sensor?: { nombre: string };
    contenedor?: { id_contenedor: string; codigo: string };
  };
}

export default function NotificacionDetallePage() {
  const params = useParams();
  const [notificacion, setNotificacion] = useState<NotificacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    fetch(`http://localhost:3001/monitoreo/sensores/notificaciones/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error al cargar notificación: ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        setNotificacion(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando notificación:", err);
        setError("No se pudo cargar la información de la notificación");
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-zinc-600">Cargando detalle de notificación...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !notificacion) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">notifications</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Notificación no encontrada</h2>
            <p className="mb-4 text-zinc-600">{error || "La notificación solicitada no existe"}</p>
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

  const contenedor = notificacion.sensor?.contenedor;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Link href="/monitoreo/contenedores" className="inline-flex items-center gap-1 hover:text-primary">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver a Contenedores
              </Link>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">Notificación {notificacion.codigo}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                {notificacion.tipo_notificacion?.nombre || "Notificación"} ·
                {" "}
                {new Date(notificacion.fecha_hora).toLocaleString("es-ES")}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-xs font-semibold text-orange-700">
              <span className="material-symbols-outlined text-sm">notifications</span>
              Alerta de sensor
            </span>
          </div>

          {/* Detalle */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Información de la notificación</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-zinc-500">Código</label>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">{notificacion.codigo}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Tipo de notificación</label>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {notificacion.tipo_notificacion?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Fecha y hora</label>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {new Date(notificacion.fecha_hora).toLocaleString("es-ES")}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Valor registrado</label>
                <p className="mt-1 text-sm font-semibold text-zinc-900">{notificacion.valor}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">Sensor</h3>
                {notificacion.sensor ? (
                  <div className="space-y-1 text-sm text-zinc-700">
                    <p>
                      <span className="font-medium">Código:</span>{" "}
                      {notificacion.sensor.codigo}
                    </p>
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {notificacion.sensor.nombre}
                    </p>
                    <p>
                      <span className="font-medium">Tipo:</span>{" "}
                      {notificacion.sensor.tipo_sensor?.nombre || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No se encontró información del sensor.</p>
                )}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">Contenedor</h3>
                {contenedor ? (
                  <div className="space-y-2 text-sm text-zinc-700">
                    <p>
                      <span className="font-medium">Código:</span>{" "}
                      {contenedor.codigo}
                    </p>
                    <Link
                      href={`/monitoreo/contenedores/${contenedor.id_contenedor}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                    >
                      <span className="material-symbols-outlined text-sm">local_shipping</span>
                      Ver detalle de contenedor
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">La notificación no está asociada a un contenedor.</p>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-orange-50 px-4 py-3 text-xs text-orange-800">
              Esta notificación fue generada automáticamente por el sensor cuando se detectó una condición fuera de los parámetros esperados.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
