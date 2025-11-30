"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

interface Reporte {
  id_reporte: string;
  codigo: string;
  fecha_reporte: string;
  detalle: string;
}

export default function VerReportePage() {
  const params = useParams();
  const router = useRouter();
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/monitoreo/reportes/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Reporte no encontrado");
        return res.json();
      })
      .then((data) => {
        setReporte(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando reporte:", err);
        setLoading(false);
        alert("Error al cargar el reporte");
        router.push("/monitoreo/reportes");
      });
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <MapHeader />
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!reporte) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Detalles del Reporte</h1>
            <p className="text-sm text-zinc-500">Visualiza la información completa del reporte</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/monitoreo/reportes"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver
            </Link>
            <Link
              href={`/monitoreo/reportes/${reporte.id_reporte}/editar`}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar
            </Link>
          </div>
        </div>

        {/* Información del Reporte */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-2xl text-primary">description</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{reporte.codigo}</h2>
              <p className="text-sm text-zinc-500">
                {new Date(reporte.fecha_reporte).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">ID del Reporte</h3>
              <p className="rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-600">
                {reporte.id_reporte}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Código</h3>
              <p className="rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-900">
                {reporte.codigo}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Fecha del Reporte</h3>
              <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900">
                {new Date(reporte.fecha_reporte).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Detalle</h3>
              <div className="rounded-lg bg-zinc-50 p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-900">
                  {reporte.detalle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex gap-3 rounded-lg border border-zinc-200 bg-white p-4">
          <button
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">print</span>
            Imprimir
          </button>
          <button
            onClick={() => alert("Funcionalidad de exportación próximamente")}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Exportar PDF
          </button>
        </div>
      </main>
    </div>
  );
}
