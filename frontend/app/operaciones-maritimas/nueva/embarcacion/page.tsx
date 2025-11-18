"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function SeleccionarEmbarcacionPage() {
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);

  const vessels = [
    {
      id: "vessel-1",
      matricula: "IMO-9347438",
      nombre: "La Esmeralda",
      capacidad: "12000",
      estado: "Mantenimiento",
      estadoColor: "yellow",
      peso: "150000.00",
      ubicacion: "8.9824 N, 79.5199 W",
    },
    {
      id: "vessel-2",
      matricula: "IMO-9436444",
      nombre: "El Diamante",
      capacidad: "11500",
      estado: "En Operación",
      estadoColor: "green",
      peso: "145000.00",
      ubicacion: "34.0522 N, 118.2437 W",
    },
    {
      id: "vessel-3",
      matricula: "IMO-9708847",
      nombre: "La Perla del Pacífico",
      capacidad: "13000",
      estado: "Fuera de Servicio",
      estadoColor: "red",
      peso: "160000.00",
      ubicacion: "35.6895 N, 139.6917 E",
    },
    {
      id: "vessel-4",
      matricula: "IMO-9321499",
      nombre: "El Zafiro",
      capacidad: "10000",
      estado: "En Operación",
      estadoColor: "green",
      peso: "130000.00",
      ubicacion: "51.5074 N, 0.1278 W",
    },
    {
      id: "vessel-5",
      matricula: "IMO-9408818",
      nombre: "El Rubí",
      capacidad: "12500",
      estado: "Mantenimiento",
      estadoColor: "yellow",
      peso: "155000.00",
      ubicacion: "1.3521 S, 103.8198 E",
    },
  ];

  const getEstadoStyles = (color: string) => {
    const styles = {
      yellow:
        "px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      green:
        "px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      red: "px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return styles[color as keyof typeof styles] || styles.yellow;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923] font-display">
      <Header />
      <main className="flex-grow flex p-6 gap-6">
        <div className="w-full flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Seleccionar Embarcación
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Visualice las embarcaciones disponibles y seleccione una para la
                operación.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-[#f5f7f8] dark:bg-gray-800 rounded-lg focus:ring-[#0459af] focus:border-[#0459af] text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Buscar embarcaciones..."
                  type="text"
                />
              </div>
              <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-[#f5f7f8] dark:bg-gray-800 rounded-lg focus:ring-[#0459af] focus:border-[#0459af] text-gray-800 dark:text-gray-200">
                <option>Filtrar por Nombre</option>
              </select>
              <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-[#f5f7f8] dark:bg-gray-800 rounded-lg focus:ring-[#0459af] focus:border-[#0459af] text-gray-800 dark:text-gray-200">
                <option>Filtrar por matrícula</option>
              </select>
              <select className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 bg-[#f5f7f8] dark:bg-gray-800 rounded-lg focus:ring-[#0459af] focus:border-[#0459af] text-gray-800 dark:text-gray-200">
                <option>Filtrar por Estado</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-[#f5f7f8] dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3" scope="col"></th>
                    <th className="px-6 py-3" scope="col">
                      Matrícula
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Nombre
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Capacidad
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Estado
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Peso
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Ubicación actual
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vessels.map((vessel) => (
                    <tr
                      key={vessel.id}
                      className="bg-white dark:bg-slate-800 border-b dark:border-gray-800 hover:bg-[#f5f7f8] dark:hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4">
                        <input
                          className="h-4 w-4 rounded border-gray-300 text-[#0459af] focus:ring-[#0459af] dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-[#0459af]"
                          id={vessel.id}
                          name="vessel-selection"
                          type="radio"
                          checked={selectedVessel === vessel.id}
                          onChange={() => setSelectedVessel(vessel.id)}
                        />
                      </td>
                      <td className="px-6 py-4">{vessel.matricula}</td>
                      <th
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        scope="row"
                      >
                        {vessel.nombre}
                      </th>
                      <td className="px-6 py-4">{vessel.capacidad}</td>
                      <td className="px-6 py-4">
                        <span className={getEstadoStyles(vessel.estadoColor)}>
                          {vessel.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4">{vessel.peso}</td>
                      <td className="px-6 py-4">{vessel.ubicacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end items-center mt-6 gap-4">
              <Link
                href="/operaciones-maritimas/nueva"
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-transparent rounded-lg border border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Volver
              </Link>
              <button
                type="button"
                onClick={() => setSelectedVessel(null)}
                className="px-6 py-2 text-sm font-medium text-[#0459af] bg-transparent rounded-lg border border-[#0459af] hover:bg-[#0459af]/10 dark:text-[#0459af] dark:border-[#0459af] dark:hover:bg-[#0459af]/20"
              >
                Deseleccionar
              </button>
              <button
                type="button"
                disabled={!selectedVessel}
                className="px-6 py-2 text-sm font-medium text-white bg-[#0459af] rounded-lg hover:bg-[#0459af]/90 focus:ring-4 focus:ring-[#0459af]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

