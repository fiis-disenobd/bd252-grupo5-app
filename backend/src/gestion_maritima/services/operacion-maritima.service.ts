import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
            // 1. Get Status IDs
            const estadoOperacion = await this.estadoOperacionRepository.findOne({
                where: { nombre: createDto.estado_nombre },
            });
            if (!estadoOperacion) throw new NotFoundException(`Estado operacion '${createDto.estado_nombre}' not found`);

            const estatusNavegacion = await this.estatusNavegacionRepository.findOne({
                where: { nombre: createDto.estatus_navegacion_nombre || 'En Puerto' },
            });
            if (!estatusNavegacion) throw new NotFoundException(`Estatus navegacion '${createDto.estatus_navegacion_nombre || 'En Puerto'}' not found`);

            // 2. Create Operacion
            const operacion = new Operacion();
            operacion.codigo = createDto.codigo;
            operacion.fecha_inicio = new Date(createDto.fecha_inicio);
            if (createDto.fecha_fin) operacion.fecha_fin = new Date(createDto.fecha_fin);
            operacion.id_estado_operacion = estadoOperacion.id_estado_operacion;

            const savedOperacion = await queryRunner.manager.save(Operacion, operacion);

            // 3. Create OperacionMaritima
            const operacionMaritima = new OperacionMaritima();
            operacionMaritima.id_operacion = savedOperacion.id_operacion;
            operacionMaritima.codigo = createDto.codigo; // Assuming same code
            operacionMaritima.cantidad_contenedores = createDto.cantidad_contenedores || 0;
            operacionMaritima.id_estatus_navegacion = estatusNavegacion.id_estatus_navegacion;
            operacionMaritima.porcentaje_trayecto = createDto.porcentaje_trayecto || 0;
            operacionMaritima.id_buque = createDto.id_buque;

            const savedOperacionMaritima = await queryRunner.manager.save(OperacionMaritima, operacionMaritima);

            // 4. Create OperacionRutaMaritima
            const operacionRuta = new OperacionRutaMaritima();
            operacionRuta.id_operacion_maritima = savedOperacionMaritima.id_operacion_maritima;
            operacionRuta.id_ruta_maritima = createDto.id_ruta_maritima;
            operacionRuta.id_muelle_origen = createDto.id_muelle_origen;
            operacionRuta.id_muelle_destino = createDto.id_muelle_destino;

            await queryRunner.manager.save(OperacionRutaMaritima, operacionRuta);

            // 5. Create OperacionEmpleado and BuqueTripulante
            if (createDto.tripulacion_ids && createDto.tripulacion_ids.length > 0) {
                for (const tripulanteId of createDto.tripulacion_ids) {
                    const tripulante = await this.tripulanteRepository.findOne({ where: { id_tripulante: tripulanteId } });
                    if (tripulante) {
                        // OperacionEmpleado
                        const opEmpleado = new OperacionEmpleado();
                        opEmpleado.id_operacion = savedOperacion.id_operacion;
                        opEmpleado.id_empleado = tripulante.id_empleado;
                        opEmpleado.fecha_asignacion = new Date().toISOString().split('T')[0]; // Current date
                        await queryRunner.manager.save(OperacionEmpleado, opEmpleado);

                        // BuqueTripulante
                        const buqueTripulante = new BuqueTripulante();
                        buqueTripulante.id_buque = createDto.id_buque;
                        buqueTripulante.id_tripulante = tripulanteId;
                        // fecha and hora defaults are handled by DB or entity defaults, but we can set them explicitly if needed
                        // The entity has defaults: CURRENT_DATE, CURRENT_TIME. But TypeORM might not send them if undefined.
                        // Let's rely on DB defaults or set them if they are required and not generated.
                        // The entity definitions I wrote/saw have defaults.
                        await queryRunner.manager.save(BuqueTripulante, buqueTripulante);
                    }
                }
            }

            // 6. Create OperacionContenedor
            if (createDto.contenedor_ids && createDto.contenedor_ids.length > 0) {
                for (const contenedorId of createDto.contenedor_ids) {
                    const opContenedor = new OperacionContenedor();
                    opContenedor.id_operacion = savedOperacion.id_operacion;
                    opContenedor.id_contenedor = contenedorId;
                    opContenedor.fecha_asignacion = new Date().toISOString().split('T')[0];
                    await queryRunner.manager.save(OperacionContenedor, opContenedor);
                }
            }

            await queryRunner.commitTransaction();
            return savedOperacionMaritima;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            console.error('Error creating maritime operation:', err);
            throw new InternalServerErrorException('Failed to create maritime operation');
        } finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        const operations = await this.dataSource.getRepository(OperacionMaritima)
            .createQueryBuilder('om')
            .leftJoinAndSelect('om.operacion', 'op')
            .leftJoinAndSelect('om.buque', 'buque')
            .leftJoinAndSelect('om.estatus_navegacion', 'estatus')
            .leftJoinAndSelect('op.estado_operacion', 'estado')
            // Join with OperacionContenedor to get containers
            .leftJoinAndMapMany('op.operacionContenedores', OperacionContenedor, 'oc', 'oc.id_operacion = op.id_operacion')
            // Join with Contenedor
            .leftJoinAndSelect('oc.contenedor', 'contenedor')
            // Join with ContenedorMercancia
            .leftJoinAndMapMany('contenedor.mercancias', 'ContenedorMercancia', 'cm', 'cm.id_contenedor = contenedor.id_contenedor')
            .getMany();

        return operations.map(om => {
            // Extract merchandise types
            const merchandiseTypes = new Set<string>();
            const op = om.operacion as any;
            if (op.operacionContenedores) {
                op.operacionContenedores.forEach((oc: any) => {
                    if (oc.contenedor && oc.contenedor.mercancias) {
                        oc.contenedor.mercancias.forEach((cm: any) => {
                            merchandiseTypes.add(cm.tipo_mercancia);
                        });
                    }
                });
            }

            return {
                code: om.codigo,
                containers: om.cantidad_contenedores,
                status: om.estatus_navegacion?.nombre || 'Desconocido',
                progress: Number(om.porcentaje_trayecto),
                ship: om.buque?.nombre || 'Desconocido',
                merchandise: Array.from(merchandiseTypes).join(', ') || 'Sin mercancía',
                correctionNote: null // Placeholder as logic for this is not defined yet
            };
        });
    }
}
