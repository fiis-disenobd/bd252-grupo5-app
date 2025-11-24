"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";

type VoyageStatus = "Navegando" | "En puerto" | "En tránsito";

type Voyage = {
  code: string;
  containers: number;
  status: VoyageStatus;
  progress: number;
  ship: string;
  correctionNote?: string;
};

const voyages: Voyage[] = [
  {
    code: "OPM-2025-001",
    containers: 350,
    status: "Navegando",
    progress: 75,
    ship: "IMO-9347438",
    correctionNote: "Progreso ajustado automáticamente",
  },
  {
    code: "OPM-2025-002",
    containers: 280,
    status: "En puerto",
    progress: 100,
    ship: "IMO-9234567",
  },
  {
    code: "OPM-2025-003",
    containers: 420,
    status: "En tránsito",
    progress: 50,
    ship: "IMO-9123456",
    correctionNote: "Contenedores actualizados",
  },
  {
    code: "OPM-2025-004",
    containers: 150,
    status: "Navegando",
    progress: 90,
    ship: "IMO-9456789",
  },
  {
    code: "OPM-2025-005",
    containers: 300,
    status: "En puerto",
    progress: 100,
    ship: "IMO-9567890",
    correctionNote: "Estado actualizado a En Puerto",
  },
];

const statusBadgeClasses: Record<VoyageStatus, string> = {
  Navegando: "bg-blue-100 text-blue-800",
  "En puerto": "bg-emerald-100 text-emerald-700",
  "En tránsito": "bg-amber-100 text-amber-800",
};

const PAGE_SIZE = 3;

export default function DashboardOperacionesMaritimas() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [correctionFilter, setCorrectionFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVoyages = useMemo(() => {
    return voyages.filter((voyage) => {
      const matchesSearch =
        !search.trim() ||
        voyage.code.toLowerCase().includes(search.toLowerCase()) ||
        voyage.ship.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "navegando" && voyage.status === "Navegando") ||
        (statusFilter === "puerto" && voyage.status === "En puerto") ||
        (statusFilter === "transito" && voyage.status === "En tránsito");

      const matchesCorrection =
        !correctionFilter ||
        (correctionFilter === "progreso" &&
          voyage.correctionNote === "Progreso ajustado automáticamente") ||
        (correctionFilter === "contenedores" &&
          voyage.correctionNote === "Contenedores actualizados") ||
        (correctionFilter === "estado" &&
          voyage.correctionNote === "Estado actualizado a En Puerto") ||
        (correctionFilter === "matricula" && false);

      return matchesSearch && matchesStatus && matchesCorrection;
    });
  }, [search, statusFilter, correctionFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredVoyages.length / PAGE_SIZE));

  const page = Math.min(currentPage, totalPages);
  const startIndex = (page - 1) * PAGE_SIZE;
  const currentVoyages = filteredVoyages.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleExecuteConciliation = () => {
    const ok = window.confirm(
      "¿Desea ejecutar el proceso de conciliación nocturna manualmente? Esto puede tomar varios minutos.",
    );
    if (ok) {
      window.alert(
        "Proceso de conciliación iniciado. Recibirá una notificación cuando finalice.",
      );
      // Aquí iría la llamada real al endpoint POST /operaciones-maritimas/conciliacion-nocturna
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setCorrectionFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa] text-gray-900">
      <Header />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 md:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            <span className="text-[#e54c2a]">Operaciones</span> marítimas
          </h1>
        </header>

        {/* Métricas */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border-l-4 border-[#e54c2a] bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Operaciones</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {voyages.length}
            </p>
            <p className="mt-1 text-xs text-emerald-600">↑ 2 desde ayer</p>
          </article>

          <article className="rounded-lg border-l-4 border-emerald-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Correcciones Aplicadas (24h)
            </p>
            <p className="mt-1 text-3xl font-bold text-gray-900">12</p>
            <p className="mt-1 text-xs text-gray-600">
              Última ejecución: 02:00 AM
            </p>
          </article>

          <article className="rounded-lg border-l-4 border-amber-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Requieren Atención</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">2</p>
            <p className="mt-1 text-xs text-gray-600">Discrepancias detectadas</p>
          </article>

          <article className="rounded-lg border-l-4 border-sky-500 bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">Tasa de Conciliación</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">94%</p>
            <p className="mt-1 text-xs text-emerald-600">
              ↑ 3% vs semana anterior
            </p>
          </article>
        </section>

        {/* Controles */}
        <section className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar operaciones por código o buque"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExecuteConciliation}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700"
            >
              <span>🔄</span>
              <span>Ejecutar Conciliación</span>
            </button>
            <Link
              href="/operaciones-maritimas/nueva"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e54c2a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#c94122]"
            >
              <span>➕</span>
              <span>Nueva Operación Marítima</span>
            </Link>
          </div>
        </section>

        {/* Filtros */}
        <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Estatus Navegación
              </label>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="min-w-[180px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todos</option>
                <option value="navegando">Navegando</option>
                <option value="puerto">En puerto</option>
                <option value="transito">En tránsito</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Tipo de Corrección
              </label>
              <select
                value={correctionFilter}
                onChange={(event) => {
                  setCorrectionFilter(event.target.value);
                  setCurrentPage(1);
                }}
                className="min-w-[200px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                <option value="progreso">Ajuste de progreso</option>
                <option value="contenedores">Actualización contenedores</option>
                <option value="estado">Cambio de estado</option>
                <option value="matricula">Corrección matrícula</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">
                Período
              </label>
              <select className="min-w-[160px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500">
                <option value="hoy">Hoy</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="ml-auto inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <span>🗑️</span>
              <span>Limpiar filtros</span>
            </button>
          </div>
        </section>

        {/* Tabla */}
        <section className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-700">
                <tr>
                  <th className="px-4 py-3">Código</th>
                  <th className="px-4 py-3">Contenedores</th>
                  <th className="px-4 py-3">Estatus</th>
                  <th className="px-4 py-3">Progreso</th>
                  <th className="px-4 py-3">Matrícula</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {currentVoyages.map((voyage) => {
                  const badgeClass = statusBadgeClasses[voyage.status];
                  return (
                    <tr key={voyage.code} className="hover:bg-gray-50">
                      <td className="px-4 py-3 align-top text-sm font-semibold text-gray-900">
                        <div>{voyage.code}</div>
                        {voyage.correctionNote && (
                          <div className="mt-1 inline-flex items-center gap-2 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-800">
                            <span>⚠️</span>
                            <span>{voyage.correctionNote}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {voyage.containers}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeClass}`}
                        >
                          {voyage.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-28 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-sky-500"
                              style={{ width: `${voyage.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-800">
                            {voyage.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {voyage.ship}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-sm font-medium text-sky-600 hover:underline">
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {currentVoyages.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No se encontraron operaciones con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <footer className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3 text-sm text-gray-600 md:flex-row">
            <span>
              Mostrando {currentVoyages.length} de {filteredVoyages.length} operaciones
            </span>
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
              >
                {"<"}
              </button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === page;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`flex h-8 w-8 items-center justify-center rounded border text-sm ${isActive
                        ? "border-[#e54c2a] bg-[#e54c2a] font-semibold text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
              >
                {">"}
              </button>
            </div>
          </footer>
        </section>

        <p className="mt-4 text-center text-xs text-gray-500">
          Última actualización: 23 Nov 2025, 14:35 PM | Próxima conciliación
          automática: Hoy 02:00 AM
        </p>
      </main>
    </div>
  );
}
