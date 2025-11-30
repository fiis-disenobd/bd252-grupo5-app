const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/gestion-maritima/hallazgos`;

export interface Inspeccion {
    id: string;
    type: string;
    date: string;
    time: string;
    priority: string;
    operationCode: string;
    inspectionCode: string;
    status: string;
}

export interface TipoHallazgo {
    id_tipo_hallazgo: string;
    nombre: string;
}

export interface CreateHallazgoDto {
    id_tipo_hallazgo: string;
    nivel_gravedad: number;
    descripcion: string;
    accion_sugerida?: string;
    id_inspeccion: string;
}

export const hallazgosAPI = {
    async getInspecciones(): Promise<Inspeccion[]> {
        const response = await fetch(`${API_URL}/inspecciones`);
        if (!response.ok) {
            throw new Error('Error fetching inspecciones');
        }
        return response.json();
    },

    async getTiposHallazgo(): Promise<TipoHallazgo[]> {
        const response = await fetch(`${API_URL}/tipos`);
        if (!response.ok) {
            throw new Error('Error fetching tipos hallazgo');
        }
        return response.json();
    },

    async createHallazgo(data: CreateHallazgoDto) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Error creating hallazgo');
        }
        return response.json();
    },
};
