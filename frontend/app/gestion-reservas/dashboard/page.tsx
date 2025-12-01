"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [reservas, setReservas] = useState<any[]>([]);
  const [buques, setBuques] = useState<any[]>([]);
  const [rutas, setRutas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [showAllBuques, setShowAllBuques] = useState(false);
  const [showAllRutas, setShowAllRutas] = useState(false);
  const [currentPageClientes, setCurrentPageClientes] = useState(1);
  const clientesPorPagina = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener estadísticas
        const statsRes = await fetch("http://localhost:3001/gestion-reserva/reservas/estadisticas");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // Obtener reservas
        const reservasRes = await fetch("http://localhost:3001/gestion-reserva/reservas");
        if (reservasRes.ok) {
          const reservasData = await reservasRes.json();
          setReservas(reservasData);
        }

        // Obtener buques con operaciones
        const buquesRes = await fetch("http://localhost:3001/gestion-reserva/buques-operaciones");
        if (buquesRes.ok) {
          const buquesData = await buquesRes.json();
          setBuques(buquesData);
        }

        // Obtener rutas
        const rutasRes = await fetch("http://localhost:3001/gestion-reserva/tarifas");
        if (rutasRes.ok) {
          const rutasData = await rutasRes.json();
          setRutas(rutasData);
        }

        // Obtener clientes
        const clientesRes = await fetch("http://localhost:3001/gestion-reserva/clientes");
        if (clientesRes.ok) {
          const clientesData = await clientesRes.json();
          setClientes(clientesData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Reservas</h1>
      <p className="text-gray-600 mb-8">Bienvenido, aquí tienes un resumen de la operativa logística.</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Reservas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-3xl">calendar_month</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Reservas</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats?.total || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                {stats?.porEstado?.find((e: any) => e.estado === "En Proceso")?.cantidad || 0} En Proceso
              </p>
            </div>
          </div>
        </div>

        {/* Total Contenedores */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="material-symbols-outlined text-orange-600 text-3xl">inventory_2</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Contenedores</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats?.totalContenedores || 0}</p>
              <p className="text-xs text-green-600 mt-1">
                En el sistema
              </p>
            </div>
          </div>
        </div>

        {/* Buques en Operación */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="material-symbols-outlined text-blue-600 text-3xl">directions_boat</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Total Buques</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stats?.totalBuques || 0}</p>
              <p className="text-xs text-green-600 mt-1">{stats?.buquesOperativos || 0} Operativos</p>
            </div>
          </div>
        </div>

        {/* Rutas Activas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <span className="material-symbols-outlined text-orange-600 text-3xl">route</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Rutas Activas</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? "..." : rutas.length}</p>
              <p className="text-xs text-gray-600 mt-1">Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Buques en Operación y Progreso */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Buques en Operación y Progreso del Trayecto</h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : buques.length === 0 ? (
            <p className="text-center text-gray-500">No hay buques disponibles</p>
          ) : (
            <>
              <div className="space-y-5">
                {(showAllBuques ? buques : buques.slice(0, 5)).map((buque, idx) => {
                  const progreso = Math.round(buque.porcentaje_trayecto || 0);
                  const color = idx % 2 === 0 ? "bg-orange-500" : "bg-blue-600";
                  return (
                    <div key={buque.id_buque || idx}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{buque.nombre}</span>
                        <span className="text-sm font-bold text-gray-900">{progreso}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${color}`}
                          style={{ width: `${progreso}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {buques.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllBuques(!showAllBuques)}
                    className="text-[#003366] hover:text-[#002b5c] font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                  >
                    {showAllBuques ? (
                      <>
                        Ver menos
                        <span className="material-symbols-outlined text-lg">expand_less</span>
                      </>
                    ) : (
                      <>
                        Ver más ({buques.length - 5} buques más)
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Top Rutas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Top Rutas Más Usadas</h2>
          {loading ? (
            <p className="text-center text-gray-500">Cargando...</p>
          ) : rutas.length === 0 ? (
            <p className="text-center text-gray-500">No hay rutas disponibles</p>
          ) : (
            <>
              <div className="space-y-4">
                {(() => {
                  // Ordenar rutas por número de reservas descendente
                  const rutasOrdenadas = [...rutas].sort((a, b) => {
                    const reservasA = reservas.filter(r => r.ruta?.id_ruta === a.id_ruta).length;
                    const reservasB = reservas.filter(r => r.ruta?.id_ruta === b.id_ruta).length;
                    return reservasB - reservasA;
                  });
                  
                  return (showAllRutas ? rutasOrdenadas : rutasOrdenadas.slice(0, 5)).map((ruta, idx) => {
                    const reservasConRuta = reservas.filter(r => r.ruta?.id_ruta === ruta.id_ruta).length;
                    return (
                      <div key={ruta.id || idx} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">
                            {ruta.puerto_origen || "Origen"} → {ruta.puerto_destino || "Destino"}
                          </p>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{reservasConRuta}</span>
                      </div>
                    );
                  });
                })()}
              </div>
              {rutas.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllRutas(!showAllRutas)}
                    className="text-[#003366] hover:text-[#002b5c] font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                  >
                    {showAllRutas ? (
                      <>
                        Ver menos
                        <span className="material-symbols-outlined text-lg">expand_less</span>
                      </>
                    ) : (
                      <>
                        Ver más ({rutas.length - 5} rutas más)
                        <span className="material-symbols-outlined text-lg">expand_more</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Clientes con Más Reservas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Clientes con Más Reservas</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">RUC</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Reservas Activas</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">Cargando...</td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">No hay clientes disponibles</td>
                </tr>
              ) : (
                (() => {
                  // Ordenar clientes por cantidad de reservas activas (descendente)
                  const clientesOrdenados = [...clientes].sort((a, b) => {
                    const reservasA = reservas.filter(r => r.ruc_cliente === a.ruc).length;
                    const reservasB = reservas.filter(r => r.ruc_cliente === b.ruc).length;
                    return reservasB - reservasA;
                  });

                  // Paginación
                  const totalPagesClientes = Math.ceil(clientesOrdenados.length / clientesPorPagina);
                  const indexInicioClientes = (currentPageClientes - 1) * clientesPorPagina;
                  const clientesPaginados = clientesOrdenados.slice(indexInicioClientes, indexInicioClientes + clientesPorPagina);

                  return clientesPaginados.map((cliente, idx) => {
                    const reservasCount = reservas.filter(r => r.ruc_cliente === cliente.ruc).length;
                    return (
                      <tr key={cliente.ruc || idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{cliente.razon_social}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{cliente.ruc}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
                            {reservasCount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{cliente.email || "N/A"}</td>
                      </tr>
                    );
                  });
                })()
              )}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        {clientes.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 mt-4">
            <span className="text-sm text-gray-600">
              Mostrando {((currentPageClientes - 1) * clientesPorPagina) + 1} - {Math.min(currentPageClientes * clientesPorPagina, clientes.length)} de {clientes.length} clientes
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPageClientes((p) => Math.max(1, p - 1))}
                disabled={currentPageClientes === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Página {currentPageClientes} de {Math.ceil(clientes.length / clientesPorPagina)}
              </span>
              <button
                onClick={() => setCurrentPageClientes((p) => Math.min(Math.ceil(clientes.length / clientesPorPagina), p + 1))}
                disabled={currentPageClientes === Math.ceil(clientes.length / clientesPorPagina)}
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
