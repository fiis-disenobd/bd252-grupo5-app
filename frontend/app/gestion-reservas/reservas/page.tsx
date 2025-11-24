"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReservasActivas() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCliente, setFilterCliente] = useState("");
  const [filterFecha, setFilterFecha] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await fetch("http://localhost:3001/gestion-reserva/reservas");
        if (res.ok) {
          const data = await res.json();
          setReservas(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservas:", error);
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const filteredReservas = reservas.filter((r) => {
    const matchSearch = r.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       r.cliente?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  const getEstadoBadge = (estado: string) => {
    const styles = {
      Confirmada: "bg-green-100 text-green-700",
      Finalizada: "bg-blue-100 text-blue-700",
      Cancelada: "bg-red-100 text-red-700",
    };
    return styles[estado as keyof typeof styles] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservas Activas</h1>
        </div>
        <button
          onClick={() => router.push("/gestion-reservas/nueva-reserva")}
          className="flex items-center gap-2 bg-[#003366] hover:bg-[#002b5c] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <span className="material-symbols-outlined">add</span>
          Nueva Reserva
        </button>
      </div>

      <div className="p-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por ID de reserva"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            {/* Filtro Cliente */}
            <div className="relative">
              <select
                value={filterCliente}
                onChange={(e) => setFilterCliente(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
              >
                <option value="">Cliente</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Filtro Fecha */}
            <div className="relative">
              <select
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
              >
                <option value="">Fecha</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Filtro Estado */}
            <div className="relative">
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
              >
                <option value="">Estado</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Código Reserva</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Cliente</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Fecha</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Cargando...</td>
                </tr>
              ) : filteredReservas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No se encontraron reservas</td>
                </tr>
              ) : (
                filteredReservas.map((reserva) => (
                  <tr key={reserva.id_reserva} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {reserva.codigo}
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                      {reserva.cliente?.razon_social || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(reserva.fecha_registro).toLocaleDateString("es-PE")}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Confirmada
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
