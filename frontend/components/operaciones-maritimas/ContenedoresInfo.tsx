"use client";

import { useEffect, useState } from "react";

interface Contenedor {
  id_contenedor: string;
  codigo: string;
  peso: number;
  capacidad: number;
  dimensiones: string;
  estado_contenedor?: {
    nombre: string;
  };
  tipo_contenedor?: {
    nombre: string;
  };
  mercancia?: string | null;
}

interface ContenedoresInfoProps {
  selectedIdsParam?: string;
}

export function ContenedoresInfo({ selectedIdsParam }: ContenedoresInfoProps) {
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchContenedores = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:3001/operaciones-maritimas/contenedores"
        );
        if (!res.ok) {
          setContenedores([]);
          return;
        }
        const data = await res.json();
        setContenedores(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error cargando contenedores para info:", error);
        setContenedores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContenedores();
  }, []);

  const selectedIds = new Set(
    (selectedIdsParam || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  );

  const seleccionados =
    contenedores.filter((c) => selectedIds.has(c.id_contenedor)).slice(0, 5);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-slate-700 dark:text-gray-400">
          <tr>
            <th className="px-6 py-4" scope="col">
              Código
            </th>
            <th className="px-6 py-4" scope="col">
              Peso (Kg)
            </th>
            <th className="px-6 py-4" scope="col">
              Capacidad (Kg)
            </th>
            <th className="px-6 py-4" scope="col">
              Dimensiones (ft)
            </th>
            <th className="px-6 py-4" scope="col">
              Mercancía
            </th>
            <th className="px-6 py-4" scope="col">
              Estado
            </th>
            <th className="px-6 py-4" scope="col">
              Tipo
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                className="px-6 py-6 text-center text-gray-600 dark:text-gray-400"
                colSpan={7}
              >
                Cargando contenedores...
              </td>
            </tr>
          ) : seleccionados.length === 0 ? (
            <tr className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50">
              <td
                className="px-6 py-6 text-center text-gray-600 dark:text-gray-400"
                colSpan={7}
              >
                Sin contenedores seleccionados aún
              </td>
            </tr>
          ) : (
            seleccionados.map((container) => (
              <tr
                key={container.id_contenedor}
                className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {container.codigo}
                </td>
                <td className="px-6 py-4">{container.peso}</td>
                <td className="px-6 py-4">{container.capacidad}</td>
                <td className="px-6 py-4">{container.dimensiones}</td>
                <td className="px-6 py-4">{container.mercancia || "-"}</td>
                <td className="px-6 py-4">
                  {container.estado_contenedor?.nombre || "-"}
                </td>
                <td className="px-6 py-4">
                  {container.tipo_contenedor?.nombre || "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
