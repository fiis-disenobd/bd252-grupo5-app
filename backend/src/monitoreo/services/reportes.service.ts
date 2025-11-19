import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from '../entities/reporte.entity';

export interface CreateReporteDto {
  detalle: string;
  fecha_reporte?: Date;
}

export interface UpdateReporteDto {
  detalle?: string;
  fecha_reporte?: Date;
}

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private reporteRepository: Repository<Reporte>,
  ) {}

  // Listar todos los reportes con paginación y filtros
  async findAll(filtros: any = {}) {
    try {
      const { limite = 20, pagina = 1, desde, hasta } = filtros;

      const query = this.reporteRepository
        .createQueryBuilder('reporte')
        .orderBy('reporte.fecha_reporte', 'DESC');

      // Filtros de fecha
      if (desde) {
        query.andWhere('reporte.fecha_reporte >= :desde', { desde });
      }
      if (hasta) {
        query.andWhere('reporte.fecha_reporte <= :hasta', { hasta });
      }

      const skip = (pagina - 1) * limite;
      query.skip(skip).take(limite);

      const [reportes, total] = await query.getManyAndCount();

      return {
        reportes,
        total,
        pagina: Number(pagina),
        total_paginas: Math.ceil(total / limite),
        por_pagina: Number(limite),
      };
    } catch (error) {
      console.error('Error en findAll reportes:', error.message);
      return {
        reportes: [],
        total: 0,
        pagina: 1,
        total_paginas: 0,
        por_pagina: 20,
      };
    }
  }

  // Obtener un reporte por ID
  async findOne(id: string) {
    try {
      const reporte = await this.reporteRepository.findOne({
        where: { id_reporte: id },
      });

      if (!reporte) {
        throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
      }

      return reporte;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en findOne reporte:', error.message);
      throw new Error('Error al obtener el reporte');
    }
  }

  // Crear nuevo reporte
  async create(data: CreateReporteDto) {
    try {
      // Generar código único
      const codigo = await this.generarCodigo();

      const reporte = this.reporteRepository.create({
        codigo,
        detalle: data.detalle,
        fecha_reporte: data.fecha_reporte || new Date(),
      });

      return await this.reporteRepository.save(reporte);
    } catch (error) {
      console.error('Error en create reporte:', error.message);
      throw new Error('Error al crear el reporte');
    }
  }

  // Actualizar reporte
  async update(id: string, data: UpdateReporteDto) {
    try {
      const reporte = await this.findOne(id);

      if (data.detalle !== undefined) {
        reporte.detalle = data.detalle;
      }
      if (data.fecha_reporte !== undefined) {
        reporte.fecha_reporte = data.fecha_reporte;
      }

      return await this.reporteRepository.save(reporte);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en update reporte:', error.message);
      throw new Error('Error al actualizar el reporte');
    }
  }

  // Eliminar reporte
  async remove(id: string) {
    try {
      const reporte = await this.findOne(id);
      await this.reporteRepository.remove(reporte);
      return { message: 'Reporte eliminado correctamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en remove reporte:', error.message);
      throw new Error('Error al eliminar el reporte');
    }
  }

  // Obtener estadísticas
  async getEstadisticas() {
    try {
      const total = await this.reporteRepository.count();

      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

      const esteMes = await this.reporteRepository
        .createQueryBuilder('reporte')
        .where('reporte.fecha_reporte >= :inicio', { inicio: inicioMes })
        .andWhere('reporte.fecha_reporte <= :fin', { fin: finMes })
        .getCount();

      const ultimoReporte = await this.reporteRepository
        .createQueryBuilder('reporte')
        .orderBy('reporte.fecha_reporte', 'DESC')
        .limit(1)
        .getOne();

      return {
        total,
        este_mes: esteMes,
        ultimo_reporte: ultimoReporte,
      };
    } catch (error) {
      console.error('Error en getEstadisticas reportes:', error.message);
      return {
        total: 0,
        este_mes: 0,
        ultimo_reporte: null,
      };
    }
  }

  // Generar código único para el reporte
  private async generarCodigo(): Promise<string> {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');

    // Obtener el último código del mes
    const ultimoReporte = await this.reporteRepository
      .createQueryBuilder('reporte')
      .where('reporte.codigo LIKE :patron', { patron: `RPT-${año}${mes}-%` })
      .orderBy('reporte.codigo', 'DESC')
      .getOne();

    let secuencial = 1;
    if (ultimoReporte) {
      const match = ultimoReporte.codigo.match(/-(\d+)$/);
      if (match) {
        secuencial = parseInt(match[1]) + 1;
      }
    }

    return `RPT-${año}${mes}-${secuencial.toString().padStart(4, '0')}`;
  }
}
