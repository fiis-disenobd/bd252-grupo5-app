"use client";

import { useState } from "react";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

export default function VmDemoPage() {
  const [sensorId, setSensorId] = useState("");
  const [contenedorId, setContenedorId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [points, setPoints] = useState<TimeSeriesPoint[]>([]);
  const [loadingSync, setLoadingSync] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    if (!sensorId) return;
    setLoadingSync(true);
    setError(null);
    setSyncResult(null);

    try {
      const res = await fetch(
        `${API_URL}/monitoreo/vm/sync-lecturas/sensor/${encodeURIComponent(sensorId)}?limite=100`,
        {
          method: "POST",
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const data = await res.json();
      setContenedorId(data.contenedorId || null);
      setSyncResult(
        `Se sincronizaron ${data.lecturasSincronizadas} lecturas desde LecturaSensor para el sensor ${data.sensorId}.` +
          (data.contenedorId ? ` Contenedor asociado: ${data.contenedorId}.` : ""),
      );
    } catch (e: any) {
      setError(e.message || "Error al sincronizar lecturas");
    } finally {
      setLoadingSync(false);
    }
  };

  const handleLoadSeries = async () => {
    if (!contenedorId) {
      setError("Primero sincroniza un sensor que tenga contenedor asociado.");
      return;
    }

    setLoadingData(true);
    setError(null);

    try {
      const res = await fetch(
        `${API_URL}/monitoreo/vm/temperatura/${encodeURIComponent(contenedorId)}`,
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const data = await res.json();
      setPoints(data.points || []);
    } catch (e: any) {
      setError(e.message || "Error al cargar la serie de tiempo");
    } finally {
      setLoadingData(false);
    }
  };

  const chartData = {
    labels: points.map((p) => {
      const d = new Date(p.timestamp * 1000);
      return d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
    }),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: points.map((p) => p.value),
        borderColor: "#fb923c",
        backgroundColor: "rgba(251, 146, 60, 0.2)",
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y;
            return `Temperatura: ${value.toFixed(2)} °C`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b" },
      },
      y: {
        ticks: { color: "#64748b" },
        beginAtZero: false,
      },
    },
  } as const;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-zinc-50">
      <MapHeader />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900">Demo Series de Tiempo (VictoriaMetrics)</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Sincroniza lecturas reales de sensores desde la base relacional hacia VictoriaMetrics y visualiza la
                temperatura de un contenedor como serie de tiempo.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">1. Sincronizar lecturas de un sensor</h2>
              <p className="text-sm text-zinc-500">
                Ingrese el <strong>ID de un sensor</strong> que tenga lecturas registradas en la tabla
                <code className="mx-1 rounded bg-zinc-100 px-1 text-xs">monitoreo.lecturasensor</code>. Se enviarán las
                últimas 100 lecturas a VictoriaMetrics.
              </p>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">
                  ID de Sensor
                  <input
                    type="text"
                    value={sensorId}
                    onChange={(e) => setSensorId(e.target.value)}
                    placeholder="e.g. 4f1c1d5e-..."
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <button
                  onClick={handleSync}
                  disabled={!sensorId || loadingSync}
                  className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingSync ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sincronizando...
                    </span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined mr-1 text-base">sync</span>
                      Sincronizar lecturas
                    </>
                  )}
                </button>

                {syncResult && (
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                    {syncResult}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-900">2. Cargar serie de temperatura</h2>
              <p className="text-sm text-zinc-500">
                Después de sincronizar, se usará el <strong>ID de contenedor</strong> asociado al sensor para consultar
                la serie de temperatura desde VictoriaMetrics.
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  Contenedor asociado:
                  <span className="ml-1 font-semibold text-zinc-900">
                    {contenedorId || "(aún no identificado)"}
                  </span>
                </p>
              </div>

              <button
                onClick={handleLoadSeries}
                disabled={!contenedorId || loadingData}
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingData ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Cargando serie...
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-1 text-base">show_chart</span>
                    Ver temperatura
                  </>
                )}
              </button>

              {points.length > 0 && (
                <p className="mt-2 text-xs text-zinc-500">
                  Puntos cargados: <span className="font-semibold text-zinc-800">{points.length}</span>
                </p>
              )}
              {points.length > 0 && (
                <p className="mt-2 text-xs text-zinc-500">
                  Rango de timestamps:{" "}
                  <span className="font-semibold text-zinc-800">
                    {new Date(Math.min(...points.map((p) => p.timestamp * 1000))).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {new Date(Math.max(...points.map((p) => p.timestamp * 1000))).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </p>
              )}
              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-zinc-900">
                Serie de temperatura del contenedor
              </h2>
              <p className="text-xs text-zinc-500">
                Se muestran los puntos devueltos por el endpoint
                <code className="mx-1 rounded bg-zinc-100 px-1 text-[10px]">/monitoreo/vm/temperatura/:contenedorId</code>
              </p>
            </div>

            {points.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-sm text-zinc-500">
                No hay datos para mostrar. Sincroniza un sensor y luego carga la serie.
              </div>
            ) : (
              <div className="h-72 w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
