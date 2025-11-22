import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { OperacionMonitoreo } from '../entities/operacion-monitoreo.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';
import { Buque } from '../../shared/entities/buque.entity';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { CreateOperacionDto } from '../dto/create-operacion.dto';
import { Notificacion } from '../entities/notificacion.entity';
import { Entrega } from '../entities/entrega.entity';
import { OperacionEmpleado } from '../../gestion_maritima/entities/operacion-empleado.entity';
import { OperacionContenedor } from '../../gestion_maritima/entities/operacion-contenedor.entity';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';
import { Operador } from '../entities/operador.entity';
import { EstatusNavegacion } from '../../shared/entities/estatus-navegacion.entity';
import { OperacionTerrestre } from '../../operaciones_terrestres/entities/operacion-terrestre.entity';
import { OperacionTerrestreDetalle } from '../../operaciones_terrestres/entities/operacion-terrestre-detalle.entity';

@Injectable()
export class OperacionesService {
  constructor(
    @InjectRepository(Operacion)
    private operacionRepository: Repository<Operacion>,
    @InjectRepository(OperacionMonitoreo)
    private operacionMonitoreoRepository: Repository<OperacionMonitoreo>,
    @InjectRepository(EstadoOperacion)
    private estadoOperacionRepository: Repository<EstadoOperacion>,
    @InjectRepository(Contenedor)
    private contenedorRepository: Repository<Contenedor>,
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Buque)
    private buqueRepository: Repository<Buque>,
    @InjectRepository(Notificacion)
    private notificacionRepository: Repository<Notificacion>,
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
    @InjectRepository(OperacionEmpleado)
    private operacionEmpleadoRepository: Repository<OperacionEmpleado>,
    @InjectRepository(OperacionContenedor)
    private operacionContenedorRepository: Repository<OperacionContenedor>,
    @InjectRepository(OperacionMaritima)
    private operacionMaritimaRepository: Repository<OperacionMaritima>,
    @InjectRepository(Operador)
    private operadorRepository: Repository<Operador>,
    @InjectRepository(EstatusNavegacion)
    private estatusNavegacionRepository: Repository<EstatusNavegacion>,
    @InjectRepository(OperacionTerrestre)
    private operacionTerrestreRepository: Repository<OperacionTerrestre>,
    @InjectRepository(OperacionTerrestreDetalle)
    private operacionTerrestreDetalleRepository: Repository<OperacionTerrestreDetalle>,
  ) {}

  async findAll(estado?: string) {
    try {
      const queryBuilder = this.operacionRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('o.estado_operacion', 'eo')
        .select([
          'o.id_operacion',
          'o.codigo',
          'o.fecha_inicio',
          'o.fecha_fin',
          'eo.nombre',
          'eo.id_estado_operacion',
        ]);

      if (estado) {
        queryBuilder.where('eo.nombre = :estado', { estado });
      }

      queryBuilder.orderBy('o.fecha_inicio', 'DESC');

      const operacionesBase = await queryBuilder.getMany();

      // Enriquecer cada operación con operador, buque y cantidad de contenedores
      const enriquecidas = [] as any[];

      for (const op of operacionesBase) {
        // Operador asignado
        const relacionEmpleado = await this.operacionEmpleadoRepository.findOne({
          where: { id_operacion: op.id_operacion },
          order: { fecha_asignacion: 'DESC' },
        });

        let operadorInfo: any = null;
        if (relacionEmpleado) {
          const operador = await this.operadorRepository.findOne({
            where: { id_empleado: relacionEmpleado.id_empleado },
            relations: ['empleado'],
          });

          if (operador?.empleado) {
            operadorInfo = {
              nombre: `${operador.empleado.nombre} ${operador.empleado.apellido}`,
            };
          }
        }

        // Buque asociado (operación marítima)
        const operacionMaritima = await this.operacionMaritimaRepository.findOne({
          where: { id_operacion: op.id_operacion },
          relations: ['buque'],
        });

        const buqueInfo = operacionMaritima && operacionMaritima.buque
          ? {
              nombre: operacionMaritima.buque.nombre,
            }
          : null;

        // Vehículo asociado (operación terrestre) - solo lectura, si ya existe
        let vehiculoInfo: any = null;
        const opTerrestre = await this.operacionTerrestreRepository.findOne({
          where: { id_operacion: op.id_operacion },
        });

        if (opTerrestre) {
          const detalle = await this.operacionTerrestreDetalleRepository.findOne({
            where: { id_operacion_terrestre: opTerrestre.id_operacion_terrestre },
            relations: ['vehiculo'],
          });

          if (detalle?.vehiculo) {
            vehiculoInfo = {
              placa: detalle.vehiculo.placa,
            };
          }
        }

        // Cantidad real de contenedores asignados
        const cantidadContenedores = await this.operacionContenedorRepository.count({
          where: { id_operacion: op.id_operacion },
        });

        enriquecidas.push({
          ...op,
          operador: operadorInfo,
          buque: buqueInfo,
          vehiculo: vehiculoInfo,
          contenedores_count: cantidadContenedores,
        });
      }

      return enriquecidas;
    } catch (error) {
      console.error('Error en findAll operaciones:', error.message);
      return [];
    }
  }

  async findOne(id: string) {
    const operacion = await this.operacionRepository.findOne({
      where: { id_operacion: id },
      relations: ['estado_operacion'],
    });

    if (!operacion) {
      throw new NotFoundException(`Operación con ID ${id} no encontrada`);
    }

    // Operador asignado (a través de gestion_maritima.operacionempleado -> monitoreo.operador)
    const relacionEmpleado = await this.operacionEmpleadoRepository.findOne({
      where: { id_operacion: id },
      order: { fecha_asignacion: 'DESC' },
    });

    let operadorInfo: any = null;
    if (relacionEmpleado) {
      const operador = await this.operadorRepository.findOne({
        where: { id_empleado: relacionEmpleado.id_empleado },
        relations: ['empleado'],
      });

      if (operador?.empleado) {
        operadorInfo = {
          id_operador: operador.id_operador,
          nombre: `${operador.empleado.nombre} ${operador.empleado.apellido}`,
        };
      }
    }

    // Transporte marítimo (buque) a través de shared.operacionmaritima
    const operacionMaritima = await this.operacionMaritimaRepository.findOne({
      where: { id_operacion: id },
      relations: ['buque'],
    });

    const buqueInfo = operacionMaritima && operacionMaritima.buque
      ? {
          id_buque: operacionMaritima.buque.id_buque,
          nombre: operacionMaritima.buque.nombre,
          matricula: operacionMaritima.buque.matricula,
        }
      : null;

    // Transporte terrestre (vehículo) a través de shared.operacionterrestre + operaciones_terrestres.operacionterrestredetalle
    let vehiculoInfo: any = null;
    const opTerrestre = await this.operacionTerrestreRepository.findOne({
      where: { id_operacion: id },
    });

    if (opTerrestre) {
      const detalle = await this.operacionTerrestreDetalleRepository.findOne({
        where: { id_operacion_terrestre: opTerrestre.id_operacion_terrestre },
        relations: ['vehiculo'],
      });

      if (detalle?.vehiculo) {
        vehiculoInfo = {
          id_vehiculo: detalle.vehiculo.id_vehiculo,
          placa: detalle.vehiculo.placa,
        };
      }
    }

    // Contenedores asignados (gestion_maritima.operacioncontenedor -> shared.contenedor)
    const relacionesContenedores = await this.operacionContenedorRepository.find({
      where: { id_operacion: id },
      relations: ['contenedor', 'contenedor.tipo_contenedor'],
    });

    const contenedores = relacionesContenedores.map((rel) => ({
      codigo: rel.contenedor?.codigo,
      tipo: rel.contenedor?.tipo_contenedor?.nombre,
    }));

    return {
      ...operacion,
      descripcion: null,
      operador: operadorInfo,
      vehiculo: vehiculoInfo,
      buque: buqueInfo,
      contenedores,
    };
  }

  async create(createOperacionDto: CreateOperacionDto) {
    // Determinar estado inicial de la operación
    let estadoId: string | null = null;

    // Si el frontend envía un estado específico, lo usamos directamente
    if (createOperacionDto.id_estado_operacion) {
      estadoId = createOperacionDto.id_estado_operacion;
    } else {
      // Si no, tomamos el primer estado disponible como valor por defecto
      const primerEstado = await this.estadoOperacionRepository.findOne({
        order: { nombre: 'ASC' },
      });

      if (!primerEstado) {
        throw new Error('No hay estados de operación configurados en la base de datos.');
      }

      estadoId = primerEstado.id_estado_operacion;
    }

    // Crear la operación
    const operacion = this.operacionRepository.create({
      codigo: createOperacionDto.codigo,
      fecha_inicio: new Date(createOperacionDto.fecha_inicio),
      id_estado_operacion: estadoId,
    });

    const savedOperacion = await this.operacionRepository.save(operacion);

    // Crear la operación de monitoreo
    const operacionMonitoreo = this.operacionMonitoreoRepository.create({
      id_operacion: savedOperacion.id_operacion,
    });
    await this.operacionMonitoreoRepository.save(operacionMonitoreo);

    // Registrar operador (si se envió)
    if (createOperacionDto.operador_id) {
      const operador = await this.operadorRepository.findOne({
        where: { id_operador: createOperacionDto.operador_id },
      });

      if (operador) {
        const relacion = this.operacionEmpleadoRepository.create({
          id_operacion: savedOperacion.id_operacion,
          id_empleado: operador.id_empleado,
        });
        await this.operacionEmpleadoRepository.save(relacion);
      }
    }

    // Registrar operación marítima si el medio de transporte es buque
    if (createOperacionDto.medio_transporte === 'buque' && createOperacionDto.buque_id) {
      // Estatus de navegación por defecto (primer registro disponible)
      const [estatus] = await this.estatusNavegacionRepository.find({
        order: { nombre: 'ASC' },
        take: 1,
      });

      const operacionMaritima = this.operacionMaritimaRepository.create({
        id_operacion: savedOperacion.id_operacion,
        codigo: `OM-${savedOperacion.codigo}`,
        cantidad_contenedores: createOperacionDto.contenedores?.length || 0,
        id_estatus_navegacion: estatus?.id_estatus_navegacion,
        id_buque: createOperacionDto.buque_id,
        porcentaje_trayecto: 0,
      });

      await this.operacionMaritimaRepository.save(operacionMaritima);
    }

    // Registrar contenedores asignados (por código)
    if (createOperacionDto.contenedores && createOperacionDto.contenedores.length > 0) {
      for (const codigo of createOperacionDto.contenedores) {
        const contenedor = await this.contenedorRepository.findOne({ where: { codigo } });
        if (contenedor) {
          const relacion = this.operacionContenedorRepository.create({
            id_operacion: savedOperacion.id_operacion,
            id_contenedor: contenedor.id_contenedor,
          });
          await this.operacionContenedorRepository.save(relacion);
        }
      }
    }

    return savedOperacion;
  }

  async update(id: string, updateData: any) {
    const operacion = await this.findOne(id);

    // Actualizar campos permitidos
    if (updateData.codigo) operacion.codigo = updateData.codigo;
    if (updateData.fecha_inicio) operacion.fecha_inicio = new Date(updateData.fecha_inicio);
    if (updateData.fecha_fin) operacion.fecha_fin = new Date(updateData.fecha_fin);
    if (updateData.id_estado_operacion) operacion.id_estado_operacion = updateData.id_estado_operacion;

    return await this.operacionRepository.save(operacion);
  }

  async finalize(id: string) {
    const operacion = await this.findOne(id);

    const estadoCompletada = await this.estadoOperacionRepository.findOne({
      where: { nombre: 'Completada' },
    });

    if (!estadoCompletada) {
      throw new Error('Estado "Completada" no encontrado. Por favor, ejecuta los seeders para poblar los estados.');
    }

    operacion.fecha_fin = new Date();
    operacion.id_estado_operacion = estadoCompletada.id_estado_operacion;

    return await this.operacionRepository.save(operacion);
  }

  async remove(id: string) {
    const operacion = await this.findOne(id);

    // Eliminar primero las relaciones en gestion_maritima.operacionempleado para no violar la FK
    await this.operacionEmpleadoRepository.delete({ id_operacion: id });

    // Eliminar también las relaciones en gestion_maritima.operacioncontenedor
    await this.operacionContenedorRepository.delete({ id_operacion: id });

    // Eliminar relaciones en shared.operacionmaritima (y en cascada sus tablas dependientes por id_operacion_maritima)
    await this.operacionMaritimaRepository.delete({ id_operacion: id });

    await this.operacionRepository.remove(operacion);
    return { message: 'Operación eliminada exitosamente', id };
  }

  async getKPIs() {
    try {
      // Obtener el estado "En Curso"
      const estadoEnCurso = await this.estadoOperacionRepository.findOne({
        where: { nombre: 'En Curso' },
      });

      let operacionesActivas = 0;
      
      if (estadoEnCurso) {
        operacionesActivas = await this.operacionRepository.count({
          where: { id_estado_operacion: estadoEnCurso.id_estado_operacion },
        });
      }

      // Contenedores en tránsito (estado "En Transito")
      const contenedoresTransito = await this.contenedorRepository
        .createQueryBuilder('c')
        .leftJoin('c.estado_contenedor', 'ec')
        .where('LOWER(ec.nombre) = :estado', { estado: 'en transito' })
        .getCount();

      // Alertas pendientes: notificaciones de los últimos 7 días
      const haceSieteDias = new Date();
      haceSieteDias.setDate(haceSieteDias.getDate() - 7);

      const alertasPendientes = await this.notificacionRepository.count({
        where: {
          fecha_hora: MoreThanOrEqual(haceSieteDias),
        },
      });

      // Entregas de hoy
      const hoy = new Date();
      const inicioDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const finDia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59, 999);

      const entregasHoy = await this.entregaRepository
        .createQueryBuilder('entrega')
        .where('entrega.fecha_entrega >= :inicio', { inicio: inicioDia })
        .andWhere('entrega.fecha_entrega <= :fin', { fin: finDia })
        .getCount();

      return {
        operaciones_activas: operacionesActivas,
        contenedores_transito: contenedoresTransito,
        alertas_pendientes: alertasPendientes,
        entregas_hoy: entregasHoy,
      };
    } catch (error) {
      console.error('Error en getKPIs:', error);
      // Devolver valores por defecto en caso de error
      return {
        operaciones_activas: 0,
        contenedores_transito: 0,
        alertas_pendientes: 0,
        entregas_hoy: 0,
      };
    }
  }

  async getOperacionesPorEstado() {
    try {
      const resultado = await this.operacionRepository
        .createQueryBuilder('o')
        .leftJoin('o.estado_operacion', 'eo')
        .select('eo.nombre', 'estado')
        .addSelect('COUNT(o.id_operacion)', 'cantidad')
        .groupBy('eo.nombre')
        .orderBy('cantidad', 'DESC')
        .getRawMany();

      return resultado.map(item => ({
        estado: item.estado,
        cantidad: parseInt(item.cantidad),
      }));
    } catch (error) {
      console.error('Error en getOperacionesPorEstado:', error);
      return [];
    }
  }
}
