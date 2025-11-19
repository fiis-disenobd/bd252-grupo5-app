"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Entrega {
  id_entrega: string;
  codigo: string;
  fecha_entrega: string;
  lugar_entrega: string;
  id_estado_entrega: string;
  contenedor: {
    codigo: string;
  };
  importador: {
    razon_social: string;
  };
}

interface EstadoEntrega {
  id_estado_entrega: string;
  nombre: string;
}

export default function EditarEntregaPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [estados, setEstados] = useState<EstadoEntrega[]>([]);
  const [formData, setFormData] = useState({
    id_estado_entrega: "",
    fecha_entrega: "",
    lugar_entrega: "",
  });

  useEffect(() => {
    // Cargar estados
    fetch("http://localhost:3001/monitoreo/entregas/estados")
      .then((res) => res.json())
      .then((data) => setEstados(data))
      .catch((err) => console.error("Error cargando estados:", err));

    // Cargar entrega
    fetch(`http://localhost:3001/monitoreo/entregas/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Entrega no encontrada");
        return res.json();
      })
      .then((data) => {
        setEntrega(data);
        setFormData({
          id_estado_entrega: data.id_estado_entrega,
          fecha_entrega: data.fecha_entrega,
          lugar_entrega: data.lugar_entrega,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando entrega:", err);
        setLoading(false);
        alert("Error al cargar la entrega");
        router.push("/monitoreo/entregas");
      });
  }, [params.id, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    fetch(`http://localhost:3001/monitoreo/entregas/${params.id}`, {
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
        router.push(`/monitoreo/entregas/${params.id}`);
      })
      .catch((err) => {
        console.error("Error al actualizar:", err);
        setSaving(false);
        alert(`Error al actualizar la entrega: ${err.message}`);
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

  if (!entrega) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Editar Entrega</h1>
            <p className="text-sm text-zinc-500">Modifica la información de la entrega {entrega.codigo}</p>
          </div>
          <Link
            href={`/monitoreo/entregas/${params.id}`}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>

        {/* Información no editable */}
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">info</span>
            <h3 className="font-semibold text-blue-900">Información del Registro</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-blue-700">Código de Entrega</p>
              <p className="mt-1 font-mono font-semibold text-blue-900">{entrega.codigo}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-blue-700">Contenedor</p>
              <p className="mt-1 font-semibold text-blue-900">{entrega.contenedor?.codigo}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase text-blue-700">Importador</p>
              <p className="mt-1 font-semibold text-blue-900">{entrega.importador?.razon_social}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-blue-700">
            El código, contenedor e importador no se pueden modificar una vez registrada la entrega.
          </p>
        </div>

        {/* Formulario */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Estado de Entrega */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Estado de la Entrega *
              </label>
              <select
                value={formData.id_estado_entrega}
                onChange={(e) => setFormData({ ...formData, id_estado_entrega: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccione un estado</option>
                {estados.map((estado) => (
                  <option key={estado.id_estado_entrega} value={estado.id_estado_entrega}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Entrega */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Fecha de Entrega *
              </label>
              <input
                type="date"
                value={formData.fecha_entrega}
                onChange={(e) => setFormData({ ...formData, fecha_entrega: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Lugar de Entrega */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Lugar de Entrega *
              </label>
              <input
                type="text"
                value={formData.lugar_entrega}
                onChange={(e) => setFormData({ ...formData, lugar_entrega: e.target.value })}
                required
                placeholder="Ej: Almacén Central - Lima, Perú"
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link
                href={`/monitoreo/entregas/${params.id}`}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
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
