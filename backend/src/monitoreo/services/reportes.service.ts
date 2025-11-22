import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
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

  // Ejecutar proceso batch de cierre diario (esquema analítico)
  async ejecutarCierreDiario(fecha_corte?: string) {
    try {
      const hoy = new Date();
      const fecha = fecha_corte ? new Date(fecha_corte) : hoy;

      // Normalizar a solo fecha (YYYY-MM-DD)
      const fechaStr = fecha.toISOString().slice(0, 10);

      await this.dataSource.query(
        'SELECT monitoreo_analytics.f_cierre_diario_operaciones($1)',
        [fechaStr],
      );

      return {
        message: 'Proceso batch de cierre diario ejecutado correctamente',
        fecha_corte: fechaStr,
      };
    } catch (error: any) {
      console.error('Error al ejecutar cierre diario analítico:', error.message || error);
      throw new Error('Error al ejecutar el proceso batch de cierre diario');
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

  // Resumen analítico basado en el esquema monitoreo_analytics
  async getAnalyticsResumen() {
    try {
      // KPIs globales
      const kpis = await this.dataSource.query(
        `
        SELECT
          COUNT(*) AS total_operaciones,
          AVG(duracion_minutos) AS promedio_duracion_global,
          MIN(df.fecha) AS fecha_min,
          MAX(df.fecha) AS fecha_max
        FROM monitoreo_analytics.factoperacionmonitoreo f
        JOIN monitoreo_analytics.dimfecha df
          ON df.id_fecha = f.id_fecha_corte
        `,
      );

      // Duración promedio por medio de transporte y mes
      const duracionPorMedioMes = await this.dataSource.query(
        `
        SELECT
          df.anio,
          df.mes,
          fom.medio_transporte,
          AVG(fom.duracion_minutos) AS duracion_promedio_min
        FROM monitoreo_analytics.dimfecha df
        JOIN monitoreo_analytics.factoperacionmonitoreo fom
          ON df.id_fecha = fom.id_fecha_corte
        GROUP BY df.anio, df.mes, fom.medio_transporte
        ORDER BY df.anio, df.mes, fom.medio_transporte
        `,
      );

      // Incidencias de alta severidad por buque (top 10)
      const incidenciasAltaPorBuque = await this.dataSource.query(
        `
        SELECT
          db.nombre AS buque,
          SUM(fom.incidencias_alta_severidad) AS total_incidencias_alta
        FROM monitoreo_analytics.factoperacionmonitoreo fom
        JOIN monitoreo_analytics.dimbuque db
          ON db.id_buque = fom.id_buque
        GROUP BY db.nombre
        ORDER BY total_incidencias_alta DESC
        LIMIT 10
        `,
      );

      // Serie de tiempo por fecha y medio de transporte
      const serieTiempoPorMedio = await this.dataSource.query(
        `
        SELECT
          df.fecha,
          f.medio_transporte,
          AVG(f.duracion_minutos) AS duracion_promedio_min,
          SUM(f.incidencias_alta_severidad) AS incidencias_alta
        FROM monitoreo_analytics.factoperacionmonitoreo f
        JOIN monitoreo_analytics.dimfecha df
          ON df.id_fecha = f.id_fecha_corte
        GROUP BY df.fecha, f.medio_transporte
        ORDER BY df.fecha ASC, f.medio_transporte
        `,
      );

      return {
        kpis: kpis[0] || null,
        duracionPorMedioMes,
        incidenciasAltaPorBuque,
        serieTiempoPorMedio,
      };
    } catch (error: any) {
      console.error('Error en getAnalyticsResumen:', error.message || error);
      return {
        kpis: null,
        duracionPorMedioMes: [],
        incidenciasAltaPorBuque: [],
        serieTiempoPorMedio: [],
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
