"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Importar MapaGPS dinámicamente para evitar SSR
const MapaGPS = dynamic(() => import("@/components/monitoreo/MapaGPSDashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">Cargando mapa...</p>
      </div>
    </div>
  ),
});

interface KPIs {
  operaciones_activas: number;
  contenedores_transito: number;
  alertas_pendientes: number;
  entregas_hoy: number;
}

interface Alerta {
  id: string;
  titulo: string;
  sensor: string;
  contenedor: string;
  fecha: string;
  severidad: 'alta' | 'media' | 'baja';
}

export default function MonitoreoDashboard() {
  const [kpis, setKpis] = useState<KPIs>({
    operaciones_activas: 0,
    contenedores_transito: 0,
    alertas_pendientes: 0,
    entregas_hoy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [operacionesPorEstado, setOperacionesPorEstado] = useState<any[]>([]);
  const [notificacionesPorDia, setNotificacionesPorDia] = useState<any[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Fetch KPIs
        const kpisRes = await fetch("http://localhost:3001/monitoreo/operaciones/kpis");
        if (kpisRes.ok) {
          const kpisData = await kpisRes.json();
          setKpis(kpisData);
        }

        // Fetch operaciones por estado para gráfico de barras
        const opEstadoRes = await fetch("http://localhost:3001/monitoreo/operaciones/por-estado");
        if (opEstadoRes.ok) {
          const opEstadoData = await opEstadoRes.json();
          setOperacionesPorEstado(opEstadoData);
        }

        // Fetch notificaciones por día para gráfico de líneas
        const notifPorDiaRes = await fetch("http://localhost:3001/monitoreo/sensores/notificaciones/por-dia?dias=7");
        if (notifPorDiaRes.ok) {
          const notifPorDiaData = await notifPorDiaRes.json();
          setNotificacionesPorDia(notifPorDiaData);
        }

        // Fetch alertas recientes
        const alertasRes = await fetch("http://localhost:3001/monitoreo/sensores/notificaciones?limite=10");
        if (alertasRes.ok) {
          const alertasData = await alertasRes.json();
          // Mapear notificaciones a alertas
          const alertasMapeadas: Alerta[] = alertasData.notificaciones?.map((notif: any) => ({
            id: notif.id_notificacion,
            titulo: notif.tipo_notificacion?.nombre || 'Alerta',
            sensor: notif.sensor?.tipo_sensor?.nombre || 'N/A',
            contenedor: notif.sensor?.contenedor?.codigo || 'N/A',
            fecha: new Date(notif.fecha_hora).toLocaleString('es-PE'),
            severidad: getSeveridad(notif.tipo_notificacion?.nombre)
          })) || [];
          setAlertas(alertasMapeadas);
        }

        setLoading(false);
      } catch (err) {
        console.warn("⚠️ Error al cargar datos del backend:", err);
        // Usar datos de ejemplo si el backend no está disponible
        setKpis({
          operaciones_activas: 124,
          contenedores_transito: 89,
          alertas_pendientes: 5,
          entregas_hoy: 16,
        });
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  const getSeveridad = (tipoNotif: string): 'alta' | 'media' | 'baja' => {
    if (!tipoNotif) return 'baja';
    const tipo = tipoNotif.toLowerCase();
    if (tipo.includes('crítica') || tipo.includes('critica') || tipo.includes('alerta')) return 'alta';
    if (tipo.includes('advertencia') || tipo.includes('warning')) return 'media';
    return 'baja';
  };

  // Estados fijos según la base de datos
  const ESTADOS_OPERACION = [
    'Programada',
    'En Curso',
    'Completada',
    'Cancelada',
    'En Espera',
  ];

  // Configuración del gráfico de barras (datos desde backend)
  const barChartData = {
    labels: ESTADOS_OPERACION,
    datasets: [
      {
        label: 'Operaciones',
        data: ESTADOS_OPERACION.map((estado) => {
          const encontrado = operacionesPorEstado.find(
            (op) => (op.estado || '').toLowerCase() === estado.toLowerCase()
          );
          return encontrado ? encontrado.cantidad || 0 : 0;
        }),
        backgroundColor: '#3c83f6',
        borderColor: '#3c83f6',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  // Configuración del gráfico de líneas (datos desde backend)
  const lineChartData = {
    labels: notificacionesPorDia.map(notif => {
      const fecha = new Date(notif.fecha);
      return fecha.toLocaleDateString('es-PE', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Notificaciones',
        data: notificacionesPorDia.map(notif => notif.cantidad || 0),
        borderColor: '#3c83f6',
        tension: 0.4,
        fill: true,
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(60, 131, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(60, 131, 246, 0)');
          return gradient;
        },
        pointBackgroundColor: '#3c83f6',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        pointRadius: 4,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        },
      },
    },
  };

  const getAlertaClasses = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return {
          container: 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-500/10',
          dot: 'bg-red-500',
        };
      case 'media':
        return {
          container: 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-500/10',
          dot: 'bg-amber-500',
        };
      default:
        return {
          container: 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/20',
          dot: 'bg-blue-500',
        };
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-zinc-900 p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Operaciones activas</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {loading ? "..." : kpis.operaciones_activas}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Contenedores en tránsito</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {loading ? "..." : kpis.contenedores_transito}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-amber-500/50 dark:border-amber-700/50 bg-white dark:bg-slate-900 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Alertas pendientes</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {loading ? "..." : kpis.alertas_pendientes}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-3xl">task_alt</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Entregas hoy</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  {loading ? "..." : kpis.entregas_hoy}
                </p>
              </div>
            </div>
          </div>

          {/* Gráficos y Alertas */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Columna Izquierda - Gráficos */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Gráfico de Barras */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Operaciones por estado</h3>
                <div className="mt-4 h-[250px] w-full">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Gráfico de Líneas */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Notificaciones por día (última semana)</h3>
                <div className="mt-4 h-[250px] w-full">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
            </div>

            {/* Columna Derecha - Alertas y Mapa */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Alertas Recientes */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                <h3 className="mb-4 text-base font-medium text-slate-800 dark:text-slate-100">Alertas recientes</h3>
                <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                  {alertas.map((alerta) => {
                    const classes = getAlertaClasses(alerta.severidad);
                    return (
                      <div key={alerta.id} className={`flex gap-3 rounded-lg border p-3 ${classes.container}`}>
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${classes.dot}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{alerta.titulo}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Sensor: {alerta.sensor} | Cont: {alerta.contenedor}</p>
                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{alerta.fecha}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mapa */}
              <div className="flex h-[368px] flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">Ubicaciones actuales</h3>
                  <Link
                    href="/monitoreo/mapa"
                    className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Ver mapa completo</span>
                    <span className="material-symbols-outlined text-sm">open_in_full</span>
                  </Link>
                </div>
                <div className="flex-1 overflow-hidden rounded-lg">
                  <MapaGPS height="100%" />
                </div>
              </div>
            </div>
          </div>
        </main>
    </div>
  );
}
