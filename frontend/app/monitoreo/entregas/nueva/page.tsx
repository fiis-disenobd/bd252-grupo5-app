"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Contenedor {
  id_contenedor: string;
  codigo: string;
  tipo_contenedor?: {
    nombre: string;
  };
}

interface Importador {
  id_importador: string;
  razon_social: string;
  ruc: string;
}

export default function NuevaEntregaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [contenedores, setContenedores] = useState<Contenedor[]>([]);
  const [importadores, setImportadores] = useState<Importador[]>([]);
  const [formData, setFormData] = useState({
    id_contenedor: "",
    id_importador: "",
    fecha_entrega: new Date().toISOString().split("T")[0],
    lugar_entrega: "",
  });

  useEffect(() => {
    // Cargar contenedores disponibles
    fetch(`${API_URL}/monitoreo/entregas/contenedores-disponibles`)
      .then((res) => res.json())
      .then((data) => setContenedores(data))
      .catch((err) => console.error("Error cargando contenedores:", err));

    // Cargar importadores
    fetch(`${API_URL}/monitoreo/entregas/importadores`)
      .then((res) => res.json())
      .then((data) => setImportadores(data))
      .catch((err) => console.error("Error cargando importadores:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch(`${API_URL}/monitoreo/entregas`, {
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
        router.push(`/monitoreo/entregas/${data.id_entrega}`);
      })
      .catch((err) => {
        console.error("Error al crear:", err);
        setLoading(false);
        alert(`Error al crear la entrega: ${err.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Registrar Nueva Entrega</h1>
            <p className="text-sm text-zinc-500">Complete la información para registrar una entrega</p>
          </div>
          <Link
            href="/monitoreo/entregas"
            className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Volver
          </Link>
        </div>

        {/* Formulario */}
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contenedor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Contenedor *
              </label>
              <select
                value={formData.id_contenedor}
                onChange={(e) => setFormData({ ...formData, id_contenedor: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccione un contenedor</option>
                {contenedores.map((contenedor) => (
                  <option key={contenedor.id_contenedor} value={contenedor.id_contenedor}>
                    {contenedor.codigo} - {contenedor.tipo_contenedor?.nombre || "N/A"}
                  </option>
                ))}
              </select>
              {contenedores.length === 0 && (
                <p className="mt-1 text-xs text-zinc-500">
                  No hay contenedores disponibles para entrega
                </p>
              )}
            </div>

            {/* Importador */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Importador *
              </label>
              <select
                value={formData.id_importador}
                onChange={(e) => setFormData({ ...formData, id_importador: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccione un importador</option>
                {importadores.map((importador) => (
                  <option key={importador.id_importador} value={importador.id_importador}>
                    {importador.razon_social} - RUC: {importador.ruc}
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

            {/* Nota Informativa */}
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900">Información importante</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    La entrega se creará con estado <strong>"Pendiente"</strong> de forma automática. 
                    Posteriormente podrá actualizar el estado según el progreso de la entrega.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link
                href="/monitoreo/entregas"
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-400/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Registrando...
                  </span>
                ) : (
                  "Registrar Entrega"
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
