"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface EstadoContenedor {
  id_estado_contenedor: string;
  nombre: string;
}

interface TipoContenedor {
  id_tipo_contenedor: string;
  nombre: string;
}

export default function NuevoContenedorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState<EstadoContenedor[]>([]);
  const [tipos, setTipos] = useState<TipoContenedor[]>([]);
  const [formData, setFormData] = useState({
    codigo: "",
    peso: "",
    capacidad: "",
    dimensiones: "",
    id_estado_contenedor: "",
    id_tipo_contenedor: "",
  });

  useEffect(() => {
    // Cargar estados y tipos de contenedor
    fetch("http://localhost:3001/monitoreo/contenedores/estados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEstados(data);
      })
      .catch((err) => console.error("Error cargando estados de contenedor:", err));

    fetch("http://localhost:3001/monitoreo/contenedores/tipos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTipos(data);
      })
      .catch((err) => console.error("Error cargando tipos de contenedor:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      codigo: formData.codigo,
      peso: Number(formData.peso) || 0,
      capacidad: Number(formData.capacidad) || 0,
      dimensiones: formData.dimensiones,
      id_estado_contenedor: formData.id_estado_contenedor,
      id_tipo_contenedor: formData.id_tipo_contenedor,
    };

    fetch("http://localhost:3001/monitoreo/contenedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
        if (data?.id_contenedor) {
          router.push(`/monitoreo/contenedores/${data.id_contenedor}`);
        } else {
          router.push("/monitoreo/contenedores");
        }
      })
      .catch((err) => {
        console.error("Error al crear contenedor:", err);
        setLoading(false);
        alert(`Error al crear el contenedor: ${err.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Registrar Nuevo Contenedor</h1>
            <p className="text-sm text-zinc-500">
              Complete la información para registrar un nuevo contenedor en el sistema
            </p>
          </div>
          <Link
            href="/monitoreo/contenedores"
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Código */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Código del Contenedor *
                </label>
                <input
                  type="text"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  required
                  placeholder="Ej: HLXU1234567"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Tipo de Contenedor */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Tipo de Contenedor *
                </label>
                <select
                  value={formData.id_tipo_contenedor}
                  onChange={(e) => setFormData({ ...formData, id_tipo_contenedor: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seleccionar tipo</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id_tipo_contenedor} value={tipo.id_tipo_contenedor}>
                      {tipo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Peso */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Peso (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.peso}
                  onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Capacidad */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Capacidad (kg) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.capacidad}
                  onChange={(e) => setFormData({ ...formData, capacidad: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Dimensiones */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Dimensiones *
                </label>
                <input
                  type="text"
                  value={formData.dimensiones}
                  onChange={(e) => setFormData({ ...formData, dimensiones: e.target.value })}
                  required
                  placeholder="Ej: 20ft x 8ft x 8.6ft"
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Estado del Contenedor *
                </label>
                <select
                  value={formData.id_estado_contenedor}
                  onChange={(e) => setFormData({ ...formData, id_estado_contenedor: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado) => (
                    <option key={estado.id_estado_contenedor} value={estado.id_estado_contenedor}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/monitoreo/contenedores"
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Guardando...
                  </span>
                ) : (
                  "Registrar Contenedor"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
