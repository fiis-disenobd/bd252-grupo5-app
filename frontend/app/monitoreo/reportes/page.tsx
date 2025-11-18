"use client";

import { useState } from "react";
import { Sidebar } from "@/components/monitoreo/Sidebar";
import { TopBar } from "@/components/monitoreo/TopBar";

interface Reporte {
  id: string;
  fecha_generacion: string;
  rango_datos: string;
  estado: string;
  estadoColor: string;
}

export default function ReportesPage() {
  const [activeTab, setActiveTab] = useState('resumen');
  const [selectedReport, setSelectedReport] = useState('RPT-2023-12-003');
  const [formData, setFormData] = useState({
    operacion: 'todas',
    fechaInicio: '2023-12-03',
    fechaFin: '2023-12-09'
  });

  const reportes: Reporte[] = [
    {
      id: 'RPT-2023-12-003',
      fecha_generacion: '10 Dic 2023',
      rango_datos: '03/12/23 - 09/12/23',
      estado: 'Completado',
      estadoColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
      id: 'RPT-2023-12-002',
      fecha_generacion: '05 Dic 2023',
      rango_datos: '28/11/23 - 04/12/23',
      estado: 'Completado',
      estadoColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    },
    {
      id: 'RPT-2023-12-001',
      fecha_generacion: '01 Dic 2023',
      rango_datos: '24/11/23 - 30/11/23',
      estado: 'Parcial',
      estadoColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    }
  ];

  const handleGenerarReporte = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Reporte generado (demo)');
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Gestión de Reportes" />
        
        <main className="flex-1 p-6 lg:p-8 bg-[#f5f7f8]">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Panel: Generate Report */}
            <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-gray-800 tracking-tight text-xl font-bold leading-tight pb-6">
                  Generar Nuevo Reporte
                </h1>
                
                <form onSubmit={handleGenerarReporte} className="flex flex-col gap-6">
                  {/* Mini Calendar */}
                  <div className="flex flex-col gap-4">
                    <p className="text-gray-800 text-sm font-medium leading-normal">Rango de Fechas</p>
                    
                    <div className="flex flex-col gap-0.5">
                      {/* Calendar Header */}
                      <div className="flex items-center p-1 justify-between">
                        <button type="button" className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined text-lg">chevron_left</span>
                        </button>
                        <p className="text-gray-800 text-sm font-bold leading-tight flex-1 text-center">
                          Diciembre 2023
                        </p>
                        <button type="button" className="flex size-8 items-center justify-center rounded-full hover:bg-gray-100">
                          <span className="material-symbols-outlined text-lg">chevron_right</span>
                        </button>
                      </div>
                      
                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 text-center">
                        {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => (
                          <p key={i} className="text-gray-600 text-xs font-bold leading-normal tracking-[0.015em] flex h-10 w-full items-center justify-center">
                            {day}
                          </p>
                        ))}
                        
                        {/* Previous month days */}
                        {[26, 27, 28, 29, 30].map(day => (
                          <button key={`prev-${day}`} type="button" className="h-10 w-full text-gray-400 text-sm font-medium">
                            {day}
                          </button>
                        ))}
                        
                        {/* Current month days */}
                        <button type="button" className="h-10 w-full text-gray-800 text-sm font-medium">1</button>
                        <button type="button" className="h-10 w-full text-gray-800 text-sm font-medium">2</button>
                        
                        {/* Selected range start */}
                        <button type="button" className="h-10 w-full text-white bg-primary/20 text-sm font-medium">
                          <div className="flex size-full items-center justify-center rounded-l-full bg-primary">3</div>
                        </button>
                        
                        {/* Selected range middle */}
                        {[4, 5, 6, 7, 8].map(day => (
                          <button key={day} type="button" className="h-10 w-full bg-primary/20 text-gray-800 text-sm font-medium">
                            {day}
                          </button>
                        ))}
                        
                        {/* Selected range end */}
                        <button type="button" className="h-10 w-full text-white bg-primary/20 text-sm font-medium">
                          <div className="flex size-full items-center justify-center rounded-r-full bg-primary">9</div>
                        </button>
                        
                        {/* Rest of days */}
                        {[10, 11, 12, 13, 14, 15, 16].map(day => (
                          <button key={day} type="button" className="h-10 w-full text-gray-800 text-sm font-medium">
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Operation Select */}
                  <label className="flex flex-col w-full">
                    <p className="text-gray-800 text-sm font-medium leading-normal pb-2">Operación</p>
                    <select
                      className="form-select w-full rounded-lg text-gray-800 focus:outline-0 focus:ring-2 focus:ring-primary/50 border-gray-200 bg-[#f5f7f8] h-12 text-sm font-normal"
                      value={formData.operacion}
                      onChange={(e) => setFormData({ ...formData, operacion: e.target.value })}
                    >
                      <option value="todas">Todas las operaciones</option>
                      <option value="OP-234-LCL">OP-234-LCL</option>
                      <option value="OP-567-FCL">OP-567-FCL</option>
                    </select>
                  </label>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 bg-primary text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90"
                  >
                    <span className="material-symbols-outlined text-xl">add_circle</span>
                    Generar Reporte
                  </button>
                </form>
              </div>
            </div>

            {/* Right Panel: Report List and Preview */}
            <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
              {/* Report Details */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-gray-800 text-xl font-bold">Historial de Reportes</h2>
                
                {/* Tabs */}
                <div className="mt-4 border-b border-gray-200">
                  <ul className="flex gap-6 -mb-px text-sm font-medium text-center text-gray-500">
                    <li>
                      <button
                        onClick={() => setActiveTab('resumen')}
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                          activeTab === 'resumen'
                            ? 'border-primary text-primary'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined mr-2">checklist</span>
                        Resumen General
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('notificaciones')}
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                          activeTab === 'notificaciones'
                            ? 'border-primary text-primary'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined mr-2">notifications_active</span>
                        Notificaciones
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setActiveTab('incidencias')}
                        className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                          activeTab === 'incidencias'
                            ? 'border-primary text-primary'
                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <span className="material-symbols-outlined mr-2">warning</span>
                        Incidencias
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Report Detail */}
                <div className="py-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Detalle del Reporte #{selectedReport}
                    </h3>
                    <div className="flex gap-2">
                      <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 text-gray-700 gap-2 text-sm font-bold px-4 hover:bg-gray-200">
                        <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                        Descargar PDF
                      </button>
                      <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-100 text-gray-700 gap-2 text-sm font-bold px-4 hover:bg-gray-200">
                        <span className="material-symbols-outlined text-xl">receipt_long</span>
                        Exportar Excel
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="flex flex-col">
                      <p className="text-gray-500">ID de Operación</p>
                      <p className="font-medium text-gray-800">OP-567-FCL</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">Contenedor</p>
                      <p className="font-medium text-gray-800">MSCU-123456-7</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">Ruta</p>
                      <p className="font-medium text-gray-800">Shanghái → Long Beach</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">Fecha de Inicio</p>
                      <p className="font-medium text-gray-800">03 Dic 2023, 08:00 UTC</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">Fecha de Fin</p>
                      <p className="font-medium text-gray-800">09 Dic 2023, 17:30 UTC</p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-gray-500">Estado del Reporte</p>
                      <p className="font-medium text-green-600">Completado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th className="px-6 py-3" scope="col">ID Reporte</th>
                        <th className="px-6 py-3" scope="col">Fecha de Generación</th>
                        <th className="px-6 py-3" scope="col">Rango de Datos</th>
                        <th className="px-6 py-3" scope="col">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportes.map((reporte, index) => (
                        <tr
                          key={reporte.id}
                          className={`border-b ${
                            index === 0
                              ? 'bg-primary/10 text-gray-800 font-medium'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedReport(reporte.id)}
                        >
                          <th className="px-6 py-4 whitespace-nowrap" scope="row">
                            {reporte.id}
                          </th>
                          <td className="px-6 py-4">{reporte.fecha_generacion}</td>
                          <td className="px-6 py-4">{reporte.rango_datos}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${reporte.estadoColor}`}>
                              {reporte.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
