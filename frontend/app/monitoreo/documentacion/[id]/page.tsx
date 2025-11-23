"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Documento {
  id_documentacion: string;
  codigo: string;
  nombre: string;
  fecha_emision: string;
  tipo_documento?: {
    nombre: string;
  };
}

export default function DocumentacionDetallePage() {
  const params = useParams();
  const [documento, setDocumento] = useState<Documento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    fetch(`http://localhost:3001/monitoreo/documentacion/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error al cargar documentación: ${res.status}`);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        setDocumento(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando documentación:", err);
        setError("No se pudo cargar la información de la documentación");
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="text-zinc-600">Cargando información de la documentación...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !documento) {
    return (
      <div className="flex h-screen w-full flex-col overflow-hidden">
        <MapHeader />
        <main className="flex flex-1 items-center justify-center bg-zinc-50">
          <div className="text-center">
            <span className="material-symbols-outlined mb-4 text-6xl text-zinc-300">description</span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900">Documentación no encontrada</h2>
            <p className="mb-4 text-zinc-600">{error || "La documentación solicitada no existe"}</p>
            <Link
              href="/monitoreo/contenedores"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Contenedores
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />

      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/monitoreo/contenedores"
              className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Contenedores
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">{documento.nombre}</h1>
              <p className="mt-1 text-sm text-zinc-500">
                {documento.tipo_documento?.nombre || "Documento"} · Código {documento.codigo}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700">
              <span className="material-symbols-outlined text-sm">description</span>
              Documentación de contenedor
            </span>
          </div>

          {/* Detalle */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Información de la documentación</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-zinc-500">Código</label>
                <p className="mt-1 font-mono text-sm font-semibold text-zinc-900">{documento.codigo}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Tipo de documento</label>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {documento.tipo_documento?.nombre || "No especificado"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Fecha de emisión</label>
                <p className="mt-1 text-sm font-semibold text-zinc-900">
                  {new Date(documento.fecha_emision).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 px-4 py-3 text-xs text-blue-800">
              Esta documentación corresponde a la boleta final asociada al contenedor en el módulo de monitoreo.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
