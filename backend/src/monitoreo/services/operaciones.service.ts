import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { OperacionMonitoreo } from '../entities/operacion-monitoreo.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';
import { Buque } from '../../shared/entities/buque.entity';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { CreateOperacionDto } from '../dto/create-operacion.dto';

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

      return {
        operaciones_activas: operacionesActivas,
        contenedores_transito: 0, // TODO: Implementar
        alertas_pendientes: 0, // TODO: Implementar
        entregas_hoy: 0, // TODO: Implementar
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
}
