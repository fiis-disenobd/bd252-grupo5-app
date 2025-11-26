const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface TipoIncidencia {
    id_tipo_incidencia: string;
    nombre: string;
}

class TiposIncidenciaAPI {
    private baseURL = `${API_BASE_URL}/gestion-maritima/tipos-incidencia`;

    async getTipos(): Promise<TipoIncidencia[]> {
        const response = await fetch(this.baseURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching incident types: ${response.statusText}`);
        }

        return response.json();
    }
}

export const tiposIncidenciaAPI = new TiposIncidenciaAPI();
