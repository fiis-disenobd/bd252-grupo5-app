"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"; 

export default function NuevoReportePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    detalle: "",
    fecha_reporte: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch(`${API_URL}/monitoreo/reportes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            throw new Error(err.message || "Error del servidor");
          });
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        router.push(`/monitoreo/reportes/${data.id_reporte}`);
      })
      .catch((err) => {
        console.error("Error al crear:", err);
        setLoading(false);
        alert(`Error al crear el reporte: ${err.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Nuevo Reporte</h1>
            <p className="text-sm text-zinc-500">Crea un nuevo reporte del sistema</p>
          </div>
          <Link
            href="/monitoreo/reportes"
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Fecha del Reporte *
              </label>
              <input
                type="date"
                value={formData.fecha_reporte}
                onChange={(e) => setFormData({ ...formData, fecha_reporte: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Detalle del Reporte *
              </label>
              <textarea
                value={formData.detalle}
                onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                required
                rows={10}
                placeholder="Describe el contenido del reporte de manera detallada..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1 text-xs text-zinc-500">
                {formData.detalle.length} caracteres
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/monitoreo/reportes"
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-primary px-4 py-2 bg-orange-600 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Creando...
                  </span>
                ) : (
                  "Crear Reporte"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
