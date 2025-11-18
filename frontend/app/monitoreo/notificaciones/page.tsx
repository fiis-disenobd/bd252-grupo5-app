"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/monitoreo/Sidebar";
import { TopBar } from "@/components/monitoreo/TopBar";

interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  contenedor: string;
  severidad: 'critica' | 'alerta' | 'advertencia' | 'info';
  icon: string;
  fecha: string;
  seleccionada: boolean;
}

export default function NotificacionesPage() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const notificacionesPorPagina = 4;

  useEffect(() => {
    // Datos de ejemplo (reemplazar con fetch real)
    const mockNotificaciones: Notificacion[] = [
      {
        id: '1',
        titulo: 'Temperatura Excedida',
        descripcion: 'Valor: 35°C (Límite: 20°C) - Hace 5 minutos',
        contenedor: 'MAERSK-45G1-XYZ',
        severidad: 'critica',
        icon: 'local_fire_department',
        fecha: 'Hace 5 minutos',
        seleccionada: false
      },
      {
        id: '2',
        titulo: 'Desvío de Ruta Detectado',
        descripcion: 'El contenedor se ha desviado 5km de la ruta planificada - Hace 2 horas',
        contenedor: 'MSC-22B1-ABC',
        severidad: 'alerta',
        icon: 'fmd_bad',
        fecha: 'Hace 2 horas',
        seleccionada: false
      },
      {
        id: '3',
        titulo: 'Batería Baja en Dispositivo IoT',
        descripcion: 'Nivel de batería: 15% - Hace 8 horas',
        contenedor: 'HAPAG-88C3-DEF',
        severidad: 'advertencia',
        icon: 'battery_horiz_075',
        fecha: 'Hace 8 horas',
        seleccionada: false
      },
      {
        id: '4',
        titulo: 'Apertura de Puerta Registrada',
        descripcion: 'Apertura autorizada en almacén - Ayer, 18:30',
        contenedor: 'COSCO-12A4-GHI',
        severidad: 'info',
        icon: 'door_open',
        fecha: 'Ayer, 18:30',
        seleccionada: false
      }
    ];
    
    setNotificaciones(mockNotificaciones);
    setLoading(false);
  }, []);

  const getSeveridadConfig = (severidad: string) => {
    const configs = {
      critica: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        border: 'border-red-500/50',
        label: 'Crítica',
        iconBg: 'bg-red-100',
        iconText: 'text-red-600'
      },
      alerta: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
        border: 'border-slate-200',
        label: 'Alerta',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600'
      },
      advertencia: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-slate-200',
        label: 'Advertencia',
        iconBg: 'bg-yellow-100',
        iconText: 'text-yellow-600'
      },
      info: {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        label: 'Info',
        iconBg: 'bg-slate-100',
        iconText: 'text-slate-600'
      }
    };
    return configs[severidad as keyof typeof configs] || configs.info;
  };

  const handleToggleSeleccion = (id: string) => {
    setNotificaciones(notificaciones.map(n => 
      n.id === id ? { ...n, seleccionada: !n.seleccionada } : n
    ));
  };

  const handleMarcarTodasLeidas = () => {
    setNotificaciones(notificaciones.map(n => ({ ...n, seleccionada: true })));
  };

  const handleEliminarSeleccionadas = () => {
    setNotificaciones(notificaciones.filter(n => !n.seleccionada));
  };

  // Paginación
  const indexUltimo = paginaActual * notificacionesPorPagina;
  const indexPrimero = indexUltimo - notificacionesPorPagina;
  const notificacionesActuales = notificaciones.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(notificaciones.length / notificacionesPorPagina);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Centro de Notificaciones" />
        
        <main className="flex-1 p-6 lg:p-8 bg-[#f5f7f8]">
          {/* Header */}
          <div className="flex flex-wrap justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <p className="text-slate-900 text-3xl font-bold tracking-tight">
                Centro de Notificaciones
              </p>
              <p className="text-slate-500 text-base font-normal leading-normal">
                Gestiona y revisa todas las alertas de tu flota.
              </p>
            </div>
            <button className="bg-primary text-white font-medium text-sm px-4 py-2.5 rounded-lg flex items-center gap-2 h-fit hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-xl">add</span>
              Nueva Regla de Alerta
            </button>
          </div>

          {/* Filters and Toolbar */}
          <div className="w-full bg-white rounded-xl border border-slate-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Filtros */}
              <div className="flex gap-2 flex-wrap">
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light px-3 border border-slate-200">
                  <span className="material-symbols-outlined text-lg text-slate-600">filter_list</span>
                  <p className="text-slate-700 text-sm font-medium leading-normal">Tipo: Todas</p>
                  <span className="material-symbols-outlined text-lg text-slate-600">expand_more</span>
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light px-3 border border-slate-200">
                  <span className="material-symbols-outlined text-lg text-slate-600">calendar_today</span>
                  <p className="text-slate-700 text-sm font-medium leading-normal">Rango de Fechas</p>
                  <span className="material-symbols-outlined text-lg text-slate-600">expand_more</span>
                </button>
                <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-background-light px-3 border border-slate-200">
                  <span className="material-symbols-outlined text-lg text-slate-600">directions_boat</span>
                  <p className="text-slate-700 text-sm font-medium leading-normal">Contenedor</p>
                  <span className="material-symbols-outlined text-lg text-slate-600">expand_more</span>
                </button>
              </div>
              
              {/* Toolbar */}
              <div className="flex gap-2">
                <button 
                  onClick={handleMarcarTodasLeidas}
                  className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                  title="Marcar todas como leídas"
                >
                  <span className="material-symbols-outlined text-xl">done_all</span>
                </button>
                <button 
                  onClick={handleEliminarSeleccionadas}
                  className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                  title="Eliminar seleccionadas"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 animate-pulse">notifications</span>
                <p className="mt-4 text-gray-500">Cargando notificaciones...</p>
              </div>
            </div>
          ) : notificacionesActuales.length === 0 ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400">notifications_off</span>
                <p className="mt-4 text-gray-500">No hay notificaciones</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {notificacionesActuales.map((notif) => {
                const config = getSeveridadConfig(notif.severidad);
                return (
                  <div 
                    key={notif.id}
                    className={`flex gap-4 bg-white rounded-xl border ${config.border} p-4 justify-between items-center transition-shadow hover:shadow-md`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex items-center justify-center rounded-lg ${config.iconBg} shrink-0 size-12 ${config.iconText}`}>
                        <span className="material-symbols-outlined text-2xl">{notif.icon}</span>
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-slate-900 text-base font-semibold leading-normal">
                            {notif.titulo}
                          </p>
                          <span className={`text-xs font-medium ${config.text} ${config.bg} px-2 py-0.5 rounded-full`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm font-normal leading-normal">
                          {notif.descripcion}
                        </p>
                        <p className="text-slate-500 text-sm font-normal leading-normal">
                          Contenedor: <span className="font-medium text-slate-600">{notif.contenedor}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                        Ver Detalle
                      </button>
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox"
                          checked={notif.seleccionada}
                          onChange={() => handleToggleSeleccion(notif.id)}
                          className="h-5 w-5 rounded border-slate-300 bg-transparent text-primary focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {notificaciones.length > 0 && (
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-slate-500">
                Mostrando <span className="font-medium text-slate-700">{indexPrimero + 1}</span> a{' '}
                <span className="font-medium text-slate-700">{Math.min(indexUltimo, notificaciones.length)}</span> de{' '}
                <span className="font-medium text-slate-700">{notificaciones.length}</span> resultados
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPaginaActual(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  className="flex items-center justify-center size-9 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPaginaActual(num)}
                    className={`flex items-center justify-center size-9 border rounded-lg text-sm font-medium ${
                      paginaActual === num
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button 
                  onClick={() => setPaginaActual(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  className="flex items-center justify-center size-9 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
