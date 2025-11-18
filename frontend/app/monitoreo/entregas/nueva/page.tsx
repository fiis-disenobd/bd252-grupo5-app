"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/monitoreo/Sidebar";
import { TopBar } from "@/components/monitoreo/TopBar";

interface ArchivoSubido {
  id: string;
  nombre: string;
  tipo: string;
}

export default function NuevaEntregaPage() {
  const router = useRouter();
  const [confirmado, setConfirmado] = useState(false);
  const [archivos, setArchivos] = useState<ArchivoSubido[]>([
    { id: '1', nombre: 'foto_entrega_01.jpg', tipo: 'image' },
    { id: '2', nombre: 'documento_recepcion.pdf', tipo: 'pdf' }
  ]);
  
  const [formData, setFormData] = useState({
    importador: '',
    fechaEntrega: '',
    lugarEntrega: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEliminarArchivo = (id: string) => {
    setArchivos(archivos.filter(archivo => archivo.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmado) {
      alert('Por favor confirma que toda la documentación es correcta');
      return;
    }
    alert('Entrega registrada exitosamente (demo)');
    router.push('/monitoreo/operaciones');
  };

  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      
      <div className="flex flex-1 flex-col overflow-y-auto">
        <TopBar title="Registrar Entrega Final" showSearch={false} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-10 bg-[#f5f7f8]">
          <div className="max-w-4xl mx-auto">
            {/* Page Heading */}
            <div className="flex flex-wrap justify-between gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <p className="text-gray-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                  Registrar Entrega Final
                </p>
                <p className="text-gray-500 text-base font-normal leading-normal">
                  Complete el formulario para confirmar la entrega del contenedor al importador.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Information Section */}
              <div className="bg-white border border-gray-200 rounded-xl">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] p-4 sm:p-6 border-b border-gray-200">
                  Información del Contenedor
                </h2>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm font-normal leading-normal">ID del Contenedor</p>
                    <p className="text-gray-800 text-base font-medium leading-normal">MSCU-123456-7</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm font-normal leading-normal">Tipo</p>
                    <p className="text-gray-800 text-base font-medium leading-normal">40' Dry Van</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm font-normal leading-normal">Origen</p>
                    <p className="text-gray-800 text-base font-medium leading-normal">Puerto de Shanghai</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-gray-500 text-sm font-normal leading-normal">Destino</p>
                    <p className="text-gray-800 text-base font-medium leading-normal">Puerto de Manzanillo</p>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-white border border-gray-200 rounded-xl">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] p-4 sm:p-6 border-b border-gray-200">
                  Detalles de la Entrega
                </h2>
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Importador */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="importador">
                        Importador
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                          store
                        </span>
                        <select
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary"
                          id="importador"
                          name="importador"
                          value={formData.importador}
                          onChange={handleInputChange}
                        >
                          <option value="">Seleccionar Importador...</option>
                          <option value="global">Importadora Global S.A.</option>
                          <option value="pacifico">Comercializadora del Pacífico</option>
                          <option value="nacional">Distribuciones Nacionales Ltda.</option>
                        </select>
                      </div>
                    </div>

                    {/* Fecha y Hora */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fechaEntrega">
                        Fecha y Hora de Entrega
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                          calendar_month
                        </span>
                        <input
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary"
                          id="fechaEntrega"
                          name="fechaEntrega"
                          type="datetime-local"
                          value={formData.fechaEntrega}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lugar de Entrega */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lugarEntrega">
                      Lugar de Entrega
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-xl">
                        location_on
                      </span>
                      <textarea
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-primary focus:border-primary"
                        id="lugarEntrega"
                        name="lugarEntrega"
                        placeholder="Av. Industrial 123, Parque Industrial, Manzanillo, Colima, México"
                        rows={3}
                        value={formData.lugarEntrega}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Evidence Section */}
              <div className="bg-white border border-gray-200 rounded-xl">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] p-4 sm:p-6 border-b border-gray-200">
                  Evidencia de Entrega
                </h2>
                <div className="p-4 sm:p-6">
                  {/* Upload Area */}
                  <div className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-primary text-5xl">cloud_upload</span>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra y suelta
                    </p>
                    <p className="text-xs text-gray-500">Fotos, documentos (PDF, DOCX) o firma digital</p>
                  </div>

                  {/* Uploaded Files */}
                  {archivos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {archivos.map((archivo) => (
                        <div key={archivo.id} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-green-500">check_circle</span>
                            <p className="text-sm font-medium text-gray-800">{archivo.nombre}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleEliminarArchivo(archivo.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">
                  Validación Final
                </h2>
                <div className="flex items-start">
                  <input
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                    id="confirmation-checkbox"
                    type="checkbox"
                    checked={confirmado}
                    onChange={(e) => setConfirmado(e.target.checked)}
                  />
                  <label className="ml-3 block text-sm text-gray-700" htmlFor="confirmation-checkbox">
                    Confirmo que toda la documentación y evidencia está completa y es correcta.
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-4 pb-8">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2.5 text-sm font-bold bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!confirmado}
                  className="px-6 py-2.5 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                  Confirmar Entrega
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
