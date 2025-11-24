"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Contenedor {
  id_contenedor: string;
  codigo: string;
  capacidad: number;
  dimensiones: string;
  estado_contenedor?: {
    nombre: string;
  };
  tipo_contenedor?: {
    nombre: string;
  };
  cliente?: string | null;
  mercancia?: string | null;
}

export default function GestionarContenedoresPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedContainers, setSelectedContainers] = useState<Set<string>>(
    new Set()
  );
  const [selectAll, setSelectAll] = useState(false);
  const [containers, setContainers] = useState<Contenedor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [filtroMercancia, setFiltroMercancia] = useState<string>("");
  const [filtroCliente, setFiltroCliente] = useState<string>("");
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const elementosPorPagina = 10;

  const getEstadoStyles = (estado?: string) => {
    const base =
      "px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";

    if (!estado) return base;

    const key = estado.toLowerCase();

    if (key === "disponible")
      return "px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (key === "en transito" || key === "en tránsito")
      return "px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (key === "en puerto")
      return "px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";

    return base;
  };

  useEffect(() => {
    // Restaurar selección desde localStorage
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(
        "operacion-maritima-contenedores"
      );
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored);
          if (Array.isArray(ids)) {
            setSelectedContainers(new Set(ids));
          }
        } catch (e) {
          console.error("Error parseando selección de contenedores:", e);
        }
      }
    }

    const fetchContenedores = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:3001/operaciones-maritimas/contenedores"
        );
        if (!res.ok) {
          setContainers([]);
          return;
        }
        const data = await res.json();
        const lista = Array.isArray(data) ? data : [];
        setContainers(lista);
      } catch (error) {
        console.error("Error cargando contenedores:", error);
        setContainers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContenedores();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [filtroEstado, filtroMercancia, filtroCliente]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedContainers(new Set(containers.map((c) => c.id_contenedor)));
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
    setSelectAll(newSelected.size === containers.length && containers.length > 0);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "operacion-maritima-contenedores",
        JSON.stringify(Array.from(newSelected))
      );
    }
  };

  const handleDeselectAll = () => {
    setSelectedContainers(new Set());
    setSelectAll(false);
  };

  const filteredContainers = containers.filter((c) => {
    const estadoOk =
      !filtroEstado ||
      c.estado_contenedor?.nombre?.toLowerCase() ===
        filtroEstado.toLowerCase();

    const mercanciaOk =
      !filtroMercancia ||
      (c.mercancia || "")
        .toLowerCase()
        .includes(filtroMercancia.toLowerCase());

    const clienteOk =
      !filtroCliente ||
      c.cliente?.toLowerCase() === filtroCliente.toLowerCase();

    return estadoOk && mercanciaOk && clienteOk;
  });

  const totalPaginas =
    Math.ceil(filteredContainers.length / elementosPorPagina) || 1;

  const paginaSegura = Math.min(paginaActual, totalPaginas);
  const inicio = (paginaSegura - 1) * elementosPorPagina;
  const fin = inicio + elementosPorPagina;
  const contenedoresPagina = filteredContainers.slice(inicio, fin);

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
                  <select
                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                  >
                    <option value="">Estado</option>
                    <option value="En Tránsito">En Tránsito</option>
                    <option value="En Puerto">En Puerto</option>
                    <option value="En Aduana">En Aduana</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent"
                    value={filtroMercancia}
                    onChange={(e) => setFiltroMercancia(e.target.value)}
                  >
                    <option value="">Mercancía</option>
                    <option value="Alimentos Congelados">Alimentos Congelados</option>
                    <option value="Electrónicos">Electrónicos</option>
                    <option value="Químicos">Químicos</option>
                    <option value="Frutas">Frutas</option>
                  </select>
                </div>
                <div>
                  <select
                    className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-[#0459af] focus:border-transparent"
                    value={filtroCliente}
                    onChange={(e) => setFiltroCliente(e.target.value)}
                  >
                    <option value="">Cliente</option>
                    <option value="Global Exports Inc.">Global Exports Inc.</option>
                    <option value="Oceanic Trading Co.">Oceanic Trading Co.</option>
                    <option value="Chemical Solutions Ltd.">Chemical Solutions Ltd.</option>
                    <option value="AgriProducts Corp.">AgriProducts Corp.</option>
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
                {loading ? (
                  <tr>
                    <td
                      className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                      colSpan={9}
                    >
                      Cargando contenedores...
                    </td>
                  </tr>
                ) : filteredContainers.length === 0 ? (
                  <tr>
                    <td
                      className="px-6 py-6 text-center text-gray-500 dark:text-gray-400"
                      colSpan={9}
                    >
                      No hay contenedores disponibles.
                    </td>
                  </tr>
                ) : (
                  contenedoresPagina.map((container) => (
                    <tr
                      key={container.id_contenedor}
                      className="bg-white dark:bg-slate-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <input
                          className="h-4 w-4 rounded border-gray-300 text-[#0459af] focus:ring-[#0459af] dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-[#0459af] dark:ring-offset-gray-900"
                          type="checkbox"
                          checked={selectedContainers.has(container.id_contenedor)}
                          onChange={(e) =>
                            handleSelectContainer(
                              container.id_contenedor,
                              e.target.checked
                            )
                          }
                        />
                      </td>
                      <th
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                        scope="row"
                      >
                        {container.codigo}
                      </th>
                      <td className="px-6 py-4">
                        {container.tipo_contenedor?.nombre || "-"}
                      </td>
                      <td className="px-6 py-4">{container.capacidad}</td>
                      <td className="px-6 py-4">
                        {container.cliente || "-"}
                      </td>
                      <td className="px-6 py-4">-</td>
                      <td className="px-6 py-4">{container.dimensiones}</td>
                      <td className="px-6 py-4">
                        <span
                          className={getEstadoStyles(
                            container.estado_contenedor?.nombre
                          )}
                        >
                          {container.estado_contenedor?.nombre || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {container.mercancia || "-"}
                      </td>
                    </tr>
                  ))
                )}
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
              <span>
                Página {paginaSegura} de {totalPaginas}
              </span>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={paginaSegura <= 1}
                onClick={() =>
                  setPaginaActual((prev) => Math.max(1, prev - 1))
                }
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <button
                type="button"
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={paginaSegura >= totalPaginas}
                onClick={() =>
                  setPaginaActual((prev) =>
                    Math.min(totalPaginas, prev + 1),
                  )
                }
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
          className="px-4 py-2 bg-[#0459af] text-white rounded-lg hover:bg-[#0459af]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedContainers.size === 0}
          onClick={() => {
            const ids = Array.from(selectedContainers);
            const params = new URLSearchParams(searchParams.toString());
            if (ids.length > 0) {
              params.set("contenedores", ids.join(","));
            } else {
              params.delete("contenedores");
            }
            const qs = params.toString();
            const href = qs
              ? `/operaciones-maritimas/nueva?${qs}`
              : "/operaciones-maritimas/nueva";
            router.push(href);
          }}
        >
          Confirmar Asignación
        </button>
      </footer>
    </div>
  );
}

