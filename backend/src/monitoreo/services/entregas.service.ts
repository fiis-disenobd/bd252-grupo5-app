import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from '../entities/entrega.entity';
import { EstadoEntrega } from '../../shared/entities/estado-entrega.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { Importador } from '../entities/importador.entity';

export interface CreateEntregaDto {
  id_contenedor: string;
  id_importador: string;
  fecha_entrega: Date;
  lugar_entrega: string;
}

export interface UpdateEntregaDto {
  id_estado_entrega?: string;
  fecha_entrega?: Date;
  lugar_entrega?: string;
}

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
    @InjectRepository(EstadoEntrega)
    private estadoEntregaRepository: Repository<EstadoEntrega>,
    @InjectRepository(Contenedor)
    private contenedorRepository: Repository<Contenedor>,
    @InjectRepository(Importador)
    private importadorRepository: Repository<Importador>,
  ) {}

  // Listar todas las entregas con paginación y filtros
  async findAll(filtros: any = {}) {
    try {
      const { limite = 20, pagina = 1, estado, desde, hasta } = filtros;

      const query = this.entregaRepository
        .createQueryBuilder('entrega')
        .leftJoinAndSelect('entrega.estado_entrega', 'estado_entrega')
        .leftJoinAndSelect('entrega.contenedor', 'contenedor')
        .leftJoinAndSelect('entrega.importador', 'importador')
        .orderBy('entrega.fecha_entrega', 'DESC');

      // Filtros
      if (estado) {
        query.andWhere('entrega.id_estado_entrega = :estado', { estado });
      }
      if (desde) {
        query.andWhere('entrega.fecha_entrega >= :desde', { desde });
      }
      if (hasta) {
        query.andWhere('entrega.fecha_entrega <= :hasta', { hasta });
      }

      const skip = (pagina - 1) * limite;
      query.skip(skip).take(limite);

      const [entregas, total] = await query.getManyAndCount();

      return {
        entregas,
        total,
        pagina: Number(pagina),
        total_paginas: Math.ceil(total / limite),
        por_pagina: Number(limite),
      };
    } catch (error) {
      console.error('Error en findAll entregas:', error.message);
      return {
        entregas: [],
        total: 0,
        pagina: 1,
        total_paginas: 0,
        por_pagina: 20,
      };
    }
  }

  // Obtener una entrega por ID
  async findOne(id: string) {
    try {
      const entrega = await this.entregaRepository.findOne({
        where: { id_entrega: id },
        relations: ['estado_entrega', 'contenedor', 'contenedor.tipo_contenedor', 'importador'],
      });

      if (!entrega) {
        throw new NotFoundException(`Entrega con ID ${id} no encontrada`);
      }

      return entrega;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en findOne entrega:', error.message);
      throw new Error('Error al obtener la entrega');
    }
  }

  // Crear nueva entrega
  async create(data: CreateEntregaDto) {
    try {
      // Generar código único
      const codigo = await this.generarCodigo();

      // Obtener estado inicial (Pendiente)
      const estadoInicial = await this.estadoEntregaRepository.findOne({
        where: { nombre: 'Pendiente' },
      });

      if (!estadoInicial) {
        throw new Error('Estado inicial "Pendiente" no encontrado');
      }

      const entrega = this.entregaRepository.create({
        codigo,
        id_estado_entrega: estadoInicial.id_estado_entrega,
        id_contenedor: data.id_contenedor,
        id_importador: data.id_importador,
        fecha_entrega: data.fecha_entrega || new Date(),
        lugar_entrega: data.lugar_entrega,
      });

      return await this.entregaRepository.save(entrega);
    } catch (error) {
      console.error('Error en create entrega:', error.message);
      throw new Error('Error al crear la entrega');
    }
  }

  // Actualizar entrega
  async update(id: string, data: UpdateEntregaDto) {
    try {
      const entrega = await this.findOne(id);

      if (data.id_estado_entrega !== undefined) {
        entrega.id_estado_entrega = data.id_estado_entrega;
      }
      if (data.fecha_entrega !== undefined) {
        entrega.fecha_entrega = data.fecha_entrega;
      }
      if (data.lugar_entrega !== undefined) {
        entrega.lugar_entrega = data.lugar_entrega;
      }

      return await this.entregaRepository.save(entrega);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en update entrega:', error.message);
      throw new Error('Error al actualizar la entrega');
    }
  }

  // Finalizar entrega (marcar como Entregada)
  async finalize(id: string) {
    try {
      const entrega = await this.entregaRepository.findOne({
        where: { id_entrega: id },
        relations: ['estado_entrega'],
      });

      if (!entrega) {
        throw new NotFoundException(`Entrega con ID ${id} no encontrada`);
      }

      const estadoActual = entrega.estado_entrega?.nombre?.toLowerCase() || '';

      // Solo permitir finalizar si no está ya entregada/cancelada
      const noFinalizable = ['entregada', 'cancelada'];
      if (noFinalizable.includes(estadoActual)) {
        throw new BadRequestException(
          'Solo se pueden finalizar entregas que no estén ya "Entregada" o "Cancelada".',
        );
      }

      // Buscar estado "Entregada"
      const estadoEntregada = await this.estadoEntregaRepository.findOne({
        where: { nombre: 'Entregada' },
      });

      if (!estadoEntregada) {
        throw new Error('Estado "Entregada" no encontrado en la tabla estadoentrega');
      }

      await this.entregaRepository.update(
        { id_entrega: id },
        { id_estado_entrega: estadoEntregada.id_estado_entrega },
      );

      // Devolver entrega actualizada con relaciones
      const entregaActualizada = await this.entregaRepository.findOne({
        where: { id_entrega: id },
        relations: ['estado_entrega', 'contenedor', 'contenedor.tipo_contenedor', 'importador'],
      });

      return entregaActualizada;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error en finalize entrega:', error.message);
      throw new Error('Error al finalizar la entrega');
    }
  }

  // Eliminar entrega
  async remove(id: string) {
    try {
      const entrega = await this.findOne(id);
      await this.entregaRepository.remove(entrega);
      return { message: 'Entrega eliminada correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en remove entrega:', error.message);
      throw new Error('Error al eliminar la entrega');
    }
  }

  // Obtener estados de entrega
  async getEstadosEntrega() {
    try {
      const estados = await this.estadoEntregaRepository.find();
      console.log('Estados de entrega encontrados:', estados.length);
      return estados;
    } catch (error) {
      console.error('Error al obtener estados de entrega:', error.message);
      return [];
    }
  }

  // Obtener estadísticas
  async getEstadisticas() {
    try {
      const total = await this.entregaRepository.count();

      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      const esteMes = await this.entregaRepository
        .createQueryBuilder('entrega')
        .where('entrega.fecha_entrega >= :inicio', { inicio: inicioMes })
        .andWhere('entrega.fecha_entrega <= :fin', { fin: finMes })
        .getCount();

      const pendientes = await this.entregaRepository
        .createQueryBuilder('entrega')
        .leftJoin('entrega.estado_entrega', 'estado')
        .where('estado.nombre = :nombre', { nombre: 'Pendiente' })
        .getCount();

      return {
        total,
        este_mes: esteMes,
        pendientes,
      };
    } catch (error) {
      console.error('Error en getEstadisticas entregas:', error.message);
      return {
        total: 0,
        este_mes: 0,
        pendientes: 0,
      };
    }
  }

  // Obtener contenedores disponibles
  async getContenedoresDisponibles() {
    try {
      // Obtener contenedores que no tienen entrega asignada
      const contenedores = await this.contenedorRepository
        .createQueryBuilder('contenedor')
        .leftJoinAndSelect('contenedor.tipo_contenedor', 'tipo')
        .leftJoin(Entrega, 'entrega', 'entrega.id_contenedor = contenedor.id_contenedor')
        .where('entrega.id_entrega IS NULL')
        .take(100)
        .getMany();

      return contenedores;
    } catch (error) {
      console.error('Error al obtener contenedores disponibles:', error.message);
      return [];
    }
  }

  // Obtener importadores
  async getImportadores() {
    try {
      const importadores = await this.importadorRepository.find({
        take: 100,
      });
      return importadores;
    } catch (error) {
      console.error('Error al obtener importadores:', error.message);
      return [];
    }
  }

  // Generar código único para la entrega
  private async generarCodigo(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');

    // Obtener el último código del mes
    const ultimaEntrega = await this.entregaRepository
      .createQueryBuilder('entrega')
      .where('entrega.codigo LIKE :patron', { patron: `ENT-${año}${mes}-%` })
      .orderBy('entrega.codigo', 'DESC')
      .limit(1)
      .getOne();

    let secuencial = 1;
    if (ultimaEntrega) {
      const match = ultimaEntrega.codigo.match(/-(\d+)$/);
      if (match) {
        secuencial = parseInt(match[1]) + 1;
      }
    }

    return `ENT-${año}${mes}-${secuencial.toString().padStart(4, '0')}`;
  }
}
