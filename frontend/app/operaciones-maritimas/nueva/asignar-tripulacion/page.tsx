"use client";

import { Header } from "@/components/Header";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTripulantes } from '@/app/services/tripulante.service';
import { asignarTripulantesABuque } from '@/app/services/buque-tripulante.service';

interface Tripulante {
  id_tripulante: string;
  id_empleado: string;
  disponibilidad: boolean;
  nacionalidad: string;
  empleado: {
    id_empleado: string;
    nombre: string;
    apellido: string;
    codigo: string;
  };
}

interface Buque {
  id_buque: string;
  matricula: string;
  nombre: string;
  capacidad: number;
  peso: number;
  ubicacion_actual: string;
}

export default function AsignarTripulacionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idBuque = searchParams.get('id_buque');
  
  const [tripulantes, setTripulantes] = useState<Tripulante[]>([]);
  const [buque, setBuque] = useState<Buque | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asignando, setAsignando] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener tripulantes
        const todosLosTripulantes = await getTripulantes();
        console.log('Tripulantes recibidos:', todosLosTripulantes);
        
        // Filtrar solo los tripulantes disponibles
        const disponibles = todosLosTripulantes.filter(tripulante => tripulante.disponibilidad);
        console.log('Tripulantes disponibles:', disponibles);
        
        setTripulantes(disponibles);

        // Obtener datos del buque si hay id_buque
        if (idBuque) {
          const response = await fetch(`http://localhost:3001/monitoreo/buques/${idBuque}`);
          if (response.ok) {
            const buqueData = await response.json();
            setBuque(buqueData);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error al cargar los datos: ${errorMessage}`);
        console.error('Error detallado:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idBuque]);

  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set());
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <p>Cargando tripulantes...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 text-red-500">
            <p>{error}</p>
          </div>
        </main>
      </div>
    );
  }

  const toggleSeleccion = (id: string) => {
    const nuevosSeleccionados = new Set(seleccionados);
    if (nuevosSeleccionados.has(id)) {
      nuevosSeleccionados.delete(id);
    } else {
      nuevosSeleccionados.add(id);
    }
    setSeleccionados(nuevosSeleccionados);
  };

  const handleAsignar = async () => {
  if (!idBuque || seleccionados.size === 0) return;

  setAsignando(true);
  try {
    await asignarTripulantesABuque(idBuque, Array.from(seleccionados));
    console.log('Tripulantes asignados exitosamente:', Array.from(seleccionados));
    
    // Redirigir de vuelta a la página anterior
    router.back();
  } catch (error) {
    console.error('Error al asignar tripulantes:', error);
    setError('Error al asignar tripulantes. Por favor, intente nuevamente.');
  } finally {
    setAsignando(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Asignar Tripulación
            </h1>
            {buque ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Buque: <span className="font-semibold">{buque.nombre}</span> ({buque.matricula})
              </p>
            ) : idBuque ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Buque ID: {idBuque}
              </p>
            ) : (
              <p className="text-sm text-red-600 dark:text-red-400">
                No se ha seleccionado ningún buque
              </p>
            )}
          </div>
          <Link 
            href="/operaciones-maritimas/nueva"
            className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          >
            Volver
          </Link>
        </div>

        <div className="overflow-x-auto">
          {tripulantes.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-300">
              No hay tripulantes disponibles en este momento.
            </div>
          ) : (
            <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Seleccionar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre Completo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nacionalidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {tripulantes.map((tripulante) => (
                  <tr 
                    key={tripulante.id_tripulante}
                    className={`hover:bg-gray-50 dark:hover:bg-slate-700 ${
                      seleccionados.has(tripulante.id_tripulante) ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={seleccionados.has(tripulante.id_tripulante)}
                        onChange={() => toggleSeleccion(tripulante.id_tripulante)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {tripulante.empleado.codigo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tripulante.empleado.nombre} {tripulante.empleado.apellido}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {tripulante.nacionalidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tripulante.disponibilidad 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {tripulante.disponibilidad ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleAsignar}
            disabled={seleccionados.size === 0 || !idBuque || asignando}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              seleccionados.size > 0 && idBuque && !asignando
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {asignando ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin">refresh</span>
                Asignando...
              </span>
            ) : (
              `Asignar Tripulantes (${seleccionados.size})`
            )}
          </button>
        </div>
        </div>
      </main>
    </div>
  );
}
