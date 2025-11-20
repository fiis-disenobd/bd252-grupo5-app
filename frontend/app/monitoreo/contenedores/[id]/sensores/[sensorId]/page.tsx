"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Sensor {
  id_sensor: string;
  tipo_sensor?: {
    nombre: string;
  };
  rol_sensor?: {
    nombre: string;
  };
  contenedor?: {
    codigo: string;
    estado_contenedor?: {
      nombre: string;
    };
  };
  notificaciones?: any[];
  lecturas?: {
    fecha_hora: string;
    valor: number;
    unidad: string;
    estado: string;
  }[];
  ultima_lectura?: {
    fecha_hora: string;
    valor: number;
    unidad: string;
    estado: string;
  };
}

export default function SensorDetallePage() {
  const params = useParams();
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/monitoreo/sensores/${params.sensorId}/detalle`)
      .then((res) => res.json())
      .then((data) => {
        setSensor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [params.sensorId]);

  const getEstadoColor = (estado?: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      normal: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
      warning: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
      alert: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    };
    return colors[estado || "normal"] || colors.normal;
  };

  const getSeveridadColor = (tipo?: string) => {
    const nombre = tipo?.toLowerCase() || "";
    if (nombre.includes("crítica") || nombre.includes("peligro")) {
      return "bg-red-100 text-red-700 border-red-200";
    }
    if (nombre.includes("advertencia") || nombre.includes("warning")) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-zinc-600">Cargando detalles del sensor...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">error</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Sensor no encontrado</h2>
            <p className="mb-4 text-zinc-600">El sensor que buscas no existe</p>
            <Link
              href={`/monitoreo/contenedores/${params.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver al Contenedor
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const estadoActual = getEstadoColor(sensor.ultima_lectura?.estado);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href={`/monitoreo/contenedores/${params.id}`}
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a {sensor.contenedor?.codigo || "Contenedor"}
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">
                Sensor {sensor.tipo_sensor?.nombre || "Desconocido"}
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                Contenedor: {sensor.contenedor?.codigo || "N/A"} • Rol: {sensor.rol_sensor?.nombre || "Sin rol"}
              </p>
            </div>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna Principal (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información del Sensor */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Información del Sensor</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Tipo de Sensor</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {sensor.tipo_sensor?.nombre || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Rol del Sensor</label>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {sensor.rol_sensor?.nombre || "Sin rol"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Estado Actual</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${estadoActual.bg} ${estadoActual.text} ${estadoActual.border}`}>
                        <span className={`h-2 w-2 rounded-full ${estadoActual.text.replace('text-', 'bg-')}`}></span>
                        {sensor.ultima_lectura?.estado || "normal"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráfico de Lecturas */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">
                  Historial de Lecturas (Últimas 50)
                </h2>
                {sensor.lecturas && sensor.lecturas.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sensor.lecturas}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="fecha_hora"
                        tickFormatter={(value) => new Date(value).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis style={{ fontSize: "12px" }} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleString("es-ES")}
                        formatter={(value: number) => [`${value} ${sensor.ultima_lectura?.unidad || ""}`, "Valor"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="valor"
                        stroke="#ff8c00"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <p className="text-sm text-zinc-500">No hay lecturas disponibles</p>
                  </div>
                )}
              </div>

              {/* Notificaciones Recientes */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">
                  Notificaciones Recientes ({sensor.notificaciones?.length || 0})
                </h2>
                {sensor.notificaciones && sensor.notificaciones.length > 0 ? (
                  <div className="space-y-3">
                    {sensor.notificaciones.slice(0, 10).map((notif: any) => (
                      <div
                        key={notif.id_notificacion}
                        className={`rounded-lg border p-3 ${getSeveridadColor(notif.tipo_notificacion?.nombre)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">
                              {notif.tipo_notificacion?.nombre || "Notificación"}
                            </p>
                            <p className="mt-1 text-xs opacity-75">
                              {new Date(notif.fecha_hora).toLocaleString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <span className="material-symbols-outlined mb-2 text-4xl text-zinc-300">notifications_off</span>
                    <p className="text-sm text-zinc-500">No hay notificaciones</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar (1/3) */}
            <div className="space-y-6">
              {/* Última Lectura */}
              {sensor.ultima_lectura && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-zinc-900">Última Lectura</h2>
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">
                      {sensor.ultima_lectura.valor}
                    </p>
                    <p className="mt-2 text-2xl font-medium text-zinc-600">
                      {sensor.ultima_lectura.unidad}
                    </p>
                    <p className="mt-4 text-sm text-zinc-500">
                      {new Date(sensor.ultima_lectura.fecha_hora).toLocaleString("es-ES")}
                    </p>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-zinc-900">Acciones</h2>
                <div className="space-y-2">
                  <Link
                    href={`/monitoreo/contenedores/${params.id}/sensores/${params.sensorId}/analiticas`}
              className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                  >
                    <span className="material-symbols-outlined text-lg">analytics</span>
                    Ver Analíticas Avanzadas
                  </Link>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                    <span className="material-symbols-outlined text-lg">settings</span>
                    Configurar Umbrales
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Descargar Historial
                  </button>
                </div>
              </div>

              {/* Info del Contenedor */}
              {sensor.contenedor && (
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-lg font-bold text-zinc-900">Contenedor Asociado</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-zinc-500">Código</label>
                      <p className="mt-1 text-sm font-semibold text-zinc-900">
                        {sensor.contenedor.codigo}
                      </p>
                    </div>
                    {sensor.contenedor.estado_contenedor && (
                      <div>
                        <label className="text-xs font-medium text-zinc-500">Estado</label>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">
                          {sensor.contenedor.estado_contenedor.nombre}
                        </p>
                      </div>
                    )}
                    <Link
                      href={`/monitoreo/contenedores/${params.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary bg-white px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                    >
                      <span className="material-symbols-outlined text-lg">inventory_2</span>
                      Ver Contenedor
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
