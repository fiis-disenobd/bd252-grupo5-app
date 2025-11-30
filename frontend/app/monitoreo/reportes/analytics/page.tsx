"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface DuracionPorMedioMes {
  anio: number;
  mes: number;
  medio_transporte: string;
  duracion_promedio_min: number;
}

interface IncidenciasAltaPorBuque {
  buque: string;
  total_incidencias_alta: number;
}

interface SerieTiempoPorMedio {
  fecha: string;
  medio_transporte: string;
  duracion_promedio_min: number;
  incidencias_alta: number;
}

interface KpisAnalytics {
  total_operaciones?: number;
  promedio_duracion_global?: number;
  fecha_min?: string;
  fecha_max?: string;
}

export default function ReportesAnalyticsPage() {
  const [duracion, setDuracion] = useState<DuracionPorMedioMes[]>([]);
  const [incidencias, setIncidencias] = useState<IncidenciasAltaPorBuque[]>([]);
  const [serieTiempo, setSerieTiempo] = useState<SerieTiempoPorMedio[]>([]);
  const [kpis, setKpis] = useState<KpisAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/monitoreo/reportes/analytics/resumen`,
        );
        const data = await res.json();
        setKpis(data.kpis || null);
        setDuracion(data.duracionPorMedioMes || []);
        setIncidencias(data.incidenciasAltaPorBuque || []);
        setSerieTiempo(data.serieTiempoPorMedio || []);
      } catch (error) {
        console.error("Error cargando resumen analítico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtro de rango de fechas aplicado en frontend
  const filteredSerieTiempo = serieTiempo.filter((row) => {
    if (!fechaDesde && !fechaHasta) return true;
    const fecha = new Date(row.fecha);
    if (fechaDesde && fecha < new Date(fechaDesde)) return false;
    if (fechaHasta && fecha > new Date(fechaHasta)) return false;
    return true;
  });

  const filteredDuracion = duracion.filter((row) => {
    if (!fechaDesde && !fechaHasta) return true;
    const fechaMes = new Date(row.anio, row.mes - 1, 1);
    if (fechaDesde && fechaMes < new Date(fechaDesde)) return false;
    if (fechaHasta && fechaMes > new Date(fechaHasta)) return false;
    return true;
  });

  // Información del último batch a partir de la serie de tiempo
  let ultimaFechaBatchLabel: string | null = null;
  let registrosUltimoBatch = 0;
  if (serieTiempo.length > 0) {
    const fechasOrdenadas = Array.from(new Set(serieTiempo.map((row) => row.fecha))).sort();
    const ultima = fechasOrdenadas[fechasOrdenadas.length - 1];
    ultimaFechaBatchLabel = new Date(ultima).toLocaleDateString("es-PE");
    registrosUltimoBatch = serieTiempo.filter((row) => row.fecha === ultima).length;
  }

  // Datos para la duración promedio por medio y mes (aplican filtro)
  const duracionLabels = filteredDuracion.map(
    (row) => `${row.anio}-${row.mes.toString().padStart(2, "0")} (${row.medio_transporte})`,
  );

  const duracionData = {
    labels: duracionLabels,
    datasets: [
      {
        label: "Duración promedio (min)",
        data: filteredDuracion.map((row) => row.duracion_promedio_min),
        backgroundColor: "#3c83f6",
        borderColor: "#1d4ed8",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const duracionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          maxRotation: 45,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  } as const;

  // Gráfico donut: distribución por medio de transporte usando la serie de tiempo filtrada
  const agregadosPorMedio: Record<string, number> = {};
  filteredSerieTiempo.forEach((row) => {
    const clave = row.medio_transporte || "N/A";
    agregadosPorMedio[clave] = (agregadosPorMedio[clave] || 0) + 1;
  });

  const donutLabels = Object.keys(agregadosPorMedio);
  const donutValues = donutLabels.map((medio) => agregadosPorMedio[medio]);

  const donutData = {
    labels: donutLabels,
    datasets: [
      {
        data: donutValues,
        backgroundColor: ["#3c83f6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 4,
      },
    },
    cutout: "60%",
  } as const;

  // Serie de tiempo: agrupar por fecha y un dataset por medio (aplican filtro)
  const fechasUnicas = Array.from(
    new Set(filteredSerieTiempo.map((row) => row.fecha)),
  ).sort();

  const mediosUnicos = Array.from(
    new Set(filteredSerieTiempo.map((row) => row.medio_transporte)),
  );

  const lineData = {
    labels: fechasUnicas,
    datasets: mediosUnicos.map((medio, idx) => {
      const colorPalette = ["#3b82f6", "#22c55e", "#f97316", "#e11d48"];
      const color = colorPalette[idx % colorPalette.length];
      return {
        label: medio || "N/A",
        data: fechasUnicas.map((fecha) => {
          const punto = filteredSerieTiempo.find(
            (row) => row.fecha === fecha && row.medio_transporte === medio,
          );
          return punto ? punto.duracion_promedio_min : 0;
        }),
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
      };
    }),
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 4,
        displayColors: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  } as const;

  const incidenciasLabels = incidencias.map((row) => row.buque);

  const incidenciasData = {
    labels: incidenciasLabels,
    datasets: [
      {
        label: "Incidencias alta severidad",
        data: incidencias.map((row) => Number(row.total_incidencias_alta)),
        backgroundColor: "#f97316",
        borderColor: "#ea580c",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const incidenciasOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f8fafc",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 4,
        displayColors: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#64748b",
        },
        grid: {
          color: "#e2e8f0",
        },
      },
    },
  } as const;

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-7xl p-6">
        {/* Header tipo dashboard */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              Dashboard de Estadísticas de Monitoreo
            </h1>
            <p className="text-sm text-zinc-500">
              Resumen basado en el proceso batch del esquema monitoreo_analytics.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-xs text-zinc-500">a</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => {
                  const hoy = new Date();
                  const hace30 = new Date();
                  hace30.setDate(hoy.getDate() - 30);
                  const fmt = (d: Date) => d.toISOString().slice(0, 10);
                  setFechaDesde(fmt(hace30));
                  setFechaHasta(fmt(hoy));
                }}
                className="hidden rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:inline-flex sm:items-center sm:gap-1"
              >
                <span className="material-symbols-outlined text-base">calendar_today</span>
                Últimos 30 días
              </button>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setFechaDesde("");
                  setFechaHasta("");
                }}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
              >
                Limpiar filtro
              </button>
              <Link
                href="/monitoreo/reportes"
                className="flex items-center gap-2 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-900"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Volver a reportes
              </Link>
            </div>
          </div>
        </div>

        {/* Nota sobre procesos batch analíticos */}
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          <p className="font-semibold">Nota sobre los procesos batch analíticos</p>
          <p className="mt-1">
            Los gráficos muestran todas las fechas consolidadas en el esquema
            <span className="font-mono"> monitoreo_analytics</span>, sin distinguir si
            provienen de un cierre diario o de un cierre masivo de 120 días. Se
            recomienda ejecutar una sola vez el cierre de los últimos 120 días
            para poblar el histórico inicial y, a partir de entonces, utilizar
            únicamente el cierre diario para mantener la información actualizada.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs - estilo tarjetas */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-medium text-zinc-500">
                  Operaciones analizadas
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {kpis?.total_operaciones ?? 0}
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="material-symbols-outlined text-base">
                    sailing
                  </span>
                  <span>Operaciones consolidadas en el data mart</span>
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-medium text-zinc-500">
                  Duración promedio global (min)
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {kpis?.promedio_duracion_global
                    ? Math.round(kpis.promedio_duracion_global)
                    : 0}
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-sky-600">
                  <span className="material-symbols-outlined text-base">
                    schedule
                  </span>
                  <span>Tiempo promedio desde inicio hasta fin de operación</span>
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-medium text-zinc-500">
                  Rango de fechas analizadas
                </p>
                <p className="text-base font-semibold text-zinc-900">
                  {kpis?.fecha_min && kpis?.fecha_max
                    ? `${new Date(kpis.fecha_min).toLocaleDateString("es-PE")} - ${new Date(
                        kpis.fecha_max,
                      ).toLocaleDateString("es-PE")}`
                    : "N/A"}
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-amber-600">
                  <span className="material-symbols-outlined text-base">
                    calendar_month
                  </span>
                  <span>Ventana de análisis cubierta por el último batch</span>
                </p>
              </div>

              {/* Último proceso batch */}
              <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-medium text-zinc-500">
                  Último proceso batch
                </p>
                <p className="text-base font-semibold text-zinc-900">
                  {ultimaFechaBatchLabel ?? "Sin datos"}
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <span className="material-symbols-outlined text-base">
                    task_alt
                  </span>
                  <span>
                    {ultimaFechaBatchLabel
                      ? `${registrosUltimoBatch} registros procesados en la última fecha de corte`
                      : "Ejecuta el batch para generar información analítica"}
                  </span>
                </p>
              </div>
            </section>

            {/* Zona de gráficos principal + lateral, similar al dashboard de referencia */}
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Serie de tiempo (columna principal) */}
              <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-zinc-900">
                      Tendencia de duración promedio por medio
                    </p>
                    <p className="text-xs text-zinc-500">
                      Evolución temporal de la duración de operaciones monitoreadas.
                    </p>
                  </div>
                </div>
                {serieTiempo.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No hay datos analíticos disponibles. Ejecuta el proceso batch
                    de cierre diario para generar información.
                  </p>
                ) : (
                  <div className="h-72 w-full">
                    <Line data={lineData} options={lineOptions} />
                  </div>
                )}
              </div>

              {/* Incidencias alta severidad (columna lateral) */}
              <div className="rounded-xl border border-zinc-200 bg-white p-6">
                <p className="mb-2 text-base font-semibold text-zinc-900">
                  Incidencias de alta severidad por buque (Top 10)
                </p>
                <p className="mb-4 text-xs text-zinc-500">
                  Distribución de buques con mayor número de incidencias críticas.
                </p>
                {incidencias.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    No hay datos analíticos disponibles. Ejecuta el proceso batch
                    para generar información.
                  </p>
                ) : (
                  <div className="h-64 w-full">
                    <Bar data={incidenciasData} options={incidenciasOptions} />
                  </div>
                )}
              </div>
            </section>

            {/* Duración promedio por medio y mes en bloque completo inferior */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-base font-semibold text-zinc-900">
                  Duración promedio por medio de transporte y mes
                </p>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                  Vista agregada mensual
                </span>
              </div>
              {duracion.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No hay datos analíticos disponibles. Ejecuta el proceso batch
                  de cierre diario para generar información.
                </p>
              ) : (
                <div className="h-72 w-full">
                  <Bar data={duracionData} options={duracionOptions} />
                </div>
              )}
            </section>

            {/* Donut: distribución por medio de transporte */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-base font-semibold text-zinc-900">
                  Distribución de operaciones por medio de transporte
                </p>
              </div>
              {filteredSerieTiempo.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No hay datos analíticos disponibles en el rango seleccionado.
                </p>
              ) : (
                <div className="mx-auto flex h-64 max-w-md items-center justify-center">
                  <Doughnut data={donutData} options={donutOptions} />
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
