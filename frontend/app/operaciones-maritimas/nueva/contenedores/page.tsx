"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function GestionarContenedoresPage() {
  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);

  const containers = [
    {
      id: "CNTR001",
      tipo: "Refrigerado",
      capacidad: "20 pies",
      cliente: "Global Exports Inc.",
      destino: "Hamburgo",
      dimensiones: "20x8x8.5",
      estado: "En Tránsito",
      estadoColor: "blue",
      mercancia: "Alimentos Congelados",
    },
    {
      id: "CNTR002",
      tipo: "Seco",
      capacidad: "40 pies",
      cliente: "Oceanic Trading Co.",
      destino: "Hamburgo",
      dimensiones: "40x8x8.5",
      estado: "En Puerto",
      estadoColor: "green",
      mercancia: "Electrónicos",
    },
    {
      id: "CNTR003",
      tipo: "Tanque",
      capacidad: "20 pies",
      cliente: "Chemical Solutions Ltd.",
      destino: "Amberes",
      dimensiones: "20x8x8.5",
      estado: "En Tránsito",
      estadoColor: "blue",
      mercancia: "Químicos",
    },
    {
      id: "CNTR004",
      tipo: "Refrigerado",
      capacidad: "40 pies",
      cliente: "AgriProducts Corp.",
      destino: "Valencia",
      dimensiones: "40x8x8.5",
      estado: "En Puerto",
      estadoColor: "green",
      mercancia: "Frutas",
    },
  ];

  const getEstadoStyles = (color: string) => {
    const styles = {
      blue: "px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      green:
        "px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return styles[color as keyof typeof styles] || styles.blue;
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedContainers(new Set(containers.map((c) => c.id)));
    } else {
      setSelectedContainers(new Set());
    }
  };

  const handleSelectContainer = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedContainers);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedContainers(newSelected);
    setSelectAll(newSelected.size === containers.length);
  };

  const handleDeselectAll = () => {
    setSelectedContainers(new Set());
    setSelectAll(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923] font-display">
      <Header />
      <main className="flex-grow flex flex-col p-4 lg:p-8 gap-8">
        <div className="flex-grow flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Gestionar Contenedores Asignados
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Contenedores con destinos en la ruta Rotterdam-Hamburgo con
                  puertos intermedios en Amberes y Valencia
                </p>
              </div>
              <span className="font-semibold text-[#0459af]">
                Operación #12345
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <div className="relative flex-grow min-w-[200px]">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#0459af] focus:border-transparent"
                  placeholder="Buscar por Nº de Contenedor..."
                  type="text"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <select className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent">
                    <option selected>Estado</option>
                    <option>En Tránsito</option>
                    <option>En Puerto</option>
                    <option>En Aduana</option>
                  </select>
                </div>
                <div>
                  <select className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent">
                    <option selected>Mercancía</option>
                    <option>Alimentos Congelados</option>
                    <option>Electrónicos</option>
                    <option>Químicos</option>
                    <option>Frutas</option>
                  </select>
                </div>
                <div>
                  <select className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent">
                    <option selected>Cliente</option>
                    <option>Global Exports Inc.</option>
                    <option>Oceanic Trading Co.</option>
                    <option>Chemical Solutions Ltd.</option>
                    <option>AgriProducts Corp.</option>
                  </select>
                </div>
                <div>
                  <select className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent">
                    <option selected>Destino</option>
                    <option>Rotterdam</option>
                    <option>Hamburgo</option>
                    <option>Amberes</option>
                    <option>Valencia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3" scope="col">
                    <input
                      className="h-4 w-4 rounded border-gray-300 text-[#0459af] focus:ring-[#0459af] dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-[#0459af] dark:ring-offset-gray-900"
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Nº Contenedor
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Tipo
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Capacidad
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Cliente
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Destino
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Dimensiones
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Estado
                  </th>
                  <th className="px-6 py-3" scope="col">
                    Mercancía
                  </th>
                </tr>
              </thead>
              <tbody>
                {containers.map((container) => (
                  <tr
                    key={container.id}
                    className="bg-white dark:bg-slate-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <input
                        className="h-4 w-4 rounded border-gray-300 text-[#0459af] focus:ring-[#0459af] dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-[#0459af] dark:ring-offset-gray-900"
                        type="checkbox"
                        checked={selectedContainers.has(container.id)}
                        onChange={(e) =>
                          handleSelectContainer(container.id, e.target.checked)
                        }
                      />
                    </td>
                    <th
                      className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      scope="row"
                    >
                      {container.id}
                    </th>
                    <td className="px-6 py-4">{container.tipo}</td>
                    <td className="px-6 py-4">{container.capacidad}</td>
                    <td className="px-6 py-4">{container.cliente}</td>
                    <td className="px-6 py-4">{container.destino}</td>
                    <td className="px-6 py-4">{container.dimensiones}</td>
                    <td className="px-6 py-4">
                      <span className={getEstadoStyles(container.estadoColor)}>
                        {container.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4">{container.mercancia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleDeselectAll}
                disabled={selectedContainers.size === 0}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">delete</span>
                Desasignar todo lo seleccionado
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Página 1 de 10</span>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 flex justify-end gap-3 bg-white dark:bg-slate-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 sticky bottom-0">
        <Link
          href="/operaciones-maritimas/nueva"
          className="px-4 py-2 text-[#0459af] dark:text-[#0459af] border border-[#0459af] rounded-lg hover:bg-[#0459af]/10"
        >
          Volver a Editar Operación
        </Link>
        <button
          type="button"
          className="px-4 py-2 bg-[#0459af] text-white rounded-lg hover:bg-[#0459af]/90"
        >
          Confirmar Asignación
        </button>
      </footer>
    </div>
  );
}

