# 🔧 CÓDIGO DEL MODAL DE INCIDENCIAS

## Reemplaza la función vacía `ModalIncidencia` al final del archivo

```typescript
// Componente Modal - CÓDIGO COMPLETO
function ModalIncidencia({ show, modoEdicion, incidencia, tipos, estados, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    id_tipo_incidencia: incidencia?.tipo_incidencia?.id_tipo_incidencia || "",
    descripcion: incidencia?.descripcion || "",
    grado_severidad: incidencia?.grado_severidad || 5,
    id_estado_incidencia: incidencia?.estado_incidencia?.id_estado_incidencia || "",
    id_operacion: incidencia?.id_operacion || "",
  });

  const [operaciones, setOperaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar operaciones disponibles
    fetch("http://localhost:3001/monitoreo/operaciones")
      .then((res) => res.json())
      .then((data) => setOperaciones(data))
      .catch((err) => console.error("Error cargando operaciones:", err));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const url = modoEdicion
      ? `http://localhost:3001/monitoreo/incidencias/${incidencia.id_incidencia}`
      : "http://localhost:3001/monitoreo/incidencias";

    const method = modoEdicion ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        onSuccess();
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
        alert("Error al guardar la incidencia");
      });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-6">
          <h2 className="text-xl font-bold text-zinc-900">
            {modoEdicion ? "Editar Incidencia" : "Nueva Incidencia"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Tipo de Incidencia */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tipo de Incidencia *
              </label>
              <select
                value={formData.id_tipo_incidencia}
                onChange={(e) => setFormData({ ...formData, id_tipo_incidencia: e.target.value })}
                required
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((tipo: any) => (
                  <option key={tipo.id_tipo_incidencia} value={tipo.id_tipo_incidencia}>
                    {tipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Operación */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Operación Relacionada *
              </label>
              <select
                value={formData.id_operacion}
                onChange={(e) => setFormData({ ...formData, id_operacion: e.target.value })}
                required
                disabled={modoEdicion}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar operación</option>
                {operaciones.map((op: any) => (
                  <option key={op.id_operacion} value={op.id_operacion}>
                    {op.codigo}
                  </option>
                ))}
              </select>
            </div>

            {/* Estado (solo en modo edición) */}
            {modoEdicion && (
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Estado *
                </label>
                <select
                  value={formData.id_estado_incidencia}
                  onChange={(e) => setFormData({ ...formData, id_estado_incidencia: e.target.value })}
                  required
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Seleccionar estado</option>
                  {estados.map((estado: any) => (
                    <option key={estado.id_estado_incidencia} value={estado.id_estado_incidencia}>
                      {estado.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Grado de Severidad */}
            <div className={modoEdicion ? "" : "md:col-span-2"}>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Grado de Severidad: {formData.grado_severidad}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.grado_severidad}
                onChange={(e) => setFormData({ ...formData, grado_severidad: parseInt(e.target.value) })}
                className="w-full accent-primary"
              />
              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>Baja (1-4)</span>
                <span>Media (5-7)</span>
                <span>Crítica (8-10)</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Descripción Detallada *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                required
                rows={4}
                placeholder="Describe la incidencia en detalle..."
                className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Guardando...
                </span>
              ) : modoEdicion ? (
                "Actualizar"
              ) : (
                "Crear Incidencia"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Agrega este import al inicio del archivo:

```typescript
import { useState, useEffect } from "react"; // Ya debe estar
```

---

✅ **Este código completa el modal con todas las funcionalidades CRUD**
