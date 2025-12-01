"use client";

import { useEffect, useState } from "react";

export default function GestionTarifas() {
  const [loading, setLoading] = useState(true);
  const [rutas, setRutas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tarifasPorPagina = 10;

  useEffect(() => {
    const fetchTarifas = async () => {
      try {
        const rutasRes = await fetch("http://localhost:3001/gestion-reserva/tarifas");
        if (rutasRes.ok) {
          const rutasData = await rutasRes.json();
          setRutas(rutasData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tarifas:", error);
        setLoading(false);
      }
    };

    fetchTarifas();
  }, []);

  const totalPages = Math.ceil(rutas.length / tarifasPorPagina);
  const indexInicio = (currentPage - 1) * tarifasPorPagina;
  const tarifasPaginadas = rutas.slice(indexInicio, indexInicio + tarifasPorPagina);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Tarifas</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">
                Código de Ruta
              </th>
              <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">
                Ruta
              </th>
              <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">
                Duración
              </th>
              <th className="text-left py-4 px-6 text-sm font-bold text-gray-900 uppercase">
                Tarifa
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">Cargando...</td>
              </tr>
            ) : tarifasPaginadas.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No hay tarifas disponibles</td>
              </tr>
            ) : (
              tarifasPaginadas.map((ruta: any) => (
                <tr key={ruta.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">
                    {ruta.codigo || "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm text-blue-600 hover:text-blue-800">
                    {ruta.puerto_origen || "Origen"} a {ruta.puerto_destino || "Destino"}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {ruta.duracion ? `${ruta.duracion} Días` : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-900">
                    ${parseFloat(ruta.tarifa || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Paginación */}
        {rutas.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Mostrando {indexInicio + 1} - {Math.min(indexInicio + tarifasPorPagina, rutas.length)} de {rutas.length} tarifas
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
  );
}
