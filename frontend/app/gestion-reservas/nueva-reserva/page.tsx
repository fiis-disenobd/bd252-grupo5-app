"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NuevaReserva() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState<any[]>([]);
  const [contenedores, setContenedores] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [buques, setBuques] = useState<any[]>([]);
  const [agentes, setAgentes] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    ruc_cliente: "",
    id_contenedor: "",
    id_ruta_maritima: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await fetch("http://localhost:3001/gestion-reserva/clientes");
        if (clientesRes.ok) {
          setClientes(await clientesRes.json());
        }

        const contenedoresRes = await fetch("http://localhost:3001/monitoreo/contenedores?estado=Disponible");
        if (contenedoresRes.ok) {
          const data = await contenedoresRes.json();
          setContenedores(data);
        }

        const rutasRes = await fetch("http://localhost:3001/gestion-reserva/rutas-maritimas");
        if (rutasRes.ok) {
          setRutas(await rutasRes.json());
        }

        const buquesRes = await fetch("http://localhost:3001/gestion-reserva/buques-operaciones");
        if (buquesRes.ok) {
          const buquesData = await buquesRes.json();
          setBuques(buquesData);
        }

        const agentesRes = await fetch("http://localhost:3001/gestion-reserva/agentes");
        if (agentesRes.ok) {
          const agentesData = await agentesRes.json();
          setAgentes(agentesData);
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
      // Validar que tengamos los datos necesarios
      if (buques.length === 0) {
        alert("No hay buques disponibles");
        return;
      }

      if (agentes.length === 0) {
        alert("No hay agentes de reserva disponibles");
        return;
      }

      // Encontrar la ruta seleccionada para obtener el id_ruta
      const rutaSeleccionada = rutas.find(r => r.id_ruta_maritima === formData.id_ruta_maritima);
      
      // Generar código automático
      const codigo = `RES-${Date.now().toString().slice(0, 8)}`;
      
      // Preparar datos en el formato que espera el backend
      const reservaData = {
        codigo: codigo,
        ruc_cliente: formData.ruc_cliente,
        id_ruta: rutaSeleccionada?.id_ruta || "",
        id_buque: buques[0].id_buque, // Primer buque disponible
        id_agente_reservas: agentes[0].id_agente_reservas, // Primer agente disponible
        id_estado_reserva: '6df420ae-11c7-4fd4-ba29-8b5edfba782c', // Estado "Confirmada"
        contenedores: [
          {
            id_contenedor: formData.id_contenedor,
            cantidad: 1
          }
        ]
      };

      const res = await fetch("http://localhost:3001/gestion-reserva/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaData),
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
            <img
              src="/favicon/favicon-96x96.png"
              alt="Hapag-Lloyd"
              className="h-8 w-auto"
            />
            <span className="text-xl font-bold text-[#003366]">Hapag-Lloyd</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Nueva Reserva</h1>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-b-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
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

            {/* Contenedor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenedor
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.id_contenedor}
                  onChange={(e) => setFormData({ ...formData, id_contenedor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                >
                  <option value="">Seleccionar contenedor</option>
                  {contenedores.map((contenedor) => (
                    <option key={contenedor.id_contenedor} value={contenedor.id_contenedor}>
                      {contenedor.codigo} - {contenedor.tipo_contenedor?.nombre || 'N/A'}
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
                Ruta
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.id_ruta_maritima}
                  onChange={(e) => setFormData({ ...formData, id_ruta_maritima: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
                >
                  <option value="">Seleccionar Ruta</option>
                  {rutas.map((ruta) => (
                    <option key={ruta.id_ruta_maritima} value={ruta.id_ruta_maritima}>
                      {ruta.puerto_origen} → {ruta.puerto_destino}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

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
