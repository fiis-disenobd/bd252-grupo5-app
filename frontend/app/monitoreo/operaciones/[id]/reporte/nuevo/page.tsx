"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface Incidencia {
  id_incidencia: string;
  codigo: string;
  descripcion: string;
  grado_severidad: number;
  fecha_hora: string;
  tipo_incidencia?: {
    nombre: string;
  };
  estado_incidencia?: {
    nombre: string;
  };
}

export default function NuevoReporteOperacionPage() {
  const params = useParams();
  const router = useRouter();
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const url = new URL("http://localhost:3001/monitoreo/incidencias");
    url.searchParams.set("operacion", String(params.id));

    fetch(url.toString())
      .then((res) => res.json())
      .then((data) => {
        setIncidencias(Array.isArray(data.incidencias) ? data.incidencias : []);
        setLoading(false);
      })
      .catch(() => {
        setIncidencias([]);
        setLoading(false);
      });
  }, [params.id]);

  const toggleSeleccion = (id: string) => {
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleGenerar = async () => {
    if (!params.id) return;
    try {
      setSaving(true);
      const res = await fetch(
        `http://localhost:3001/monitoreo/reportes/operacion/${params.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            incidenciasIds: seleccionadas,
            comentario: comentario || undefined,
          }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        alert(text || "No se pudo generar el reporte");
        return;
      }

      const data = await res.json();
      alert(`Reporte generado: ${data.codigo || "(sin código)"}`);
      router.push("/monitoreo/reportes");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al generar el reporte");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <MapHeader />
      <main className="flex-1 overflow-y-auto bg-zinc-50 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link
              href={`/monitoreo/operaciones/${params.id}`}
              className="mb-2 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-primary"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a la Operación
            </Link>
            <h1 className="text-2xl font-bold text-zinc-900">
              Generar Reporte de Operación
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              Selecciona las incidencias que deseas incluir en el reporte y agrega un comentario opcional.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Incidencias */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">
              Incidencias de la Operación
            </h2>
            {loading ? (
              <p className="text-sm text-zinc-500">Cargando incidencias...</p>
            ) : incidencias.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No hay incidencias registradas para esta operación.
              </p>
            ) : (
              <div className="space-y-3">
                {incidencias.map((inc) => (
                  <label
                    key={inc.id_incidencia}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary/30"
                      checked={seleccionadas.includes(inc.id_incidencia)}
                      onChange={() => toggleSeleccion(inc.id_incidencia)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-zinc-900">
                          {inc.codigo}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                          {inc.tipo_incidencia?.nombre || "Sin tipo"}
                        </span>
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                          Sev. {inc.grado_severidad}
                        </span>
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                          {inc.estado_incidencia?.nombre || "Sin estado"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-700">{inc.descripcion}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {new Date(inc.fecha_hora).toLocaleString("es-ES")}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Comentario y acción */}
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="mb-2 text-sm font-bold text-zinc-900">Comentario Adicional</h3>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Describe observaciones o conclusiones relevantes del reporte..."
              />
            </div>
            <div className="pt-2">
              <button
                onClick={handleGenerar}
                disabled={saving}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <span className="material-symbols-outlined text-lg">description</span>
                )}
                <span>{saving ? "Generando reporte..." : "Generar Reporte"}</span>
              </button>
              <p className="mt-2 text-xs text-zinc-500">
                Si no seleccionas ninguna incidencia, el reporte se generará igual con un resumen de la operación.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
