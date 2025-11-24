"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NuevaReserva() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    codigo: "",
    ruc_cliente: "",
    id_ruta: "",
    id_buque: "",
    id_agente_reservas: "",
    id_estado_reserva: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await fetch("http://localhost:3001/gestion-reserva/clientes");
        if (clientesRes.ok) {
          setClientes(await clientesRes.json());
        }

        const rutasRes = await fetch("http://localhost:3001/gestion-maritima/rutas");
        if (rutasRes.ok) {
          setRutas(await rutasRes.json());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3001/gestion-reserva/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Reserva creada exitosamente");
        router.push("/gestion-reservas/reservas");
      } else {
        const error = await res.json();
        alert("Error al crear reserva: " + (error.message || "Error desconocido"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-white rounded-t-lg border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-3xl text-[#003366]">directions_boat</span>
            <span className="text-xl font-bold text-[#003366]">Hapag-Lloyd</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Nueva Reserva</h1>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-b-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Código */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Reserva *
              </label>
              <input
                type="text"
                required
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                placeholder="RES-2024-001"
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.ruc_cliente}
                  onChange={(e) => setFormData({ ...formData, ruc_cliente: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.ruc} value={cliente.ruc}>
                      {cliente.razon_social}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Ruta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruta *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.id_ruta}
                  onChange={(e) => setFormData({ ...formData, id_ruta: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                >
                  <option value="">Seleccionar Ruta</option>
                  {rutas.map((ruta) => (
                    <option key={ruta.id_ruta} value={ruta.id_ruta}>
                      {ruta.puerto_origen?.nombre || "Origen"} → {ruta.puerto_destino?.nombre || "Destino"}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Campos adicionales necesarios - simplificados */}
            <input type="hidden" value={formData.id_buque} />
            <input type="hidden" value={formData.id_agente_reservas} />
            <input type="hidden" value={formData.id_estado_reserva} />

            {/* Botón */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#003366] hover:bg-[#002b5c] text-white font-semibold py-4 px-6 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creando reserva..." : "Registrar Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
