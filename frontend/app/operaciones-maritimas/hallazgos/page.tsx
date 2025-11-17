"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";

type Inspection = {
  id: string;
  type: string;
  date: string;
  time: string;
  priority: "Alta" | "Media" | "Baja";
  operationCode: string;
  inspectionCode: string;
  status: string;
};

const inspections: Inspection[] = [
  {
    id: "insp1",
    type: "Aduanera",
    date: "2024-05-22",
    time: "14:30",
    priority: "Alta",
    operationCode: "OP-56789",
    inspectionCode: "INSP-001",
    status: "Completada",
  },
  {
    id: "insp2",
    type: "Sanitaria",
    date: "2024-05-21",
    time: "10:00",
    priority: "Media",
    operationCode: "OP-12345",
    inspectionCode: "INSP-002",
    status: "Completada",
  },
  {
    id: "insp3",
    type: "Seguridad",
    date: "2024-05-20",
    time: "09:15",
    priority: "Baja",
    operationCode: "OP-98765",
    inspectionCode: "INSP-003",
    status: "Completada",
  },
  {
    id: "insp4",
    type: "Calidad",
    date: "2024-05-19",
    time: "16:45",
    priority: "Alta",
    operationCode: "OP-24680",
    inspectionCode: "INSP-004",
    status: "Completada",
  },
];

const priorityStyles: Record<
  Inspection["priority"],
  { bg: string; text: string }
> = {
  Alta: {
    bg: "bg-[#fee]",
    text: "text-[#b91c1c]",
  },
  Media: {
    bg: "bg-[#fff4e6]",
    text: "text-[#f97316]",
  },
  Baja: {
    bg: "bg-[#e6f0ff]",
    text: "text-[#1d4ed8]",
  },
};

export default function RegistrarHallazgoPage() {
  const [selectedId, setSelectedId] = useState<string>("insp2");
  const [search, setSearch] = useState("");

  const selectedInspection = inspections.find(
    (inspection) => inspection.id === selectedId,
  );

  const filteredInspections = useMemo(() => {
    if (!search.trim()) return inspections;
    const lower = search.toLowerCase();
    return inspections.filter(
      (inspection) =>
        inspection.operationCode.toLowerCase().includes(lower) ||
        inspection.inspectionCode.toLowerCase().includes(lower) ||
        inspection.type.toLowerCase().includes(lower),
    );
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5] text-[#111827] dark:bg-[#0f1923] dark:text-[#f3f4f6]">
      <Header />
      <main className="container mx-auto flex flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="mb-8 text-3xl font-bold text-[#003d6b] dark:text-white">
            Inspecciones Realizadas
          </h1>

          <section className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔍
              </span>
              <input
                type="text"
                className="w-full rounded-lg border border-[#ddd] bg-white py-3 pl-12 pr-4 text-sm text-[#111827] shadow-sm focus:border-[#f97316] focus:outline-none focus:ring-[#f97316]"
                placeholder="Buscar por código de inspección, código de operación..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#003d6b] px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#00538f]"
            >
              <span>☰</span>
              Filtrar
            </button>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-md dark:bg-[#1a2a3a]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="border-b-2 border-[#e0e0e0] text-left text-sm font-semibold text-[#333]">
                  <tr>
                    <th className="w-12" />
                    <th className="px-2 py-3">Tipo de Inspección</th>
                    <th className="px-2 py-3">Fecha</th>
                    <th className="px-2 py-3">Hora</th>
                    <th className="px-2 py-3">Prioridad</th>
                    <th className="px-2 py-3">Código de Operación</th>
                    <th className="px-2 py-3">Código de Inspección</th>
                    <th className="px-2 py-3">Estado de la Inspección</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInspections.map((inspection) => {
                    const priority = priorityStyles[inspection.priority];
                    const isSelected = inspection.id === selectedId;
                    return (
                      <tr
                        key={inspection.id}
                        onClick={() => setSelectedId(inspection.id)}
                        className={`cursor-pointer border-b border-[#f0f0f0] transition-colors hover:bg-[#f9f9f9] ${
                          isSelected ? "bg-[#fff4e6]" : ""
                        }`}
                      >
                        <td className="px-2 py-4 text-center">
                          <input
                            type="radio"
                            name="inspection"
                            className="h-4 w-4 cursor-pointer accent-[#f97316]"
                            checked={isSelected}
                            onChange={() => setSelectedId(inspection.id)}
                          />
                        </td>
                        <td className="px-2 py-4">{inspection.type}</td>
                        <td className="px-2 py-4">{inspection.date}</td>
                        <td className="px-2 py-4">{inspection.time}</td>
                        <td className="px-2 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${priority.bg} ${priority.text}`}
                          >
                            {inspection.priority}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          {inspection.operationCode}
                        </td>
                        <td className="px-2 py-4">
                          {inspection.inspectionCode}
                        </td>
                        <td className="px-2 py-4">
                          <span className="inline-block rounded-full bg-[#d1fae5] px-3 py-1 text-sm font-semibold text-[#059669]">
                            {inspection.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-[#666] sm:flex-row">
              <p>
                Mostrando {filteredInspections.length} de {inspections.length}{" "}
                inspecciones
              </p>
              <div className="flex gap-2">
                {["‹", "1", "2", "3", "›"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`h-10 w-10 rounded-lg border border-[#ddd] transition-colors ${
                      label === "1"
                        ? "bg-[#f97316] text-white border-[#f97316]"
                        : "hover:border-[#f97316] hover:text-[#f97316]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="form-section mt-8 rounded-2xl bg-white p-8 shadow-md dark:bg-[#1a2a3a]">
            <h2 className="mb-6 text-xl font-semibold text-[#003d6b] dark:text-white">
              Registrar Hallazgo para la Inspección{" "}
              {selectedInspection?.inspectionCode ?? ""}
            </h2>

            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="form-group flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#333]">
                    Tipo de Hallazgo
                  </label>
                  <select className="rounded-lg border border-[#ddd] bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none focus:ring-[#f97316]">
                    <option value="falta-permiso">Falta de permiso</option>
                    <option value="documentacion">Documentación incompleta</option>
                    <option value="condiciones">Condiciones inadecuadas</option>
                  </select>
                </div>
                <div className="form-group flex flex-col">
                  <label className="mb-2 text-sm font-medium text-[#333]">
                    Nivel de Gravedad
                  </label>
                  <select className="rounded-lg border border-[#ddd] bg-white px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none focus:ring-[#f97316]">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <option key={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group flex flex-col">
                <label className="mb-2 text-sm font-medium text-[#333]">
                  Descripción
                </label>
                <textarea
                  className="min-h-[120px] rounded-lg border border-[#ddd] px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none focus:ring-[#f97316]"
                  placeholder="Describa detalladamente el hallazgo..."
                />
              </div>

              <div className="form-group flex flex-col">
                <label className="mb-2 text-sm font-medium text-[#333]">
                  Acción Sugerida
                </label>
                <textarea
                  className="min-h-[120px] rounded-lg border border-[#ddd] px-4 py-3 text-sm focus:border-[#f97316] focus:outline-none focus:ring-[#f97316]"
                  placeholder="Describa la acción sugerida para resolver el hallazgo..."
                />
              </div>

              <div className="flex flex-col gap-3 text-sm text-[#666] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Inspección seleccionada:{" "}
                  <strong>{selectedInspection?.inspectionCode}</strong>
                </span>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/operaciones-maritimas"
                    className="rounded-lg bg-[#e5e7eb] px-5 py-2 font-medium text-[#333] transition-colors hover:bg-[#d1d5db]"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="button"
                    className="rounded-lg bg-[#f97316] px-6 py-2 font-semibold text-white transition-colors hover:bg-[#ea580c]"
                  >
                    Registrar Hallazgo
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

