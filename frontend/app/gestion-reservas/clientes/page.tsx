"use client";

import { useState, useEffect } from "react";

export default function GestionClientes() {
  const [selectedCliente, setSelectedCliente] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await fetch("http://localhost:3001/gestion-reserva/clientes");
        if (clientesRes.ok) {
          const clientesData = await clientesRes.json();
          setClientes(clientesData);
          if (clientesData.length > 0) {
            setSelectedCliente(clientesData[0]);
          }
        }

        const reservasRes = await fetch("http://localhost:3001/gestion-reserva/reservas");
        if (reservasRes.ok) {
          const reservasData = await reservasRes.json();
          console.log("Reservas data:", reservasData);
          console.log("Primera reserva:", reservasData[0]);
          setReservas(reservasData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClientes = clientes.filter(
    (c) =>
      c.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.ruc.includes(searchTerm)
  );

  const historialReservas = selectedCliente
    ? reservas.filter(r => r.ruc_cliente === selectedCliente.ruc)
    : [];

  return (
    <div className="flex h-screen bg-[#f5f7fa]">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">Busque, vea y gestione los clientes registrados.</p>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {/* Búsqueda */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre o RUC"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tabla de Clientes */}
          <div className="bg-white rounded-lg shadow mb-8">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Nombre</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">RUC</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Estado</th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Última Reserva</th>
                  <th className="text-right py-4 px-6 text-sm font-bold text-gray-900 uppercase"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">Cargando...</td>
                  </tr>
                ) : filteredClientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">No se encontraron clientes</td>
                  </tr>
                ) : (
                  filteredClientes.map((cliente) => {
                    const reservasCliente = reservas.filter(r => r.ruc_cliente === cliente.ruc);
                    const ultimaReserva = reservasCliente.length > 0
                      ? new Date(reservasCliente[0].fecha_registro).toLocaleDateString("es-PE")
                      : "Sin reservas";
                    
                    // Determinar si el cliente está activo
                    const tieneReservasActivas = reservasCliente.some(r => 
                      r.estado_reserva?.nombre === "En Proceso" || 
                      r.estado_reserva?.nombre === "Confirmada"
                    );
                    const estadoCliente = tieneReservasActivas ? "Activo" : "Inactivo";
                    const estadoColor = tieneReservasActivas 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-700";
                    
                    return (
                      <tr
                        key={cliente.ruc}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedCliente(cliente)}
                      >
                        <td className="py-4 px-6 text-sm text-gray-900">{cliente.razon_social}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">{cliente.ruc}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${estadoColor}`}>
                            {estadoCliente}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{ultimaReserva}</td>
                        <td className="py-4 px-6 text-right">
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Ver Historial
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Historial de Reservas */}
          {selectedCliente && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Historial de Reservas ({selectedCliente.razon_social})
                </h2>
              </div>
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Código</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Fecha</th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historialReservas.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8 text-gray-500">No hay reservas para este cliente</td>
                    </tr>
                  ) : (
                    historialReservas.map((reserva) => (
                      <tr key={reserva.id_reserva} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm font-semibold text-gray-900">{reserva.codigo}</td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(reserva.fecha_registro).toLocaleDateString("es-PE")}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            Activa
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
