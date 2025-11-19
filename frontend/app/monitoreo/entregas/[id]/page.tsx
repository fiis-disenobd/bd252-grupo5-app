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
  estado_entrega: {
    id_estado_entrega: string;
    nombre: string;
  };
  contenedor: {
    id_contenedor: string;
    codigo: string;
    tipo_contenedor?: {
      nombre: string;
    };
  };
  importador: {
    id_importador: string;
    razon_social: string;
    ruc: string;
    direccion?: string;
  };
}

export default function VerEntregaPage() {
  const params = useParams();
  const router = useRouter();
  const [entrega, setEntrega] = useState<Entrega | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/monitoreo/entregas/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Entrega no encontrada");
        return res.json();
      })
      .then((data) => {
        setEntrega(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando entrega:", err);
        setLoading(false);
        alert("Error al cargar la entrega");
        router.push("/monitoreo/entregas");
      });
  }, [params.id, router]);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Entregada":
        return "bg-green-100 text-green-700 border-green-200";
      case "En Transito":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "En Almacen":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelada":
        return "bg-red-100 text-red-700 border-red-200";
      case "Con Incidencia":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
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

      <main className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Detalles de la Entrega</h1>
            <p className="text-sm text-zinc-500">Información completa de la entrega registrada</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/monitoreo/entregas"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver
            </Link>
            <Link
              href={`/monitoreo/entregas/${entrega.id_entrega}/editar`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Editar
            </Link>
          </div>
        </div>

        {/* Información Principal */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3 border-b border-zinc-200 pb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">local_shipping</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900">{entrega.codigo}</h2>
              <p className="text-sm text-zinc-500">
                {new Date(entrega.fecha_entrega).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getEstadoColor(
                entrega.estado_entrega?.nombre
              )}`}
            >
              {entrega.estado_entrega?.nombre || "N/A"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">ID de Entrega</h3>
              <p className="rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-600">
                {entrega.id_entrega}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Fecha de Entrega</h3>
              <p className="rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900">
                {new Date(entrega.fecha_entrega).toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="md:col-span-2">
              <h3 className="mb-2 text-sm font-semibold text-zinc-700">Lugar de Entrega</h3>
              <div className="flex items-center gap-2 rounded-lg bg-zinc-50 p-3">
                <span className="material-symbols-outlined text-zinc-500">location_on</span>
                <p className="text-sm text-zinc-900">{entrega.lugar_entrega}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Contenedor */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">inventory_2</span>
            <h3 className="text-lg font-semibold text-zinc-900">Información del Contenedor</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Código</p>
              <p className="mt-1 font-mono font-semibold text-zinc-900">{entrega.contenedor?.codigo || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Tipo</p>
              <p className="mt-1 font-semibold text-zinc-900">
                {entrega.contenedor?.tipo_contenedor?.nombre || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">ID</p>
              <p className="mt-1 font-mono text-sm text-zinc-600">{entrega.contenedor?.id_contenedor || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Información del Importador */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">business</span>
            <h3 className="text-lg font-semibold text-zinc-900">Información del Importador</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Razón Social</p>
              <p className="mt-1 font-semibold text-zinc-900">{entrega.importador?.razon_social || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">RUC</p>
              <p className="mt-1 font-mono font-semibold text-zinc-900">{entrega.importador?.ruc || "N/A"}</p>
            </div>
            {entrega.importador?.direccion && (
              <div className="md:col-span-2">
                <p className="text-xs font-medium uppercase text-zinc-500">Dirección</p>
                <p className="mt-1 text-zinc-900">{entrega.importador.direccion}</p>
              </div>
            )}
          </div>
        </div>

        {/* Acciones Adicionales */}
        <div className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-4">
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
