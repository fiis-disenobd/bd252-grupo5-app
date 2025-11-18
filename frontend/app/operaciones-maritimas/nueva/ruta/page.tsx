"use client";

import { Header } from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeleccionRutasMaritimasPage() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-[#0f1923] dark:text-gray-100">
      <Header />
      <main className="flex flex-col flex-1 gap-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-gray-800 dark:text-gray-100 text-2xl font-bold">
              Selección de Rutas Marítimas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Operaciones / Planificación / Selección de Rutas Marítimas
            </p>
          </div>
        </div>

        <div className="flex flex-1 gap-6">
          <aside className="flex flex-col w-96 bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700">
            <div className="flex-grow">
              <h3 className="text-gray-800 dark:text-gray-100 text-lg font-bold mb-4">
                Criterios de Búsqueda
              </h3>
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="origin-port"
                  >
                    Puerto de Origen
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="origin-port"
                  >
                    <option>Seleccionar puerto</option>
                    <option>Puerto de Valencia</option>
                    <option>Puerto de Algeciras</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="destination-port"
                  >
                    Puerto de Destino
                  </label>
                  <select
                    className="form-select w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="destination-port"
                  >
                    <option>Seleccionar puerto</option>
                    <option>Puerto de Hamburgo</option>
                    <option>Puerto de Rotterdam</option>
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    htmlFor="date-range"
                  >
                    Rango de fechas
                  </label>
                  <input
                    className="form-input w-full rounded-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-gray-100 shadow-sm focus:border-[#005594] focus:ring focus:ring-[#005594] focus:ring-opacity-50"
                    id="date-range"
                    type="date"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/operaciones-maritimas/nueva/ruta/resultados")}
                  className="flex items-center justify-center gap-2 w-full rounded-md h-10 px-4 bg-[#F98C00] text-white text-sm font-bold hover:bg-orange-500 transition-colors mt-4"
                >
                  <span className="material-symbols-outlined">search</span>
                  <span>Buscar rutas</span>
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col gap-6">
            <div className="flex-1 rounded-lg overflow-hidden relative shadow-lg">
              <div className="absolute inset-0 bg-gray-200 dark:bg-slate-700"></div>
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <div className="flex flex-col bg-white dark:bg-slate-800 rounded-md shadow-md">
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-md"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      add
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-md border-t border-gray-200 dark:border-slate-600"
                  >
                    <span className="material-symbols-outlined text-2xl">
                      remove
                    </span>
                  </button>
                </div>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    navigation
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    layers
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    3d_rotation
                  </span>
                </button>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-md bg-white dark:bg-slate-800 shadow-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <span className="material-symbols-outlined text-2xl">
                    fullscreen
                  </span>
                </button>
              </div>
              <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-800 bg-opacity-90 dark:bg-opacity-90 p-3 rounded-md shadow-md text-xs z-10">
                <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-100">
                  Leyenda del mapa
                </h4>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-[#002D62] rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto Principal</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto Secundario</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="w-4 h-4 bg-gray-400 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"></span>
                  <span>Puerto no disponible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <div className="w-4 h-1 bg-red-500"></div>
                  <span>Ruta activa</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold text-white bg-[#F98C00] rounded-md hover:bg-orange-500 shadow-lg"
                >
                  Confirmar Ruta
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 shadow-lg"
                >
                  Limpiar mapa
                </button>
                <Link
                  href="/operaciones-maritimas/nueva"
                  className="px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-slate-800 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 shadow-lg"
                >
                  Cancelar
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm">
              <details open={isDetailsOpen}>
                <summary
                  className="flex items-center justify-between font-bold text-gray-800 dark:text-gray-100 cursor-pointer"
                  onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                >
                  <span>Información de Ruta Activa: HL-ES-DE-001</span>
                  <span className="material-symbols-outlined">
                    {isDetailsOpen ? "expand_less" : "expand_more"}
                  </span>
                </summary>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <strong>Origen:</strong> Puerto de Valencia
                  </div>
                  <div>
                    <strong>Destino:</strong> Puerto de Hamburgo
                  </div>
                  <div>
                    <strong>Distancia Total:</strong> 1500 MN
                  </div>
                  <div>
                    <strong>Tiempo Estimado:</strong> 5 días 4 horas
                  </div>
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

