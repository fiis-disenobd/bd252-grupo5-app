const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface BuqueTripulante {
  id_buque_tripulante: string;
  id_buque: string;
  id_tripulante: string;
  fecha_asignacion: string;
  hora_asignacion: string;
  buque?: {
    id_buque: string;
    nombre: string;
    matricula: string;
  };
  tripulante?: {
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
  };
}

export interface CreateBuqueTripulanteDto {
  id_buque: string;
  id_tripulante: string;
  fecha_asignacion?: string;
  hora_asignacion?: string;
}

// Asignar múltiples tripulantes a un buque
export async function asignarTripulantesABuque(id_buque: string, ids_tripulantes: string[]) {
  try {
    const asignaciones = ids_tripulantes.map(id_tripulante => ({
      id_buque,
      id_tripulante,
      fecha_asignacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      hora_asignacion: new Date().toTimeString().split(' ')[0].substring(0, 5), // HH:MM
    }));

    const promesas = asignaciones.map(asignacion =>
      fetch(`${API_URL}/buque-tripulante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asignacion),
      })
    );

    const resultados = await Promise.all(promesas);
    
    // Verificar que todas las peticiones fueron exitosas
    const errores = resultados.filter(res => !res.ok);
    if (errores.length > 0) {
      throw new Error(`Error al asignar ${errores.length} tripulantes`);
    }

    return await Promise.all(resultados.map(res => res.json()));
  } catch (error) {
    console.error('Error al asignar tripulantes:', error);
    throw error;
  }
}

// Obtener tripulantes asignados a un buque
export async function getTripulantesPorBuque(id_buque: string): Promise<BuqueTripulante[]> {
  try {
    const response = await fetch(`${API_URL}/buque-tripulante/buque/${id_buque}`);
    if (!response.ok) {
      throw new Error('Error al obtener tripulantes del buque');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener tripulantes del buque:', error);
    throw error;
  }
}

// Eliminar asignación específica
export async function eliminarAsignacion(id_buque: string, id_tripulante: string) {
  try {
    const response = await fetch(
      `${API_URL}/buque-tripulante/asignacion?id_buque=${id_buque}&id_tripulante=${id_tripulante}`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error('Error al eliminar asignación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    throw error;
  }
}
