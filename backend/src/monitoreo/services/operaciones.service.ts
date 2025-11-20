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

      return await queryBuilder.getMany();
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

    return operacion;
  }

  async create(createOperacionDto: CreateOperacionDto) {
    // Obtener el estado "En curso"
    const estadoEnCurso = await this.estadoOperacionRepository.findOne({
      where: { nombre: 'En curso' },
    });

    if (!estadoEnCurso) {
      throw new Error('Estado "En curso" no encontrado. Por favor, ejecuta los seeders para poblar los estados.');
    }

    // Crear la operación
    const operacion = this.operacionRepository.create({
      codigo: createOperacionDto.codigo,
      fecha_inicio: new Date(createOperacionDto.fecha_inicio),
      id_estado_operacion: estadoEnCurso.id_estado_operacion,
    });

    const savedOperacion = await this.operacionRepository.save(operacion);

    // Crear la operación de monitoreo
    const operacionMonitoreo = this.operacionMonitoreoRepository.create({
      id_operacion: savedOperacion.id_operacion,
    });

    await this.operacionMonitoreoRepository.save(operacionMonitoreo);

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
