const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DashboardMetricas {
    kpis: {
        total_operaciones: number;
        operaciones_activas: number;
        operaciones_finalizadas: number;
        total_incidencias: number;
        incidencias_criticas: number;
        correcciones_recientes: number;
        intervencion_manual: number;
    };
    tendencia_correcciones: Array<{
        fecha: string;
        cantidad_correcciones: number;
    }>;
    distribucion_correcciones: Array<{
        tipo_correccion: string;
        cantidad: number;
    }>;
}

export interface Correccion {
    id_operacion: string;
    codigo_operacion: string;
    tipo_correccion: string;
    descripcion_correccion: string;
    fecha_corte: string;
    estado_anterior: string;
    estado_nuevo: string;
    duracion_real_horas: number;
    incidencias_asociadas: number;
    incidencias_alta_severidad: number;
    requiere_intervencion_manual: boolean;
}

export interface CorreccionesResponse {
    total_correcciones: number;
    correcciones_por_tipo: Array<{
        tipo_correccion: string;
        cantidad: number;
    }>;
    operaciones_corregidas: Correccion[];
    fecha_desde: string;
    fecha_hasta: string;
}

export interface OperacionMaritima {
    id_operacion: string;
    codigo_operacion: string;
    fecha_inicio: string;
    fecha_fin: string | null;
    estado: string;
    buque: string;
    matricula: string;
    porcentaje_trayecto: number;
    total_incidencias: number;
    incidencias_criticas: number;
    fue_corregida: boolean;
    tipo_correccion: string | null;
    descripcion_correccion: string | null;
    fecha_correccion: string | null;
}

export const conciliacionAPI = {
    async ejecutarBatch(fechaCorte?: string) {
        const response = await fetch(`${API_URL}/gestion-maritima/conciliacion-nocturna`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha_corte: fechaCorte }),
        });

        if (!response.ok) {
            throw new Error('Error al ejecutar el proceso batch');
        }

        return response.json();
    },

    async getMetricas(): Promise<DashboardMetricas> {
        const response = await fetch(`${API_URL}/gestion-maritima/dashboard/metricas`);

        if (!response.ok) {
            throw new Error('Error al obtener métricas del dashboard');
        }

        return response.json();
    },

    async getCorrecciones(fechaDesde?: string, fechaHasta?: string): Promise<CorreccionesResponse> {
        const params = new URLSearchParams();
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);

        const url = `${API_URL}/gestion-maritima/correcciones${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener correcciones');
        }

        return response.json();
    },

    async getOperaciones(): Promise<OperacionMaritima[]> {
        const response = await fetch(`${API_URL}/gestion-maritima/operaciones`);

        if (!response.ok) {
            throw new Error('Error al obtener operaciones');
        }

        return response.json();
    },
};
