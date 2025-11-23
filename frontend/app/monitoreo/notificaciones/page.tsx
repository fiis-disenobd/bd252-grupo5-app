"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Notificacion {
  id_notificacion: string;
  fecha_hora: string;
  tipo_notificacion?: {
    id_tipo_notificacion: string;
    nombre: string;
  };
  sensor?: {
    id_sensor: string;
    tipo_sensor?: {
      nombre: string;
    };
    contenedor?: {
      id_contenedor: string;
      codigo: string;
    };
  };
}

interface NotificacionesResponse {
  notificaciones: Notificacion[];
  total: number;
  pagina: number;
  total_paginas: number;
  por_pagina: number;
}

interface Estadisticas {
  total: number;
  por_tipo: Array<{ tipo: string; cantidad: string }>;
  ultima_semana: number;
}

export default function NotificacionesPage() {
  const [data, setData] = useState<NotificacionesResponse | null>(null);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [contenedorFiltro, setContenedorFiltro] = useState("");
  const [sensorFiltro, setSensorFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const limite = 20;

  useEffect(() => {
    cargarNotificaciones();
    cargarEstadisticas();

    // Refresco automático cada 60 segundos respetando filtros y página actual
    const interval = setInterval(() => {
      cargarNotificaciones();
    }, 60000);

    return () => clearInterval(interval);
  }, [paginaActual, tipoFiltro, contenedorFiltro, sensorFiltro, fechaDesde, fechaHasta]);

  const cargarNotificaciones = () => {
    setLoading(true);

    const params = new URLSearchParams({
      pagina: paginaActual.toString(),
      limite: limite.toString(),
    });

    if (tipoFiltro) params.append("tipo", tipoFiltro);
    if (contenedorFiltro) params.append("contenedor", contenedorFiltro);
    if (sensorFiltro) params.append("sensor", sensorFiltro);
    if (fechaDesde) params.append("fecha_desde", fechaDesde);
    if (fechaHasta) params.append("fecha_hasta", fechaHasta);

    fetch(`http://localhost:3001/monitoreo/sensores/notificaciones?${params}`)
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

  const cargarEstadisticas = () => {
    fetch(`http://localhost:3001/monitoreo/sensores/notificaciones/estadisticas`)
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
      .catch((err) => console.error("Error:", err));
  };

  const limpiarFiltros = () => {
    setTipoFiltro("");
    setContenedorFiltro("");
    setSensorFiltro("");
    setFechaDesde("");
    setFechaHasta("");
    setPaginaActual(1);
  };

  const getSeveridadColor = (tipo?: string) => {
    const nombre = tipo?.toLowerCase() || "";

    if (nombre.includes("crítica") || nombre.includes("peligro") || nombre.includes("critica")) {
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        icon: "bg-red-100 text-red-600",
        badge: "bg-red-100 text-red-700",
      };
    }

    if (nombre.includes("advertencia") || nombre.includes("warning") || nombre.includes("alerta")) {
      return {
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-700",
        icon: "bg-yellow-100 text-yellow-600",
        badge: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "bg-blue-100 text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    };
  };

  const getIconoNotificacion = (tipo?: string) => {
    const nombre = tipo?.toLowerCase() || "";

    if (nombre.includes("temperatura")) return "device_thermostat";
    if (nombre.includes("humedad")) return "water_drop";
    if (nombre.includes("puerta")) return "door_open";
    if (nombre.includes("vibración") || nombre.includes("impacto")) return "vibration";
    if (nombre.includes("batería") || nombre.includes("bateria")) return "battery_alert";
    if (nombre.includes("ruta")) return "wrong_location";

    return "notifications";
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900">Notificaciones</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Centro de alertas y notificaciones del sistema
            </p>
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-primary">notifications</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Total Notificaciones</p>
                    <p className="text-2xl font-bold text-zinc-900">{estadisticas.total}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <span className="material-symbols-outlined text-green-600">schedule</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Última Semana</p>
                    <p className="text-2xl font-bold text-zinc-900">{estadisticas.ultima_semana}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <span className="material-symbols-outlined text-blue-600">category</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Tipos Activos</p>
                    <p className="text-2xl font-bold text-zinc-900">
                      {estadisticas.por_tipo.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Filtros</h2>
              <button
                onClick={limpiarFiltros}
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Limpiar Filtros
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Tipo de Notificación
                </label>
                <select
                  value={tipoFiltro}
                  onChange={(e) => {
                    setTipoFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Todos los tipos</option>
                  {estadisticas?.por_tipo.map((tipo) => (
                    <option key={tipo.tipo} value={tipo.tipo}>
                      {tipo.tipo} ({tipo.cantidad})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Contenedor (código)
                </label>
                <input
                  type="text"
                  value={contenedorFiltro}
                  onChange={(e) => {
                    setContenedorFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  placeholder="Ej: CNT-001"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Sensor (código/id)
                </label>
                <input
                  type="text"
                  value={sensorFiltro}
                  onChange={(e) => {
                    setSensorFiltro(e.target.value);
                    setPaginaActual(1);
                  }}
                  placeholder="Ej: SENS-001"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => {
                    setFechaHasta(e.target.value);
                    setPaginaActual(1);
                  }}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="mt-2 flex items-end justify-start md:justify-end md:col-span-5">
                <button
                  onClick={cargarNotificaciones}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-lg">search</span>
                  Buscar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-6">
              <h2 className="text-lg font-bold text-zinc-900">
                Notificaciones ({data?.total || 0})
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : data && data.notificaciones.length > 0 ? (
              <>
                <div className="divide-y divide-zinc-200">
                  {data.notificaciones.map((notif) => {
                    const colors = getSeveridadColor(notif.tipo_notificacion?.nombre);
                    const icono = getIconoNotificacion(notif.tipo_notificacion?.nombre);

                    return (
                      <div
                        key={notif.id_notificacion}
                        className={`p-6 transition-colors hover:bg-zinc-50 ${colors.bg}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${colors.icon}`}>
                            <span className="material-symbols-outlined">{icono}</span>
                          </div>

                          <div className="flex-1">
                            <div className="mb-2 flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-zinc-900">
                                  {notif.tipo_notificacion?.nombre || "Notificación"}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-600">
                                  Sensor: {notif.sensor?.tipo_sensor?.nombre || "Desconocido"}
                                </p>
                              </div>
                              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${colors.badge} ${colors.border}`}>
                                {notif.tipo_notificacion?.nombre}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-zinc-500">
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">inventory_2</span>
                                <span>
                                  {notif.sensor?.contenedor?.codigo || "Sin contenedor"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-base">schedule</span>
                                <span>
                                  {new Date(notif.fecha_hora).toLocaleString("es-ES")}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-3 text-xs">
                              {notif.sensor?.contenedor && (
                                <Link
                                  href={`/monitoreo/contenedores/${notif.sensor.contenedor.id_contenedor}`}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                                >
                                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                                  Ver contenedor
                                </Link>
                              )}
                              <Link
                                href={`/monitoreo/notificaciones/${notif.id_notificacion}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                              >
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                                Ver detalle de notificación
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginación */}
                {data.total_paginas > 1 && (
                  <div className="flex items-center justify-between border-t border-zinc-200 p-6">
                    <p className="text-sm text-zinc-600">
                      Mostrando {((data.pagina - 1) * data.por_pagina) + 1} -{" "}
                      {Math.min(data.pagina * data.por_pagina, data.total)} de {data.total}{" "}
                      notificaciones
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaginaActual(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className="flex items-center gap-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-base">chevron_left</span>
                        Anterior
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: data.total_paginas }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === data.total_paginas ||
                              Math.abs(page - paginaActual) <= 1
                            );
                          })
                          .map((page, idx, arr) => {
                            if (idx > 0 && page - arr[idx - 1] > 1) {
                              return (
                                <span key={`ellipsis-${page}`} className="px-2 text-zinc-400">
                                  ...
                                </span>
                              );
                            }
                            return (
                              <button
                                key={page}
                                onClick={() => setPaginaActual(page)}
                                className={`h-10 w-10 rounded-lg border border-zinc-300 bg-orange-500 px-4 py-2 text-sm font-medium transition-colors ${
                                  page === paginaActual
                                    ? "border-primary bg-primary text-white"
                                    : "border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
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
                <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">
                  notifications_off
                </span>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                  No hay notificaciones
                </h3>
                <p className="text-sm text-zinc-500">
                  No se encontraron notificaciones con los filtros seleccionados
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}