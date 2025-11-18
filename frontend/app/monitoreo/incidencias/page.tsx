"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/monitoreo/Sidebar";
import { TopBar } from "@/components/monitoreo/TopBar";

interface Incidencia {
  id: string;
  codigo: string;
  operacion: string;
  tipo: string;
  severidad: string;
  severidadColor: string;
  fecha: string;
  estado: string;
  estadoColor: string;
}

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    operacion: '',
    tipo: '',
    descripcion: '',
    severidad: 3
  });

  useEffect(() => {
    // Datos de ejemplo (reemplazar con fetch real)
    const mockIncidencias: Incidencia[] = [
      {
        id: '1',
        codigo: 'INC-001',
        operacion: 'OP-5829',
        tipo: 'Daño Contenedor',
        severidad: 'Crítico',
        severidadColor: 'bg-red-100 text-red-800',
        fecha: '2023-10-27',
        estado: 'Resuelto',
        estadoColor: 'bg-green-100 text-green-800'
      },
      {
        id: '2',
        codigo: 'INC-002',
        operacion: 'OP-5830',
        tipo: 'Retraso',
        severidad: 'Alto',
        severidadColor: 'bg-red-100 text-red-800',
        fecha: '2023-10-26',
        estado: 'En Proceso',
        estadoColor: 'bg-yellow-100 text-yellow-800'
      },
      {
        id: '3',
        codigo: 'INC-003',
        operacion: 'OP-5831',
        tipo: 'Desvío Ruta',
        severidad: 'Medio',
        severidadColor: 'bg-yellow-100 text-yellow-800',
        fecha: '2023-10-25',
        estado: 'Nuevo',
        estadoColor: 'bg-blue-100 text-blue-800'
      },
      {
        id: '4',
        codigo: 'INC-004',
        operacion: 'OP-5832',
        tipo: 'Daño Mercancía',
        severidad: 'Bajo',
        severidadColor: 'bg-green-100 text-green-800',
        fecha: '2023-10-24',
        estado: 'Resuelto',
        estadoColor: 'bg-green-100 text-green-800'
      }
    ];
    
    setIncidencias(mockIncidencias);
    setLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, severidad: parseInt(e.target.value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Registrar incidencia:', formData);
    // Aquí iría el POST al backend
    alert('Incidencia registrada (demo)');
    setFormData({
      operacion: '',
      tipo: '',
      descripcion: '',
      severidad: 3
    });
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Gestión de Incidencias" />
        
        <main className="flex-1 p-6 lg:p-8 bg-[#f5f7f8]">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column: Incidents Table */}
            <div className="w-full lg:w-3/5 xl:w-2/3 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-gray-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  Historial de Incidencias
                </h2>
                
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-6xl text-gray-400 animate-pulse">error</span>
                      <p className="mt-4 text-gray-500">Cargando incidencias...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">ID Incidencia</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Operación</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Tipo</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Severidad</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Fecha</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Estado</th>
                          <th className="px-4 py-3 text-left text-gray-600 text-xs font-medium uppercase tracking-wider">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidencias.map((inc) => (
                          <tr key={inc.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 text-sm font-normal">{inc.codigo}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm font-normal">{inc.operacion}</td>
                            <td className="px-4 py-3 text-gray-700 text-sm font-normal">{inc.tipo}</td>
                            <td className="px-4 py-3 text-sm font-medium">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${inc.severidadColor}`}>
                                {inc.severidad}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 text-sm font-normal">{inc.fecha}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${inc.estadoColor}`}>
                                {inc.estado}
                              </span>
                            </td>
                            <td className="px-4 py-3 flex items-center gap-2">
                              <button className="text-gray-500 hover:text-primary" title="Editar">
                                <span className="material-symbols-outlined text-lg">edit</span>
                              </button>
                              <button className="text-gray-500 hover:text-primary" title="Ver detalles">
                                <span className="material-symbols-outlined text-lg">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Register Incident Form */}
            <div className="w-full lg:w-2/5 xl:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 lg:sticky lg:top-24">
                <h2 className="text-gray-800 text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                  Registrar Nueva Incidencia
                </h2>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Operación Relacionada */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="operacion">
                      Operación Relacionada
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                        search
                      </span>
                      <input
                        className="form-input w-full rounded-lg border-gray-300 bg-white focus:ring-primary focus:border-primary text-gray-800 text-sm pl-10"
                        id="operacion"
                        name="operacion"
                        placeholder="Buscar por ID de operación..."
                        type="text"
                        value={formData.operacion}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* Tipo de Incidencia */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tipo">
                      Tipo de Incidencia
                    </label>
                    <select
                      className="form-select w-full rounded-lg border-gray-300 bg-white focus:ring-primary focus:border-primary text-gray-800 text-sm"
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      <option value="">Seleccionar tipo...</option>
                      <option value="dano_contenedor">Daño en Contenedor</option>
                      <option value="retraso">Retraso en Entrega</option>
                      <option value="desvio_ruta">Desvío de Ruta</option>
                      <option value="dano_mercancia">Daño en Mercancía</option>
                    </select>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
                      Descripción Detallada
                    </label>
                    <textarea
                      className="form-textarea w-full rounded-lg border-gray-300 bg-white focus:ring-primary focus:border-primary text-gray-800 text-sm"
                      id="descripcion"
                      name="descripcion"
                      placeholder="Añadir detalles sobre la incidencia..."
                      rows={4}
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Nivel de Severidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="severidad">
                      Nivel de Severidad
                    </label>
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                      id="severidad"
                      max="5"
                      min="1"
                      name="severidad"
                      type="range"
                      value={formData.severidad}
                      onChange={handleRangeChange}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Bajo</span>
                      <span>Medio</span>
                      <span>Crítico</span>
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-sm font-medium text-gray-700">Nivel: {formData.severidad}</span>
                    </div>
                  </div>

                  {/* Botón Submit */}
                  <button
                    className="flex w-full items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    type="submit"
                  >
                    <span className="truncate">Registrar Incidencia</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
