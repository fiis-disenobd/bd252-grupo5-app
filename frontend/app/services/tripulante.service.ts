import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Tripulante {
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

export const getTripulantes = async (): Promise<Tripulante[]> => {
  try {
    console.log('Obteniendo todos los tripulantes de:', `${API_URL}/tripulantes`);
    const response = await axios.get(`${API_URL}/tripulantes`, {
      timeout: 5000
    });
    
    console.log('Respuesta recibida:', response.data);
    return response.data || [];
  } catch (error: any) {
    console.error('Error al obtener tripulantes:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    if (error.response?.status === 404) {
      console.warn('El endpoint /tripulantes no existe');
      return [];
    }
    
    throw new Error('No se pudieron cargar los tripulantes. Por favor, intente nuevamente más tarde.');
  }
};
