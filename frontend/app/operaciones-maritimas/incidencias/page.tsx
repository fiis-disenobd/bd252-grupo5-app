"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";

type Operation = {
  code: string;
  ship: string;
  type: string;
  status: "Completado" | "En curso" | "Pendiente";
};

const operations: Operation[] = [
  {
    code: "OP-2024-001",
    ship: "MSC Isabella",
    type: "Operación Portuaria",
    status: "Completado",
  },
  {
    code: "OP-2024-002",
    ship: "Evergreen Marine",
    type: "Operación Marítima",
    status: "En curso",
  },
  {
    code: "OP-2024-003",
    ship: "Maersk Line",
    type: "Operación Portuaria",
    status: "Pendiente",
  },
  {
    code: "OP-2024-004",
    ship: "CMA CGM",
    type: "Operación Marítima",
    status: "Completado",
  },
];

const statusBadgeStyles: Record<
  Operation["status"],
  { light: string; dark: string }
> = {
  Completado: {
    light: "bg-[#d1fae5] text-[#065f46]",
    dark: "dark:bg-[#064e3b] dark:text-[#a7f3d0]",
  },
  "En curso": {
    light: "bg-[#fef3c7] text-[#92400e]",
    dark: "dark:bg-[#92400e] dark:text-[#fde68a]",
  },
  Pendiente: {
    light: "bg-[#fee2e2] text-[#991b1b]",
    dark: "dark:bg-[#991b1b] dark:text-[#fecaca]",
  },
};

export default function RegistrarIncidenciaPage() {
  const [selectedCode, setSelectedCode] = useState<string | null>(
    operations[1].code,
  );
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredOperations = useMemo(() => {
    if (!query.trim()) return operations;
    const lower = query.toLowerCase();
    return operations.filter(
      (op) =>
        op.code.toLowerCase().includes(lower) ||
        op.ship.toLowerCase().includes(lower),
    );
  }, [query]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7f8] text-[#111827] dark:bg-[#0f1923] dark:text-[#f3f4f6]">
      <Header />

      <main className="container mx-auto flex flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-6">
            <h2 className="text-3xl font-bold">
              Seleccionar Operación para Incidencia
            </h2>
            <p className="mt-1 text-[#6b7280] dark:text-[#9ca3af]">
              Gestiona las{" "}
              <span className="text-[#f97316] underline decoration-[#f97316]/50 decoration-2 underline-offset-2">
                operaciones marítimas
              </span>{" "}
              y registra incidencias.
            </p>
          </header>

          <section className="rounded-xl bg-white shadow-md dark:bg-[#1a2a3a]">
            <div className="flex flex-col items-center justify-between gap-4 border-b border-[#e5e7eb] p-6 dark:border-[#374151] sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-[#6b7280] dark:text-[#9ca3af]">
                    search
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Buscar operación..."
                  className="w-full rounded-lg border border-[#e5e7eb] bg-[#f5f7f8] py-2 pl-10 pr-4 text-[#111827] focus:border-[#0459af] focus:outline-none focus:ring-[#0459af] dark:border-[#374151] dark:bg-[#0f1923] dark:text-[#f3f4f6]"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 rounded-lg border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#111827] transition-colors hover:bg-[#f5f7f8] dark:border-[#374151] dark:text-[#f3f4f6] dark:hover:bg-[#25384f]"
              >
                <span className="material-symbols-outlined text-base">
                  filter_list
                </span>
                <span>Filtros</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#e5e7eb] dark:divide-[#374151]">
                <thead className="bg-[#f5f7f8] text-xs font-medium uppercase tracking-wider text-[#6b7280] dark:bg-[#111b2c] dark:text-[#9ca3af]">
                  <tr>
                    <th scope="col" className="w-12 px-6 py-3 text-center">
                      <span className="sr-only">Seleccionar</span>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      Código
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      Nombre del Buque
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      Tipo de Operación
                    </th>
                    <th scope="col" className="px-6 py-3 text-left">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] bg-white dark:divide-[#374151] dark:bg-[#1a2a3a]">
                  {filteredOperations.map((operation) => {
                    const isSelected = selectedCode === operation.code;
                    const badge = statusBadgeStyles[operation.status];
                    return (
                      <tr
                        key={operation.code}
                        className={`cursor-pointer transition-colors hover:bg-[#f5f7f8] dark:hover:bg-[#25384f] ${isSelected ? "bg-[#0459af]/10 dark:bg-[#0459af]/20" : ""}`}
                        onClick={() => setSelectedCode(operation.code)}
                      >
                        <td className="px-6 py-4 text-center">
                          <input
                            type="radio"
                            name="select-operation"
                            className="h-4 w-4 cursor-pointer text-[#0459af] focus:ring-[#0459af]"
                            checked={isSelected}
                            onChange={() => setSelectedCode(operation.code)}
                          />
                        </td>
                        <td
                          className={`px-6 py-4 text-sm font-medium ${isSelected ? "text-[#0459af]" : ""}`}
                        >
                          {operation.code}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm ${isSelected ? "text-[#0459af]" : "text-[#6b7280] dark:text-[#9ca3af]"}`}
                        >
                          {operation.ship}
                        </td>
                        <td
                          className={`px-6 py-4 text-sm ${isSelected ? "text-[#0459af]" : "text-[#6b7280] dark:text-[#9ca3af]"}`}
                        >
                          {operation.type}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${badge.light} ${badge.dark}`}
                          >
                            {operation.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <footer className="flex flex-col items-center justify-between gap-4 border-t border-[#e5e7eb] px-6 py-4 text-sm text-[#6b7280] dark:border-[#374151] dark:text-[#9ca3af] sm:flex-row">
              <p>
                Mostrando {filteredOperations.length} de {operations.length}{" "}
                operaciones
              </p>
              <div className="flex space-x-1">
                {["<", "1", "2", "3", ">"].map((item, index) => {
                  const isActive = item === "1";
                  return (
                    <button
                      key={`${item}-${index}`}
                      type="button"
                      className={`rounded-lg border px-3 py-1 transition-colors ${
                        isActive
                          ? "border-[#0459af] bg-[#0459af] text-white"
                          : "border-[#e5e7eb] text-[#374151] hover:bg-[#f5f7f8] dark:border-[#374151] dark:text-[#f3f4f6] dark:hover:bg-[#25384f]"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </footer>
          </section>

          <div className="mt-8 flex flex-col justify-end gap-4 sm:flex-row">
            <Link
              href="/operaciones-maritimas"
              className="rounded-lg border border-[#e5e7eb] px-6 py-2 text-center text-sm font-semibold text-[#111827] transition-colors hover:bg-[#f5f7f8] dark:border-[#374151] dark:text-[#f3f4f6] dark:hover:bg-[#25384f]"
            >
              Cancelar / Volver
            </Link>
            <button
              type="button"
              disabled={!selectedCode}
              onClick={() => {
                if (!selectedCode) return;
                const params = new URLSearchParams({ op: selectedCode });
                router.push(
                  `/operaciones-maritimas/incidencias/nueva?${params.toString()}`,
                );
              }}
              className="rounded-lg bg-[#0459af] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0459af]/90 disabled:cursor-not-allowed disabled:bg-[#0459af]/40"
            >
              Registrar Incidencia
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

