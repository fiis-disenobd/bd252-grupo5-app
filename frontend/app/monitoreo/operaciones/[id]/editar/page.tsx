"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface FormData {
  codigo: string;
  fecha_inicio: string;
  fecha_fin: string;
  id_estado_operacion: string;
  descripcion: string;
}

export default function EditarOperacionPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [estados, setEstados] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>({
    codigo: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_estado_operacion: "",
    descripcion: "",
  });

  useEffect(() => {
    // Cargar estados
    fetch("http://localhost:3001/monitoreo/estados")
      .then((res) => res.json())
      .then((data) => setEstados(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error cargando estados:", err));

    // Cargar operación
    if (params.id) {
      fetch(`http://localhost:3001/monitoreo/operaciones/${params.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Operación no encontrada");
          return res.json();
        })
        .then((data) => {
          setFormData({
            codigo: data.codigo,
            fecha_inicio: data.fecha_inicio ? data.fecha_inicio.slice(0, 16) : "",
            fecha_fin: data.fecha_fin ? data.fecha_fin.slice(0, 16) : "",
            id_estado_operacion: data.estado_operacion?.id_estado_operacion || "",
            descripcion: data.descripcion || "",
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error:", err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:3001/monitoreo/operaciones/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/monitoreo/operaciones/${params.id}`);
      } else {
        alert("Error al actualizar la operación");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al actualizar la operación");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-zinc-600">Cargando...</p>
            </div>
          </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
          {/* Header */}
          <div className="mb-6">
            <Link
              href={`/monitoreo/operaciones/${params.id}`}
              className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Detalle
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900">Editar Operación</h1>
            <p className="mt-1 text-sm text-zinc-500">Modifica los datos de la operación</p>
          </div>

          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 p-6">
                <h2 className="text-lg font-bold text-zinc-900">Información de la Operación</h2>
                <p className="text-sm text-zinc-500">Completa los datos requeridos</p>
              </div>

              <div className="space-y-6 p-6">
                {/* Código */}
                <div>
                  <label htmlFor="codigo" className="mb-2 block text-sm font-semibold text-zinc-900">
                    Código de Operación <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="codigo"
                    required
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Ej: OP-2024-001"
                  />
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="fecha_inicio" className="mb-2 block text-sm font-semibold text-zinc-900">
                      Fecha de Inicio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      id="fecha_inicio"
                      required
                      value={formData.fecha_inicio}
                      onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                      className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="fecha_fin" className="mb-2 block text-sm font-semibold text-zinc-900">
                      Fecha de Fin
                    </label>
                    <input
                      type="datetime-local"
                      id="fecha_fin"
                      value={formData.fecha_fin}
                      onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                      className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="estado" className="mb-2 block text-sm font-semibold text-zinc-900">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="estado"
                    required
                    value={formData.id_estado_operacion}
                    onChange={(e) => setFormData({ ...formData, id_estado_operacion: e.target.value })}
                    className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-4 text-sm text-zinc-900 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Selecciona un estado</option>
                    {estados.map((estado) => (
                      <option key={estado.id_estado_operacion} value={estado.id_estado_operacion}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="descripcion" className="mb-2 block text-sm font-semibold text-zinc-900">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition-colors placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Describe los detalles de la operación..."
                  />
                </div>
              </div>

              {/* Footer con botones */}
              <div className="flex items-center justify-end gap-3 border-t border-zinc-200 p-6">
                <Link
                  href={`/monitoreo/operaciones/${params.id}`}
                  className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">save</span>
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </main>
    </div>
  );
}
