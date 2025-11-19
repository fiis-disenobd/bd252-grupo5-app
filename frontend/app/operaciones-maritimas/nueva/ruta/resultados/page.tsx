"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type RutaResultado = {
  id: string;
  codigo: string;
  distancia: number | string;
  duracion: string | null;
  tarifa: number | string | null;
  puertosIntermedios: string[];
};

export default function RutasDisponiblesPage() {
  const searchParams = useSearchParams();
  const originId = searchParams.get("originId");
  const destinationId = searchParams.get("destinationId");
  const originName = searchParams.get("originName") || "Origen";
  const destinationName = searchParams.get("destinationName") || "Destino";

  const router = useRouter();

  const [rutas, setRutas] = useState<RutaResultado[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    const loadRutas = async () => {
      if (!originId || !destinationId) {
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `http://localhost:3001/monitoreo/rutas-maritimas?origen=${originId}&destino=${destinationId}`
        );
        if (!response.ok) {
          throw new Error("No se pudieron obtener las rutas marítimas.");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setRutas(data as RutaResultado[]);
        } else {
          setRutas([]);
        }
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar las rutas disponibles.");
        setRutas([]);
      } finally {
        setLoading(false);
      }
    };

    loadRutas();
  }, [originId, destinationId]);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f5f7f8] dark:bg-[#0f1923] font-display">
      <Header />
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Rutas Disponibles por Puertos
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {originName}
              </span>
              <span className="mx-2 text-[#0459af]">→</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {destinationName}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Seleccione una ruta para ver los detalles y confirmar la operación.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Código
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Distancia
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Duración
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Puertos Intermedios
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                    scope="col"
                  >
                    Tarifa (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading && (
                  <tr>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                      colSpan={5}
                    >
                      Cargando rutas disponibles...
                    </td>
                  </tr>
                )}
                {!loading && error && (
                  <tr>
                    <td
                      className="px-6 py-4 text-sm text-red-600 dark:text-red-400"
                      colSpan={5}
                    >
                      {error}
                    </td>
                  </tr>
                )}
                {!loading && !error && rutas.length === 0 && (
                  <tr>
                    <td
                      className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400"
                      colSpan={5}
                    >
                      No hay rutas disponibles entre los puertos seleccionados.
                    </td>
                  </tr>
                )}
                {!loading && !error &&
                  rutas.map((ruta) => (
                    <tr
                      key={ruta.id}
                      onClick={() => setSelectedRouteId(ruta.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedRouteId === ruta.id
                          ? "bg-[#0459af]/10 dark:bg-[#0459af]/20"
                          : "hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ruta.codigo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ruta.distancia}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ruta.duracion ?? "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ruta.puertosIntermedios.length > 0
                          ? ruta.puertosIntermedios.join(", ")
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {ruta.tarifa ?? "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end gap-4">
            <Link
              href="/operaciones-maritimas/nueva/ruta"
              className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              Volver a Selección de Puertos
            </Link>
            <button
              type="button"
              className="rounded-lg bg-[#0459af] px-4 py-2 text-sm font-medium text-white hover:bg-[#0459af]/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedRouteId}
              onClick={() => {
                if (!selectedRouteId) return;
                router.push(
                  `/operaciones-maritimas/nueva/ruta?routeId=${selectedRouteId}&originId=${originId ?? ""}&destinationId=${destinationId ?? ""}&originName=${encodeURIComponent(originName)}&destinationName=${encodeURIComponent(destinationName)}`
                );
              }}
            >
              Confirmar Ruta Seleccionada
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

