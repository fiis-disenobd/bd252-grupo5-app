const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface OperacionConIncidencias {
    codigo_operacion: string;
    tipo_operacion: string;
    buque: string;
    incidencias: {
        id_incidencia: string;
        codigo: string;
        tipo_incidencia: string;
        grado_severidad: number;
        fecha_hora: string;
        descripcion: string;
        estado: string;
        usuario: string;
    }[];
}

export interface OperacionesIncidenciasResponse {
    data: OperacionConIncidencias[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const operacionesIncidenciasAPI = {
    getOperacionesConIncidencias: async (
        page: number = 1,
        limit: number = 10,
        search?: string,
        severidadMin?: number,
    ): Promise<OperacionesIncidenciasResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (severidadMin) params.append('severidadMin', severidadMin.toString());

        const response = await fetch(
            `${API_URL}/gestion-maritima/operaciones-incidencias?${params.toString()}`
        );

        if (!response.ok) {
            throw new Error('Error al obtener operaciones con incidencias');
        }

        return response.json();
    },
};
