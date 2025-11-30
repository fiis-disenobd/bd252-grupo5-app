"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import { SensorCard } from "@/components/monitoreo/SensorCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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
  documentacion?: {
    id_documentacion: string;
    codigo: string;
    nombre: string;
    fecha_emision: string;
    tipo_documento?: {
      nombre: string;
    };
  } | null;
}

interface NotificacionSensor {
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
    tipo_sensor?: {
      nombre: string;
    };
  };
}

export default function ContenedorDetallePage() {
  const params = useParams();
  const [contenedor, setContenedor] = useState<Contenedor | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [modalModo, setModalModo] = useState<"reporte" | "ver">("reporte");

  const [loadingNotificaciones, setLoadingNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState<NotificacionSensor[]>([]);
  const [errorNotificaciones, setErrorNotificaciones] = useState<string | null>(null);
  const [notificacionesSeleccionadas, setNotificacionesSeleccionadas] = useState<string[]>([]);
  const [comentarioReporte, setComentarioReporte] = useState("");
  const [enviandoReporte, setEnviandoReporte] = useState(false);
  const [mensajeReporte, setMensajeReporte] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/monitoreo/contenedores/${params.id}/detalle`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error al cargar contenedor: ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        setContenedor(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [params.id]);

  const cargarNotificaciones = () => {
    if (!contenedor) return;
    setLoadingNotificaciones(true);
    setErrorNotificaciones(null);

    fetch(
      `${API_URL}/monitoreo/sensores/notificaciones?contenedor=${contenedor.id_contenedor}&limite=100`
    )
      .then((res) => res.json())
      .then((data) => {
        setNotificaciones(data?.notificaciones || []);
        setNotificacionesSeleccionadas([]);
        setComentarioReporte("");
        setMensajeReporte(null);
        setLoadingNotificaciones(false);
      })
      .catch((err) => {
        console.error("Error cargando notificaciones:", err);
        setErrorNotificaciones("No se pudieron cargar las notificaciones");
        setLoadingNotificaciones(false);
      });
  };

  const toggleSeleccionNotificacion = (id: string) => {
    setNotificacionesSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const seleccionarTodas = () => {
    if (notificacionesSeleccionadas.length === notificaciones.length) {
      setNotificacionesSeleccionadas([]);
    } else {
      setNotificacionesSeleccionadas(notificaciones.map((n) => n.id_notificacion));
    }
  };

  const enviarReporte = async () => {
    if (!contenedor) return;
    setEnviandoReporte(true);
    setMensajeReporte(null);

    try {
      const resp = await fetch(
        `${API_URL}/monitoreo/reportes/contenedor/${contenedor.id_contenedor}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            notificacionesIds: notificacionesSeleccionadas,
            comentario: comentarioReporte || undefined,
          }),
        },
      );

      if (!resp.ok) {
        throw new Error("Error al generar el reporte");
      }

      const data = await resp.json();
      setMensajeReporte(`Reporte generado con código ${data.codigo}`);
      setEnviandoReporte(false);
    } catch (err) {
      console.error(err);
      setMensajeReporte("Ocurrió un error al generar el reporte");
      setEnviandoReporte(false);
    }
  };

  const getEstadoColor = (estado?: string) => {
    if (!estado) return "bg-gray-100 text-gray-700";

    const key = estado.toLowerCase();

    const colors: Record<string, string> = {
      // Disponible
      "disponible": "bg-emerald-50 text-emerald-700",
      // En Transito
      "en transito": "bg-blue-50 text-blue-700",
      // En Puerto
      "en puerto": "bg-indigo-50 text-indigo-700",
      // En Reparacion
      "en reparacion": "bg-amber-50 text-amber-700",
      // Fuera de Servicio
      "fuera de servicio": "bg-red-50 text-red-700",
    };

    return colors[key] || "bg-gray-100 text-gray-700";
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
                        className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 p-3"
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
                      className="flex h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 text-sm font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl"
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
                  <button
                    onClick={() => {
                      setModalModo("reporte");
                      setShowReporteModal(true);
                      cargarNotificaciones();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-lg">description</span>
                    Generar Reporte
                  </button>
                  <button
                    onClick={() => {
                      setModalModo("ver");
                      setShowReporteModal(true);
                      cargarNotificaciones();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    <span className="material-symbols-outlined text-lg">notifications</span>
                    Ver Notificaciones
                  </button>
                </div>
              </div>

              {/* Documentación asociada al contenedor */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-zinc-900">Documentación</h2>
                  <span className="text-xs text-zinc-500">
                    {contenedor.documentacion ? '1 documento' : '0 documentos'}
                  </span>
                </div>

                {contenedor.documentacion ? (
                  <div className="flex items-start gap-3 rounded-lg border border-zinc-200 p-3">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                      <span className="material-symbols-outlined text-lg text-blue-600">description</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">
                            {contenedor.documentacion.nombre}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {contenedor.documentacion.tipo_documento?.nombre || 'Documento'} ·
                            {' '}
                            Código {contenedor.documentacion.codigo}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-zinc-500">
                        Fecha de emisión:{' '}
                        {new Date(contenedor.documentacion.fecha_emision).toLocaleDateString('es-ES')}
                      </p>
                      <div className="mt-3">
                        <Link
                          href={`/monitoreo/documentacion/${contenedor.documentacion.id_documentacion}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                          Ver detalle de documentación
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    No hay documentación registrada para este contenedor.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {showReporteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  {modalModo === "reporte"
                    ? "Reporte de notificaciones de sensores"
                    : "Notificaciones de sensores"}
                </h3>
                <p className="text-xs text-zinc-500">
                  {modalModo === "reporte"
                    ? "Listado de notificaciones para generar un reporte analítico."
                    : "Listado de notificaciones generadas por los sensores de este contenedor."}
                </p>
              </div>
              <button
                onClick={() => setShowReporteModal(false)}
                className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="border-b border-zinc-200 px-6 py-3 text-xs text-zinc-500">
              {contenedor && (
                <span>
                  Contenedor <span className="font-mono font-semibold">{contenedor.codigo}</span> ·
                  Sensores instalados: {contenedor.sensores?.length || 0}
                </span>
              )}
            </div>

            <div className="px-6 py-4">
              <div className="flex gap-4">
                {/* Columna izquierda: listado de notificaciones */}
                <div className="flex-1 max-h-[60vh] overflow-y-auto pr-2">
                  {loadingNotificaciones ? (
                    <div className="flex items-center justify-center py-8 text-sm text-zinc-500">
                      Cargando notificaciones...
                    </div>
                  ) : errorNotificaciones ? (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorNotificaciones}
                    </div>
                  ) : notificaciones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <span className="material-symbols-outlined mb-2 text-4xl text-zinc-300">
                        notifications_off
                      </span>
                      <p className="text-sm text-zinc-500">
                        No se encontraron notificaciones para los sensores de este contenedor.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
                        <div>
                          <span>
                            Notificaciones encontradas: <span className="font-semibold">{notificaciones.length}</span>
                          </span>
                        </div>
                        {modalModo === "reporte" && (
                          <button
                            type="button"
                            onClick={seleccionarTodas}
                            className="text-xs font-medium text-primary hover:text-primary/80"
                          >
                            {notificacionesSeleccionadas.length === notificaciones.length
                              ? "Quitar selección"
                              : "Seleccionar todas"}
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {notificaciones.map((notif) => {
                          const checked = notificacionesSeleccionadas.includes(notif.id_notificacion);
                          return (
                            <div
                              key={notif.id_notificacion}
                              className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 p-3"
                            >
                              <div className="flex flex-1 gap-3">
                                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50">
                                  <span className="material-symbols-outlined text-base text-orange-600">
                                    notification_important
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-xs font-semibold text-zinc-900">
                                      {notif.codigo}
                                    </span>
                                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                                      {notif.tipo_notificacion?.nombre || "Sin tipo"}
                                    </span>
                                    {notif.sensor && (
                                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                                        Sensor {notif.sensor.codigo}
                                        {notif.sensor.tipo_sensor?.nombre
                                          ? ` · ${notif.sensor.tipo_sensor.nombre}`
                                          : ""}
                                      </span>
                                    )}
                                  </div>
                                  <p className="mt-1 text-sm text-zinc-700">
                                    Valor registrado: <span className="font-semibold">{notif.valor}</span>
                                  </p>
                                  <p className="mt-1 text-xs text-zinc-400">
                                    {new Date(notif.fecha_hora).toLocaleString("es-ES")}
                                  </p>
                                  <div className="mt-2">
                                    <Link
                                      href={`/monitoreo/notificaciones/${notif.id_notificacion}`}
                                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80"
                                    >
                                      <span className="material-symbols-outlined text-xs">open_in_new</span>
                                      Ver detalle de notificación
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {modalModo === "reporte" && (
                                <div className="mt-1 flex items-start">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggleSeleccionNotificacion(notif.id_notificacion)}
                                    className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary/40"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {modalModo === "reporte" && (
                  // Columna derecha: comentario y acciones solo en modo reporte
                  <div className="w-full max-w-xs border-l border-zinc-200 pl-4">
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-medium text-zinc-700">
                        Comentario del reporte (opcional)
                      </label>
                      <textarea
                        value={comentarioReporte}
                        onChange={(e) => setComentarioReporte(e.target.value)}
                        rows={6}
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="Resumen, observaciones, acciones tomadas..."
                      />
                    </div>

                    {mensajeReporte && (
                      <div className="mb-3 text-xs text-zinc-600">{mensajeReporte}</div>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={enviarReporte}
                        disabled={enviandoReporte || notificaciones.length === 0}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {enviandoReporte ? (
                          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-sm">description</span>
                        )}
                        Generar Reporte
                      </button>
                      <button
                        onClick={() => setShowReporteModal(false)}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}