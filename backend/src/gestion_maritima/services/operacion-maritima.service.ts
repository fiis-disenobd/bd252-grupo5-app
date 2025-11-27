import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOperacionMaritimaDto } from '../dto/create-operacion-maritima.dto';
import { Operacion } from '../../shared/entities/operacion.entity';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';
import { OperacionRutaMaritima } from '../entities/operacion-ruta-maritima.entity';
import { OperacionEmpleado } from '../entities/operacion-empleado.entity';
import { OperacionContenedor } from '../entities/operacion-contenedor.entity';
import { BuqueTripulante } from '../../personal_tripulacion/entities/buque-tripulante.entity';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { EstatusNavegacion } from '../../shared/entities/estatus-navegacion.entity';
import { Tripulante } from '../../shared/entities/tripulante.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { ContenedorMercancia } from '../../shared/entities/contenedor-mercancia.entity';

@Injectable()
export class OperacionMaritimaService {
    constructor(
        private dataSource: DataSource,
        @InjectRepository(EstadoOperacion)
        private estadoOperacionRepository: Repository<EstadoOperacion>,
        @InjectRepository(EstatusNavegacion)
        private estatusNavegacionRepository: Repository<EstatusNavegacion>,
        @InjectRepository(Tripulante)
        private tripulanteRepository: Repository<Tripulante>,
    ) { }

    async create(createDto: CreateOperacionMaritimaDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (createDto.fecha_fin && new Date(createDto.fecha_fin) <= new Date(createDto.fecha_inicio)) {
                throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
            }

            // Paso 1: Insertar operación base
            const operacionResult = await queryRunner.query(`
                INSERT INTO shared.Operacion (
                    id_operacion,
                    codigo,
                    fecha_inicio,
                    fecha_fin,
                    id_estado_operacion
                ) VALUES (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    (SELECT id_estado_operacion FROM shared.EstadoOperacion WHERE nombre = $4 LIMIT 1)
                ) RETURNING id_operacion;
            `, [
                createDto.codigo,
                createDto.fecha_inicio,
                createDto.fecha_fin || null,
                createDto.estado_nombre
            ]);

            const idOperacion = operacionResult[0].id_operacion;

            // Paso 2: Insertar operación marítima
            // Generamos un código para la operación marítima basado en el de la operación
            const codigoMaritimo = createDto.codigo.replace('OP-', 'OPM-');

            const opMaritimaResult = await queryRunner.query(`
                INSERT INTO shared.OperacionMaritima (
                    id_operacion_maritima,
                    id_operacion,
                    codigo,
                    cantidad_contenedores,
                    id_estatus_navegacion,
                    porcentaje_trayecto,
                    id_buque
                ) VALUES (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    (SELECT id_estatus_navegacion FROM shared.EstatusNavegacion WHERE nombre = $4 LIMIT 1),
                    $5,
                    $6
                ) RETURNING id_operacion_maritima;
            `, [
                idOperacion,
                codigoMaritimo,
                createDto.cantidad_contenedores,
                createDto.estatus_navegacion_nombre || 'En Puerto',
                createDto.porcentaje_trayecto || 0,
                createDto.id_buque
            ]);

            const idOperacionMaritima = opMaritimaResult[0].id_operacion_maritima;

            // Paso 3: Asociar ruta marítima
            await queryRunner.query(`
                INSERT INTO gestion_maritima.OperacionRutaMaritima (
                    id_operacion_ruta_maritima,
                    id_operacion_maritima,
                    id_ruta_maritima,
                    id_muelle_origen,
                    id_muelle_destino
                ) VALUES (
                    gen_random_uuid(),
                    $1,
                    $2,
                    $3,
                    $4
                );
            `, [
                idOperacionMaritima,
                createDto.id_ruta_maritima,
                createDto.id_muelle_origen,
                createDto.id_muelle_destino
            ]);

            // Paso 4: Asignar contenedores
            if (createDto.contenedor_ids && createDto.contenedor_ids.length > 0) {
                for (const idContenedor of createDto.contenedor_ids) {
                    await queryRunner.query(`
                        INSERT INTO gestion_maritima.OperacionContenedor (
                            id_operacion_contenedor,
                            id_operacion,
                            id_contenedor,
                            fecha_asignacion
                        ) VALUES (
                            gen_random_uuid(),
                            $1,
                            $2,
                            CURRENT_DATE
                        );
                    `, [idOperacion, idContenedor]);
                }
            }

            // Paso 5: Asignar tripulación
            if (createDto.tripulacion_ids && createDto.tripulacion_ids.length > 0) {
                for (const idTripulante of createDto.tripulacion_ids) {
                    await queryRunner.query(`
                        INSERT INTO gestion_maritima.OperacionEmpleado (
                            id_operacion_empleado,
                            id_operacion,
                            id_empleado,
                            fecha_asignacion
                        ) VALUES (
                            gen_random_uuid(),
                            $1,
                            (SELECT id_empleado FROM shared.Tripulante WHERE id_tripulante = $2),
                            CURRENT_DATE
                        );
                    `, [idOperacion, idTripulante]);
                }
            }

            await queryRunner.commitTransaction();
            return { id_operacion: idOperacion, id_operacion_maritima: idOperacionMaritima };

        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error('Error creating maritime operation:', err);
            throw new InternalServerErrorException('Failed to create maritime operation');
        } finally {
            await queryRunner.release();
        }
    }
    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [operations, total] = await this.dataSource.getRepository(OperacionMaritima)
            .createQueryBuilder('om')
            .leftJoinAndSelect('om.operacion', 'op')
            .leftJoinAndSelect('om.buque', 'buque')
            .leftJoinAndSelect('om.estatus_navegacion', 'estatus')
            .leftJoinAndSelect('op.estado_operacion', 'estado')
            .orderBy('om.codigo', 'ASC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        return {
            data: operations.map(om => {
                return {
                    code: om.codigo,
                    containers: om.cantidad_contenedores,
                    status: om.operacion?.estado_operacion?.nombre || 'Desconocido',
                    progress: Number(om.porcentaje_trayecto),
                    ship: om.buque?.nombre || 'Desconocido',
                    merchandise: 'Sin mercancía', // Simplified for now
                    correctionNote: null
                };
            }),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}
