"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MapHeader } from "@/components/monitoreo/MapHeader";

interface DireccionImportador {
  id_direccion: string;
  direccion: string;
  tipo: string | null;
  principal: boolean;
}

interface ImportadorDetalle {
  id_importador: string;
  codigo: string;
  ruc: string;
  razon_social: string;
  direcciones: DireccionImportador[];
}

export default function ImportadorDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [importador, setImportador] = useState<ImportadorDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [esPrincipal, setEsPrincipal] = useState(false);

  useEffect(() => {
    const id = params.id as string;

    fetch(`http://localhost:3001/monitoreo/importadores/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          let body: any = null;
          try {
            body = text ? JSON.parse(text) : null;
          } catch {
            body = null;
          }
          const message = body?.message || `Error al cargar importador (${res.status})`;
          throw new Error(message);
        }
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      })
      .then((data) => {
        setImportador(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando importador:", err);
        setError(err.message || "Error al cargar el importador");
        setLoading(false);
      });
  }, [params.id]);

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

  if (error || !importador) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <MapHeader />
        <main className="mx-auto max-w-4xl p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <h1 className="mb-2 text-lg font-semibold">No se pudo cargar el importador</h1>
            <p className="mb-4 text-sm">{error || "Importador no encontrado"}</p>
            <Link
              href="/monitoreo/entregas"
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-800 transition-colors hover:bg-red-100"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Volver a Entregas
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const direcciones = importador.direcciones || [];
  const principal = direcciones.find((d) => d.principal) || null;
  const otras = direcciones.filter((d) => !d.principal);

  const handleOpenModal = () => {
    setNuevaDireccion("");
    setNuevoTipo("");
    setEsPrincipal(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setShowModal(false);
  };

  const handleGuardarDireccion = async () => {
    if (!importador) return;
    const direccionTrim = nuevaDireccion.trim();
    if (!direccionTrim) {
      alert("La dirección es obligatoria");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(
        `http://localhost:3001/monitoreo/importadores/${importador.id_importador}/direcciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            direccion: direccionTrim,
            tipo: nuevoTipo.trim() || null,
            principal: esPrincipal,
          }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        let body: any = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          body = null;
        }
        const message = body?.message || `Error al crear dirección (${res.status})`;
        throw new Error(message);
      }

      const nueva = (await res.json()) as DireccionImportador;

      setImportador({
        ...importador,
        direcciones: [
          // Si es principal, la insertamos y dejamos que la vista reordene según flag
          ...importador.direcciones,
          nueva,
        ],
      });

      setShowModal(false);
    } catch (err: any) {
      console.error("Error creando dirección:", err);
      alert(err.message || "Error al crear la dirección");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <MapHeader />

      <main className="mx-auto max-w-5xl p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Importador</h1>
            <p className="text-sm text-zinc-500">Detalle del importador y sus direcciones registradas</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-300/90"
            >
              <span className="material-symbols-outlined text-lg">add_location_alt</span>
              Agregar dirección
            </button>
            <Link
              href="/monitoreo/entregas"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Volver a Entregas
            </Link>
          </div>
        </div>

        {/* Info principal del importador */}
        <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3 border-b border-zinc-200 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="material-symbols-outlined text-2xl text-primary">business</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-zinc-900">{importador.razon_social}</h2>
              <p className="text-sm text-zinc-500">Código: {importador.codigo}</p>
            </div>
            <div className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700">
              RUC: <span className="font-mono">{importador.ruc}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">ID Importador</p>
              <p className="mt-1 break-all rounded-lg bg-zinc-50 p-3 font-mono text-xs text-zinc-700">
                {importador.id_importador}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Total direcciones</p>
              <p className="mt-1 rounded-lg bg-zinc-50 p-3 text-sm font-semibold text-zinc-900">
                {direcciones.length}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Dirección principal</p>
              <p className="mt-1 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-900">
                {principal ? principal.direccion : "No registrada"}
              </p>
            </div>
          </div>
        </div>

        {/* Direcciones */}
        <div className="space-y-4">
          {direcciones.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-sm text-zinc-500">
              No hay direcciones registradas para este importador.
            </div>
          ) : (
            <>
              {principal && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-green-600">home_pin</span>
                    <h3 className="text-sm font-semibold text-green-800">Dirección Principal</h3>
                  </div>
                  <p className="text-sm text-green-900">{principal.direccion}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-green-700">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                      Principal
                    </span>
                    {principal.tipo && <span>{principal.tipo}</span>}
                  </div>
                </div>
              )}

              {otras.length > 0 && (
                <div className="rounded-lg border border-zinc-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-zinc-700">location_on</span>
                    <h3 className="text-sm font-semibold text-zinc-900">Otras Direcciones</h3>
                  </div>
                  <div className="space-y-3">
                    {otras.map((dir) => (
                      <div
                        key={dir.id_direccion}
                        className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3"
                      >
                        <div>
                          <p className="text-sm text-zinc-900">{dir.direccion}</p>
                          {dir.tipo && (
                            <p className="mt-1 text-xs text-zinc-500">Tipo: {dir.tipo}</p>
                          )}
                        </div>
                        {dir.principal && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                            Principal
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-zinc-900">Nueva dirección</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-zinc-500">Dirección</label>
                  <textarea
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                    value={nuevaDireccion}
                    onChange={(e) => setNuevaDireccion(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium uppercase text-zinc-500">Tipo (opcional)</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-zinc-300 text-primary focus:ring-primary"
                    checked={esPrincipal}
                    onChange={(e) => setEsPrincipal(e.target.checked)}
                  />
                  Marcar como dirección principal
                </label>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={saving}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleGuardarDireccion}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    )}
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
