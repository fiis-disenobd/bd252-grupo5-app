const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface CreateIncidenciaDto {
    codigo_operacion: string;
    descripcion: string;
    grado_severidad: number;
    id_tipo_incidencia: string;
}

export const incidenciasAPI = {
    create: async (data: CreateIncidenciaDto, token: string) => {
        const response = await fetch(`${API_URL}/gestion-maritima/incidencias`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al registrar la incidencia");
        }

        return response.json();
    },
};
