import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { PosicionContenedor } from '../entities/posicion-contenedor.entity';
import { Sensor } from '../entities/sensor.entity';

@Injectable()
export class ContenedoresService {
  constructor(
    @InjectRepository(Contenedor)
    private contenedorRepository: Repository<Contenedor>,
    @InjectRepository(PosicionContenedor)
    private posicionRepository: Repository<PosicionContenedor>,
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
  ) {}

  async findAll() {
    try {
      return await this.contenedorRepository.find({
        relations: ['estado_contenedor', 'tipo_contenedor'],
        order: { codigo: 'ASC' },
        take: 100,
      });
    } catch (error) {
      console.error('Error en findAll contenedores:', error.message);
      return []; // Devolver array vacío si hay error
    }
  }

  async findOne(id: string) {
    try {
      return await this.contenedorRepository.findOne({
        where: { id_contenedor: id },
        relations: ['estado_contenedor', 'tipo_contenedor'],
      });
    } catch (error) {
      console.error('Error en findOne contenedor:', error.message);
      return null;
    }
  }

  async findOneDetalle(id: string) {
    try {
      // Obtener contenedor con relaciones
      const contenedor = await this.contenedorRepository.findOne({
        where: { id_contenedor: id },
        relations: ['estado_contenedor', 'tipo_contenedor'],
      });

      if (!contenedor) {
        return null;
      }

      // Obtener sensores del contenedor
      const sensores = await this.sensorRepository.find({
        where: { id_contenedor: id },
        relations: ['tipo_sensor'],
        order: { tipo_sensor: { nombre: 'ASC' } },
      });

      // Obtener última posición GPS
      const ultimaPosicion = await this.posicionRepository.findOne({
        where: { id_contenedor: id },
        order: { fecha_hora: 'DESC' },
      });

      // Obtener historial de posiciones (últimas 10)
      const historialPosiciones = await this.posicionRepository.find({
        where: { id_contenedor: id },
        order: { fecha_hora: 'DESC' },
        take: 10,
      });

      return {
        ...contenedor,
        sensores,
        ultima_posicion: ultimaPosicion,
        historial_posiciones: historialPosiciones,
      };
    } catch (error) {
      console.error('Error en findOneDetalle:', error.message);
      return null;
    }
  }

  async findByEstado(estado: string) {
    try {
      return await this.contenedorRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.estado_contenedor', 'ec')
        .leftJoinAndSelect('c.tipo_contenedor', 'tc')
        .where('ec.nombre = :estado', { estado })
        .orderBy('c.codigo', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error en findByEstado:', error.message);
      return [];
    }
  }

  async findByTipo(tipo: string) {
    try {
      return await this.contenedorRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.estado_contenedor', 'ec')
        .leftJoinAndSelect('c.tipo_contenedor', 'tc')
        .where('tc.nombre = :tipo', { tipo })
        .orderBy('c.codigo', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error en findByTipo:', error.message);
      return [];
    }
  }

  async getEstadisticas() {
    try {
      const total = await this.contenedorRepository.count();
      
      const porEstado = await this.contenedorRepository
        .createQueryBuilder('c')
        .leftJoin('c.estado_contenedor', 'ec')
        .select('ec.nombre', 'estado')
        .addSelect('COUNT(c.id_contenedor)', 'cantidad')
        .groupBy('ec.nombre')
        .getRawMany();

      return {
        total,
        porEstado,
      };
    } catch (error) {
      console.error('Error en getEstadisticas:', error.message);
      return {
        total: 0,
        porEstado: [],
      };
    }
  }
}
