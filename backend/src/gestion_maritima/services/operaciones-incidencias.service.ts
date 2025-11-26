import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';
import { Incidencia } from '../../monitoreo/entities/incidencia.entity';

export interface OperacionConIncidenciasDto {
    codigo_operacion: string;
    tipo_operacion: string;
    buque: string;
    incidencias: {
        id_incidencia: string;
        codigo: string;
        tipo_incidencia: string;
        grado_severidad: number;
        fecha_hora: Date;
        descripcion: string;
        estado: string;
        usuario: string;
    }[];
}

@Injectable()
export class OperacionesIncidenciasService {
    constructor(
        @InjectRepository(OperacionMaritima)
        private operacionMaritimaRepository: Repository<OperacionMaritima>,
        @InjectRepository(Incidencia)
        private incidenciaRepository: Repository<Incidencia>,
    ) { }

    async getOperacionesConIncidencias(
        page: number = 1,
        limit: number = 10,
        search?: string,
        severidadMin?: number,
    ) {
        const skip = (page - 1) * limit;

        // Primero, obtener todas las incidencias con sus relaciones
        let incidenciasQuery = this.incidenciaRepository
            .createQueryBuilder('i')
            .leftJoinAndSelect('i.tipo_incidencia', 'ti')
            .leftJoinAndSelect('i.estado_incidencia', 'ei')
            .leftJoinAndSelect('i.usuario', 'u');

        // Aplicar filtro de severidad si existe
        if (severidadMin) {
            incidenciasQuery = incidenciasQuery.where('i.grado_severidad >= :severidadMin', { severidadMin });
        }

        const incidencias = await incidenciasQuery.getMany();

        // Obtener los IDs de operaciones únicas que tienen incidencias
        const operacionIds = [...new Set(incidencias.map(inc => inc.id_operacion))];

        if (operacionIds.length === 0) {
            return {
                data: [],
                total: 0,
                page,
                limit,
                totalPages: 0,
            };
        }

        // Obtener las operaciones marítimas correspondientes
        let operacionesQuery = this.operacionMaritimaRepository
            .createQueryBuilder('om')
            .leftJoinAndSelect('om.buque', 'b')
            .where('om.id_operacion IN (:...operacionIds)', { operacionIds });

        // Aplicar filtro de búsqueda si existe
        if (search) {
            operacionesQuery = operacionesQuery.andWhere(
                '(om.codigo LIKE :search OR b.nombre LIKE :search)',
                { search: `%${search}%` }
            );
        }

        // Obtener total para paginación
        const total = await operacionesQuery.getCount();

        // Aplicar paginación
        const operaciones = await operacionesQuery
            .skip(skip)
            .take(limit)
            .getMany();

        // Transformar datos
        const resultado = operaciones.map((om) => {
            const incidenciasOperacion = incidencias
                .filter(inc => inc.id_operacion === om.id_operacion)
                .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());

            return {
                codigo_operacion: om.codigo,
                tipo_operacion: 'Marítima',
                buque: om.buque?.nombre || 'N/A',
                incidencias: incidenciasOperacion.map(inc => ({
                    id_incidencia: inc.id_incidencia,
                    codigo: inc.codigo,
                    tipo_incidencia: inc.tipo_incidencia?.nombre || 'N/A',
                    grado_severidad: inc.grado_severidad,
                    fecha_hora: inc.fecha_hora,
                    descripcion: inc.descripcion,
                    estado: inc.estado_incidencia?.nombre || 'N/A',
                    usuario: inc.usuario?.email || 'N/A',
                })),
            };
        });

        return {
            data: resultado,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
