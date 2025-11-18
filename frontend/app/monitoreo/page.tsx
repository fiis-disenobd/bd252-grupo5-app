"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  const [alertas, setAlertas] = useState<Alerta[]>([
    {
      id: '1',
      titulo: 'Exceso de velocidad',
      sensor: 'GPS',
      contenedor: 'TRK-V987',
      fecha: '2023-10-27 14:35:10',
      severidad: 'alta'
    },
    {
      id: '2',
      titulo: 'Temperatura elevada',
      sensor: 'Temp-02',
      contenedor: 'CNT-R456',
      fecha: '2023-10-27 14:28:45',
      severidad: 'media'
    },
    {
      id: '3',
      titulo: 'Parada no programada',
      sensor: 'Motor',
      contenedor: 'TRK-V123',
      fecha: '2023-10-27 13:50:02',
      severidad: 'baja'
    },
    {
      id: '4',
      titulo: 'Desvío de ruta',
      sensor: 'Geo-cerca',
      contenedor: 'CNT-G789',
      fecha: '2023-10-27 13:15:22',
      severidad: 'alta'
    }
  ]);

  useEffect(() => {
    fetch("http://localhost:3001/monitoreo/operaciones/kpis")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Backend no disponible');
        }
        return res.json();
      })
      .then((data) => {
        setKpis(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("⚠️ Backend no disponible, usando datos de ejemplo:", err.message);
        // Usar datos de ejemplo si el backend no está disponible
        setKpis({
          operaciones_activas: 124,
          contenedores_transito: 89,
          alertas_pendientes: 5,
          entregas_hoy: 16,
        });
        setLoading(false);
      });
  }, []);

  // Configuración del gráfico de barras
  const barChartData = {
    labels: ['En tránsito', 'En puerto', 'Aduana', 'En bodega', 'Finalizada'],
    datasets: [
      {
        label: 'Operaciones',
        data: [89, 45, 22, 67, 127],
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

  // Configuración del gráfico de líneas
  const lineChartData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Notificaciones',
        data: [12, 19, 8, 15, 11, 24, 18],
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
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                <span className="material-symbols-outlined text-3xl">play_circle</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Operaciones activas</p>
                <p className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : kpis.operaciones_activas}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Contenedores en tránsito</p>
                <p className="text-3xl font-bold text-slate-800">
                  {loading ? "..." : kpis.contenedores_transito}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-amber-500/50 bg-white p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Alertas pendientes</p>
                <p className="text-3xl font-bold text-amber-600">
                  {loading ? "..." : kpis.alertas_pendientes}
                </p>
              </div>
            </div>

            <div className="col-span-1 flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <span className="material-symbols-outlined text-3xl">task_alt</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Entregas hoy</p>
                <p className="text-3xl font-bold text-slate-800">
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
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-medium text-slate-800">Operaciones por estado</h3>
                <div className="mt-4 h-[250px] w-full">
                  <Bar data={barChartData} options={barChartOptions} />
                </div>
              </div>

              {/* Gráfico de Líneas */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-medium text-slate-800">Notificaciones por día (última semana)</h3>
                <div className="mt-4 h-[250px] w-full">
                  <Line data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
            </div>

            {/* Columna Derecha - Alertas y Mapa */}
            <div className="flex flex-col gap-6 lg:col-span-1">
              {/* Alertas Recientes */}
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-base font-medium text-slate-800">Alertas recientes</h3>
                <div className="max-h-[300px] space-y-3 overflow-y-auto pr-2">
                  {alertas.map((alerta) => {
                    const classes = getAlertaClasses(alerta.severidad);
                    return (
                      <div key={alerta.id} className={`flex gap-3 rounded-lg border p-3 ${classes.container}`}>
                        <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${classes.dot}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{alerta.titulo}</p>
                          <p className="text-xs text-slate-500">Sensor: {alerta.sensor} | Cont: {alerta.contenedor}</p>
                          <p className="mt-1 text-xs text-slate-400">{alerta.fecha}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mapa */}
              <div className="flex h-[368px] flex-col rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="text-base font-medium text-slate-800">Ubicaciones actuales</h3>
                <div className="relative mt-4 flex-1 overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqokaqMi6VFpUM1EjnZuGpCpz8lvMD6MF72a-c-c6IxQ9bO5070zkdy6PcrJaA3SAtEFGOItHEmEwr1bHnEgg6KLLjrlnALzU_e-q2FeiNPkCbFAb65dnllCpf2x8ih3et4_0F7ANUU4iRID6yDJV2NEfFm0gVejA8-sNjIdt1TZxz9PnAtkPkmtwqWmB5n4qxYKXECW6KWZ3XYO0L6Fj4PqQpJHG_NOcb5ZCrOcXefwHcMiHAkWdjMnOwsV-AMzqSizgY6Rl8EeOO')"
                    }}
                  ></div>
                  <div className="absolute bottom-2 right-2">
                    <Link
                      href="/monitoreo/mapa"
                      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <span className="material-symbols-outlined text-base">open_in_full</span>
                      <span>Ver mapa completo</span>
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
