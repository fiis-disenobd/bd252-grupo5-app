"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";
import { StatCard } from "@/components/monitoreo/StatCard";
import { TrendIndicator } from "@/components/monitoreo/TrendIndicator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Analiticas {
  sensor: {
    id_sensor: string;
    tipo_sensor?: {
      nombre: string;
    };
    contenedor?: {
      codigo: string;
    };
  };
  estadisticas: {
    promedio: number;
    maximo: number;
    minimo: number;
    desviacion_estandar: number;
    total_lecturas: number;
  };
  lecturas_por_hora: {
    hora: string;
    promedio: number;
    cantidad: number;
  }[];
  tendencia: "ascendente" | "descendente" | "estable";
  alertas_generadas: number;
}

export default function SensorAnaliticasPage() {
  const params = useParams();
  const [analiticas, setAnaliticas] = useState<Analiticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/monitoreo/sensores/${params.sensorId}/analiticas`)
      .then((res) => res.json())
      .then((data) => {
        setAnaliticas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, [params.sensorId]);

  const getTendenciaDescription = (tendencia: string) => {
    const descriptions = {
      ascendente: "Las lecturas muestran una tendencia creciente en las últimas horas",
      descendente: "Las lecturas muestran una tendencia decreciente en las últimas horas",
      estable: "Las lecturas se mantienen estables sin cambios significativos",
    };
    return descriptions[tendencia as keyof typeof descriptions] || "";
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-zinc-600">Cargando analíticas...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!analiticas) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">error</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">No se pudieron cargar las analíticas</h2>
            <p className="mb-4 text-zinc-600">Intenta nuevamente más tarde</p>
            <Link
              href={`/monitoreo/contenedores/${params.id}/sensores/${params.sensorId}`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver al Sensor
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
              href={`/monitoreo/contenedores/${params.id}/sensores/${params.sensorId}`}
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver al Sensor
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900">Analíticas Avanzadas</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Sensor {analiticas.sensor.tipo_sensor?.nombre || "Desconocido"} • Contenedor{" "}
              {analiticas.sensor.contenedor?.codigo || "N/A"}
            </p>
          </div>

          {/* KPIs */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Promedio"
              value={analiticas.estadisticas.promedio}
              icon="trending_flat"
              color="primary"
            />
            <StatCard
              title="Máximo"
              value={analiticas.estadisticas.maximo}
              icon="arrow_upward"
              color="red"
            />
            <StatCard
              title="Mínimo"
              value={analiticas.estadisticas.minimo}
              icon="arrow_downward"
              color="blue"
            />
            <StatCard
              title="Desv. Estándar"
              value={analiticas.estadisticas.desviacion_estandar}
              icon="functions"
              color="amber"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Promedio por Hora */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">Promedio por Hora</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analiticas.lecturas_por_hora}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" style={{ fontSize: "12px" }} />
                  <YAxis style={{ fontSize: "12px" }} />
                  <Tooltip />
                  <Bar dataKey="promedio" fill="#ff8c00" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="mt-4 text-xs text-zinc-500">
                Total de lecturas: {analiticas.estadisticas.total_lecturas}
              </p>
            </div>

            {/* Análisis de Tendencia */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">Análisis de Tendencia</h2>
              <TrendIndicator
                trend={analiticas.tendencia}
                description={getTendenciaDescription(analiticas.tendencia)}
              />
              <div className="mt-6">
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <span className="material-symbols-outlined text-red-600">notifications</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-500">Alertas Generadas</p>
                      <p className="text-2xl font-bold text-zinc-900">
                        {analiticas.alertas_generadas}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Distribución de Valores */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">
                Rango de Valores (Últimas 100 lecturas)
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-700">Valor Mínimo Registrado</p>
                  <p className="mt-2 text-3xl font-bold text-green-900">
                    {analiticas.estadisticas.minimo}
                  </p>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <p className="text-sm font-medium text-blue-700">Valor Promedio</p>
                  <p className="mt-2 text-3xl font-bold text-blue-900">
                    {analiticas.estadisticas.promedio}
                  </p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">Valor Máximo Registrado</p>
                  <p className="mt-2 text-3xl font-bold text-red-900">
                    {analiticas.estadisticas.maximo}
                  </p>
                </div>
              </div>
            </div>

            {/* Estadísticas Adicionales */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">Estadísticas del Período</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4">
                  <span className="material-symbols-outlined text-3xl text-primary">
                    query_stats
                  </span>
                  <div>
                    <p className="text-xs text-zinc-500">Total de Lecturas</p>
                    <p className="text-xl font-bold text-zinc-900">
                      {analiticas.estadisticas.total_lecturas}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4">
                  <span className="material-symbols-outlined text-3xl text-amber-600">
                    speed
                  </span>
                  <div>
                    <p className="text-xs text-zinc-500">Variación (σ)</p>
                    <p className="text-xl font-bold text-zinc-900">
                      ±{analiticas.estadisticas.desviacion_estandar}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4">
                  <span className="material-symbols-outlined text-3xl text-green-600">
                    show_chart
                  </span>
                  <div>
                    <p className="text-xs text-zinc-500">Rango Total</p>
                    <p className="text-xl font-bold text-zinc-900">
                      {(analiticas.estadisticas.maximo - analiticas.estadisticas.minimo).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90">
              <span className="material-symbols-outlined text-lg">description</span>
              Exportar Reporte PDF
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
              <span className="material-symbols-outlined text-lg">table_view</span>
              Exportar Datos Excel
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50">
              <span className="material-symbols-outlined text-lg">email</span>
              Enviar por Email
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
