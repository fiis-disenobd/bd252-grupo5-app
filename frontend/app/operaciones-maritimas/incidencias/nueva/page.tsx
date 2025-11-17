"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";

const defaultOperation = "OP-2024-002";

export default function NuevaIncidenciaPage() {
  const params = useSearchParams();
  const operationCode = useMemo(
    () => params.get("op") ?? defaultOperation,
    [params],
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111827] dark:bg-[#0f1923] dark:text-[#f3f4f6]">
      <Header />
      <main className="container mx-auto flex flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <header className="mb-8">
            <h2 className="text-3xl font-bold">Agregar Incidencia</h2>
            <p className="mt-1 text-[#6b7280] dark:text-[#9ca3af]">
              Operación:{" "}
              <span className="font-semibold text-[#111827] dark:text-[#f3f4f6]">
                {operationCode}
              </span>{" "}
              | Gestiona las{" "}
              <span className="text-[#f97316] underline decoration-[#f97316]/50 decoration-2 underline-offset-2">
                operaciones marítimas
              </span>
              .
            </p>
          </header>

          <section className="rounded-xl border border-[#e5e7eb] bg-white shadow-md dark:border-[#374151] dark:bg-[#1a2a3a]">
            <div className="p-6 sm:p-8">
              <h3 className="mb-6 text-xl font-semibold">
                Formulario de Registro de Incidencia
              </h3>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#6b7280] dark:text-[#9ca3af]"
                  >
                    Descripción de la Incidencia
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Describa detalladamente la incidencia..."
                    className="mt-1 block w-full rounded-lg border border-[#e5e7eb] bg-[#f5f7f8] text-sm text-[#111827] shadow-sm focus:border-[#0459af] focus:outline-none focus:ring-[#0459af] dark:border-[#374151] dark:bg-[#0f1923] dark:text-[#f3f4f6]"
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#6b7280] dark:text-[#9ca3af]">
                    Grado de Severidad
                  </p>
                  <div className="mt-2 space-y-2 sm:flex sm:space-y-0 sm:space-x-4">
                    {["Baja", "Media", "Alta", "Crítica"].map((label) => (
                      <label key={label} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="severity"
                          defaultChecked={label === "Media"}
                          className="h-4 w-4 border-[#e5e7eb] text-[#0459af] focus:ring-[#0459af] dark:border-[#374151]"
                        />
                        <span className="text-sm font-medium text-[#111827] dark:text-[#f3f4f6]">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="incidence-type"
                    className="block text-sm font-medium text-[#6b7280] dark:text-[#9ca3af]"
                  >
                    Tipo de Incidencia
                  </label>
                  <select
                    id="incidence-type"
                    name="incidence-type"
                    className="mt-1 block w-full rounded-lg border border-[#e5e7eb] bg-[#f5f7f8] text-sm text-[#111827] shadow-sm focus:border-[#0459af] focus:outline-none focus:ring-[#0459af] dark:border-[#374151] dark:bg-[#0f1923] dark:text-[#f3f4f6]"
                    defaultValue="Daño a la Carga"
                  >
                    <option>Daño a la Carga</option>
                    <option>Retraso en Operación</option>
                    <option>Falla de Equipo</option>
                    <option>Incidente de Seguridad</option>
                    <option>Problema de Documentación</option>
                    <option>Otro</option>
                  </select>
                </div>
              </form>
            </div>

            <div className="rounded-b-xl border-t border-[#e5e7eb] bg-[#f5f7f8] px-6 py-4 text-sm text-[#6b7280] dark:border-[#374151] dark:bg-[#0f1923] dark:text-[#9ca3af] sm:px-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <p>
                  <span className="font-medium text-[#111827] dark:text-[#f3f4f6]">
                    Fecha y Hora:
                  </span>{" "}
                  18/07/2024 10:30 AM
                </p>
                <p>
                  <span className="font-medium text-[#111827] dark:text-[#f3f4f6]">
                    Registrado por:
                  </span>{" "}
                  Juan Perez (Administrador)
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
            <Link
              href={`/operaciones-maritimas/incidencias?op=${operationCode}`}
              className="rounded-lg border border-[#e5e7eb] px-6 py-2 text-center text-sm font-semibold text-[#111827] transition-colors hover:bg-[#f5f7f8] dark:border-[#374151] dark:text-[#f3f4f6] dark:hover:bg-[#25384f]"
            >
              Volver a Operación
            </Link>
            <Link
              href="/operaciones-maritimas"
              className="rounded-lg border border-[#e5e7eb] px-6 py-2 text-center text-sm font-semibold text-[#991b1b] transition-colors hover:bg-[#fee2e2]/60 dark:border-[#374151] dark:text-[#fecaca] dark:hover:bg-[#991b1b]/30"
            >
              Cancelar
            </Link>
            <button
              type="button"
              className="rounded-lg bg-[#0459af] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0459af]/90"
            >
              Registrar Incidencia
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

