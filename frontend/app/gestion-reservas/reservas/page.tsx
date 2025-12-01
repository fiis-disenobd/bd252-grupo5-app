"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ReservasActivas() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCliente, setFilterCliente] = useState("");
  const [filterFechaDesde, setFilterFechaDesde] = useState("");
  const [filterFechaHasta, setFilterFechaHasta] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [reservas, setReservas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [estados, setEstados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reservasPorPagina = 10;

  // Cargar datos iniciales (clientes, estados y reservas)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Cargar clientes para el dropdown
        const clientesRes = await fetch("http://localhost:3001/gestion-reserva/clientes");
        if (clientesRes.ok) {
          setClientes(await clientesRes.json());
        }

        // Cargar estados para el dropdown
        const estadosRes = await fetch("http://localhost:3001/gestion-reserva/estados-reserva");
        if (estadosRes.ok) {
          setEstados(await estadosRes.json());
        }

        // Cargar todas las reservas inicialmente
        const reservasRes = await fetch("http://localhost:3001/gestion-reserva/reservas");
        if (reservasRes.ok) {
          setReservas(await reservasRes.json());
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Buscar por código usando el endpoint del backend
  const handleSearchByCodigo = async () => {
    setCurrentPage(1);
    if (!searchTerm.trim()) {
      // Si está vacío, cargar todas las reservas
      const res = await fetch("http://localhost:3001/gestion-reserva/reservas");
      if (res.ok) {
        setReservas(await res.json());
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/gestion-reserva/reservas/codigo/${searchTerm}`);
      if (res.ok) {
        const data = await res.json();
        setReservas([data]); // El endpoint devuelve un objeto, lo convertimos a array
      } else {
        setReservas([]); // No encontrado
      }
    } catch (error) {
      console.error("Error searching by codigo:", error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar por cliente usando el endpoint del backend
  const handleFilterByCliente = async (rucCliente: string) => {
    setFilterCliente(rucCliente);
    setCurrentPage(1);
    setLoading(true);
    
    try {
      let url = "http://localhost:3001/gestion-reserva/reservas";
      if (rucCliente) {
        url += `?ruc_cliente=${rucCliente}`;
      }
      
      const res = await fetch(url);
      if (res.ok) {
        setReservas(await res.json());
      }
    } catch (error) {
      console.error("Error filtering by cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros locales (fecha y estado) sobre los resultados
  const filteredReservas = reservas.filter((r) => {
    // Filtro por estado
    if (filterEstado && r.estado_reserva?.id_estado_reserva !== filterEstado) {
      return false;
    }

    // Filtro por rango de fechas
    if (filterFechaDesde || filterFechaHasta) {
      const fechaReserva = new Date(r.fecha_registro);
      
      if (filterFechaDesde) {
        const desde = new Date(filterFechaDesde);
        if (fechaReserva < desde) return false;
      }
      
      if (filterFechaHasta) {
        const hasta = new Date(filterFechaHasta);
        hasta.setHours(23, 59, 59, 999); // Incluir todo el día
        if (fechaReserva > hasta) return false;
      }
    }

    return true;
  });

  const totalPages = Math.ceil(filteredReservas.length / reservasPorPagina);
  const indexInicio = (currentPage - 1) * reservasPorPagina;
  const reservasPaginadas = filteredReservas.slice(indexInicio, indexInicio + reservasPorPagina);

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      Confirmada: "bg-green-100 text-green-700",
      Completada: "bg-blue-100 text-blue-700",
      Cancelada: "bg-red-100 text-red-700",
      Pendiente: "bg-yellow-100 text-yellow-700",
    };
    return styles[estado] || "bg-gray-100 text-gray-700";
  };

  // Limpiar todos los filtros
  const handleClearFilters = async () => {
    setSearchTerm("");
    setFilterCliente("");
    setFilterFechaDesde("");
    setFilterFechaHasta("");
    setFilterEstado("");
    setCurrentPage(1);
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/gestion-reserva/reservas");
      if (res.ok) {
        setReservas(await res.json());
      }
    } catch (error) {
      console.error("Error reloading reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lista de Reservas</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Búsqueda por código */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por código de reserva"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchByCodigo()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>

            {/* Filtro Cliente */}
            <div className="relative">
              <select
                value={filterCliente}
                onChange={(e) => handleFilterByCliente(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
              >
                <option value="">Todos los clientes</option>
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

            {/* Filtro Fecha Desde */}
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Desde</label>
              <input
                type="date"
                value={filterFechaDesde}
                onChange={(e) => {
                  setFilterFechaDesde(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              />
            </div>

            {/* Filtro Fecha Hasta */}
            <div className="relative">
              <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">Hasta</label>
              <input
                type="date"
                value={filterFechaHasta}
                onChange={(e) => {
                  setFilterFechaHasta(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
              />
            </div>

            {/* Filtro Estado */}
            <div className="relative">
              <select
                value={filterEstado}
                onChange={(e) => {
                  setFilterEstado(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-700"
              >
                <option value="">Todos los estados</option>
                {estados.map((estado) => (
                  <option key={estado.id_estado_reserva} value={estado.id_estado_reserva}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
            >
              <span className="material-symbols-outlined text-base">filter_alt_off</span>
              Limpiar filtros
            </button>
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
              ) : reservasPaginadas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No se encontraron reservas</td>
                </tr>
              ) : (
                reservasPaginadas.map((reserva) => (
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
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(reserva.estado_reserva?.nombre)}`}>
                        {reserva.estado_reserva?.nombre || "Sin estado"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* Paginación */}
          {filteredReservas.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                Mostrando {indexInicio + 1} - {Math.min(indexInicio + reservasPorPagina, filteredReservas.length)} de {filteredReservas.length} reservas
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
