"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Reporte {
  id_reporte: string;
  codigo: string;
  fecha_reporte: string;
  detalle: string;
}

export default function EditarReportePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [formData, setFormData] = useState({
    detalle: "",
    fecha_reporte: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3001/monitoreo/reportes/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Reporte no encontrado");
        return res.json();
      })
      .then((data) => {
        setReporte(data);
        setFormData({
          detalle: data.detalle,
          fecha_reporte: data.fecha_reporte,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando reporte:", err);
        setLoading(false);
        alert("Error al cargar el reporte");
        router.push("/monitoreo/reportes");
      });
  }, [params.id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    fetch(`http://localhost:3001/monitoreo/reportes/${params.id}`, {
      method: "PUT",
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
      .then(() => {
        setSaving(false);
        router.push(`/monitoreo/reportes/${params.id}`);
      })
      .catch((err) => {
        console.error("Error al actualizar:", err);
        setSaving(false);
        alert(`Error al actualizar el reporte: ${err.message}`);
      });
  };

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

      <main className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Editar Reporte</h1>
            <p className="text-sm text-zinc-500">Modifica la información del reporte {reporte.codigo}</p>
          </div>
          <Link
            href={`/monitoreo/reportes/${params.id}`}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg bg-zinc-50 p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span className="material-symbols-outlined text-lg">info</span>
                <div>
                  <p className="font-medium">Código del reporte: {reporte.codigo}</p>
                  <p className="text-xs">Este campo no se puede modificar</p>
                </div>
              </div>
            </div>

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
                href={`/monitoreo/reportes/${params.id}`}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </span>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
