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
                    usuario: inc.usuario?.correo_electronico || 'N/A',
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

    async marcarParaInvestigacion(
        codigoOperacion: string,
        tipoInspeccion: string,
        prioridad: string,
        fecha: string,
        hora: string,
        idUsuario?: string,
    ) {
        try {
            // Buscar la operación marítima por código
            const operacionMaritima = await this.operacionMaritimaRepository.findOne({
                where: { codigo: codigoOperacion },
                relations: ['operacion'],
            });

            if (!operacionMaritima) {
                throw new Error('Operación no encontrada');
            }

            const idOperacion = operacionMaritima.id_operacion;

            // Generar código de inspección
            const codigoInspeccion = `INS-${Date.now()}`;

            // Combinar fecha y hora
            const fechaHora = `${fecha} ${hora}:00`;

            // Insertar inspección usando query raw
            const result = await this.operacionMaritimaRepository.query(`
                INSERT INTO gestion_maritima.Inspeccion (
                    id_inspeccion,
                    codigo,
                    fecha,
                    id_tipo_inspeccion,
                    id_estado_inspeccion,
                    id_prioridad,
                    id_operacion,
                    id_usuario
                ) VALUES (
                    gen_random_uuid(),
                    $1,
                    $2::timestamp,
                    (SELECT id_tipo_inspeccion FROM shared.TipoInspeccion WHERE nombre = $3 LIMIT 1),
                    (SELECT id_estado_inspeccion FROM shared.EstadoInspeccion WHERE nombre = 'Pendiente' LIMIT 1),
                    (SELECT id_prioridad FROM gestion_maritima.Prioridad WHERE nombre = $4 LIMIT 1),
                    $5,
                    $6
                ) RETURNING id_inspeccion, codigo
            `, [codigoInspeccion, fechaHora, tipoInspeccion, prioridad, idOperacion, idUsuario || null]);

            return {
                success: true,
                inspeccion: result[0],
                message: 'Operación marcada para investigación exitosamente',
            };
        } catch (error) {
            console.error('Error al marcar para investigación:', error);
            throw error;
        }
    }
}
