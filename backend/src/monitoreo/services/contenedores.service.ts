import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { PosicionContenedor } from '../entities/posicion-contenedor.entity';
import { Sensor } from '../entities/sensor.entity';
import { EstadoContenedor } from '../../shared/entities/estado-contenedor.entity';
import { TipoContenedor } from '../../shared/entities/tipo-contenedor.entity';
import { DocumentacionContenedor } from '../entities/documentacion-contenedor.entity';

@Injectable()
export class ContenedoresService {
  constructor(
    @InjectRepository(Contenedor)
    private contenedorRepository: Repository<Contenedor>,
    @InjectRepository(PosicionContenedor)
    private posicionRepository: Repository<PosicionContenedor>,
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(EstadoContenedor)
    private estadoContenedorRepository: Repository<EstadoContenedor>,
    @InjectRepository(TipoContenedor)
    private tipoContenedorRepository: Repository<TipoContenedor>,
    @InjectRepository(DocumentacionContenedor)
    private documentacionContenedorRepository: Repository<DocumentacionContenedor>,
  ) {}

  // Crear contenedor
  async create(data: {
    codigo: string;
    peso: number;
    capacidad: number;
    dimensiones: string;
    id_estado_contenedor: string;
    id_tipo_contenedor: string;
  }) {
    try {
      const contenedor = this.contenedorRepository.create({
        codigo: data.codigo,
        peso: data.peso,
        capacidad: data.capacidad,
        dimensiones: data.dimensiones,
        id_estado_contenedor: data.id_estado_contenedor,
        id_tipo_contenedor: data.id_tipo_contenedor,
      });

      return await this.contenedorRepository.save(contenedor);
    } catch (error) {
      console.error('Error en create contenedor:', error.message);
      throw error;
    }
  }

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
        relations: ['tipo_sensor', 'rol_sensor'],
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

      // Obtener documentación asociada (boleta final del contenedor)
      const documentacionContenedor = await this.documentacionContenedorRepository.findOne({
        where: { id_contenedor: id },
        relations: ['documentacion', 'documentacion.tipo_documento'],
      });

      return {
        ...contenedor,
        sensores,
        ultima_posicion: ultimaPosicion,
        historial_posiciones: historialPosiciones,
        documentacion: documentacionContenedor?.documentacion || null,
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

  // Listar estados de contenedor
  async getEstadosContenedor() {
    try {
      return await this.estadoContenedorRepository.find({ order: { nombre: 'ASC' } });
    } catch (error) {
      console.error('Error al obtener estados de contenedor:', error.message);
      return [];
    }
  }

  // Listar tipos de contenedor
  async getTiposContenedor() {
    try {
      return await this.tipoContenedorRepository.find({ order: { nombre: 'ASC' } });
    } catch (error) {
      console.error('Error al obtener tipos de contenedor:', error.message);
      return [];
    }
  }
}
