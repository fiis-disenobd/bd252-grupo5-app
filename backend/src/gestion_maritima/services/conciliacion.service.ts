import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ConciliacionService {
  constructor(private readonly dataSource: DataSource) { }

  // Ejecutar proceso batch de conciliación nocturna
  async ejecutarConciliacionNocturna(fechaCorte?: string) {
    try {
      const fecha = fechaCorte ? new Date(fechaCorte) : new Date();
      const fechaStr = fecha.toISOString().split('T')[0];

      await this.dataSource.query(
        'SELECT gestion_maritima_audit.f_conciliacion_nocturna_operaciones($1)',
        [fechaStr],
      );

      return {
        message: 'Proceso de conciliación nocturna ejecutado correctamente',
        fecha_corte: fechaStr,
      };
    } catch (error: any) {
      console.error('Error al ejecutar conciliación nocturna:', error.message || error);
      throw new Error('Error al ejecutar el proceso de conciliación nocturna');
    }
  }

  // Obtener correcciones aplicadas
  async getCorrecciones(fechaDesde?: string, fechaHasta?: string) {
    try {
      const hoy = new Date();
      const desde = fechaDesde ? new Date(fechaDesde) : new Date(hoy.setDate(hoy.getDate() - 30));
      const hasta = fechaHasta ? new Date(fechaHasta) : new Date();

      // Total de correcciones aplicadas
      const totalCorrecciones = await this.dataSource.query(
        `
        SELECT COUNT(*) as total
        FROM gestion_maritima_audit.FactConciliacionOperacion fco
        JOIN gestion_maritima_audit.DimFecha df ON df.id_fecha = fco.id_fecha_corte
        WHERE df.fecha BETWEEN $1 AND $2
          AND fco.correccion_aplicada = true
        `,
        [desde.toISOString().split('T')[0], hasta.toISOString().split('T')[0]],
      );

      // Correcciones por tipo
      const correccionesPorTipo = await this.dataSource.query(
        `
        SELECT 
          fco.tipo_correccion,
          COUNT(*) as cantidad
        FROM gestion_maritima_audit.FactConciliacionOperacion fco
        JOIN gestion_maritima_audit.DimFecha df ON df.id_fecha = fco.id_fecha_corte
        WHERE df.fecha BETWEEN $1 AND $2
          AND fco.correccion_aplicada = true
        GROUP BY fco.tipo_correccion
        ORDER BY cantidad DESC
        `,
        [desde.toISOString().split('T')[0], hasta.toISOString().split('T')[0]],
      );

      // Lista de operaciones corregidas
      const operacionesCorregidas = await this.dataSource.query(
        `
        SELECT 
          fco.id_operacion,
          o.codigo as codigo_operacion,
          fco.tipo_correccion,
          fco.descripcion_correccion,
          df.fecha as fecha_corte,
          deo_ant.nombre as estado_anterior,
          deo_new.nombre as estado_nuevo,
          fco.duracion_real_horas,
          fco.incidencias_asociadas,
          fco.incidencias_alta_severidad,
          fco.requiere_intervencion_manual
        FROM gestion_maritima_audit.FactConciliacionOperacion fco
        JOIN gestion_maritima_audit.DimFecha df ON df.id_fecha = fco.id_fecha_corte
        JOIN shared.Operacion o ON o.id_operacion = fco.id_operacion
        JOIN gestion_maritima_audit.DimEstadoOperacion deo_ant 
          ON deo_ant.id_estado_operacion = fco.id_estado_operacion_anterior
        JOIN gestion_maritima_audit.DimEstadoOperacion deo_new 
          ON deo_new.id_estado_operacion = fco.id_estado_operacion_nuevo
        WHERE df.fecha BETWEEN $1 AND $2
          AND fco.correccion_aplicada = true
        ORDER BY df.fecha DESC, fco.fecha_registro_batch DESC
        LIMIT 50
        `,
        [desde.toISOString().split('T')[0], hasta.toISOString().split('T')[0]],
      );

      return {
        total_correcciones: parseInt(totalCorrecciones[0]?.total || '0'),
        correcciones_por_tipo: correccionesPorTipo,
        operaciones_corregidas: operacionesCorregidas,
        fecha_desde: desde.toISOString().split('T')[0],
        fecha_hasta: hasta.toISOString().split('T')[0],
      };
    } catch (error: any) {
      console.error('Error al obtener correcciones:', error.message || error);
      throw new Error('Error al obtener las correcciones aplicadas');
    }
  }

  // Obtener métricas para el dashboard
  async getDashboardMetricas() {
    try {
      // KPIs principales
      const kpis = await this.dataSource.query(`
        SELECT
          COUNT(DISTINCT o.id_operacion) as total_operaciones,
          COUNT(DISTINCT CASE WHEN eo.nombre = 'EN_CURSO' THEN o.id_operacion END) as operaciones_activas,
          COUNT(DISTINCT CASE WHEN eo.nombre = 'FINALIZADA' THEN o.id_operacion END) as operaciones_finalizadas,
          COUNT(DISTINCT i.id_incidencia) as total_incidencias,
          COUNT(DISTINCT CASE WHEN i.grado_severidad >= 4 THEN i.id_incidencia END) as incidencias_criticas
        FROM shared.Operacion o
        LEFT JOIN shared.EstadoOperacion eo ON eo.id_estado_operacion = o.id_estado_operacion
        LEFT JOIN shared.Incidencia i ON i.id_operacion = o.id_operacion
        WHERE o.fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
      `);

      // Correcciones recientes (últimos 7 días)
      const correccionesRecientes = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM gestion_maritima_audit.FactConciliacionOperacion fco
        JOIN gestion_maritima_audit.DimFecha df ON df.id_fecha = fco.id_fecha_corte
        WHERE df.fecha >= CURRENT_DATE - INTERVAL '7 days'
          AND fco.correccion_aplicada = true
      `);

      // Operaciones que requieren intervención manual
      const intervencionManual = await this.dataSource.query(`
        SELECT COUNT(*) as total
        FROM gestion_maritima_audit.FactConciliacionOperacion
        WHERE requiere_intervencion_manual = true
          AND fecha_registro_batch >= CURRENT_DATE - INTERVAL '7 days'
      `);

      // Tendencia de correcciones por día (últimos 7 días)
      const tendenciaCorrecciones = await this.dataSource.query(`
        SELECT 
          df.fecha,
          COUNT(*) as cantidad_correcciones
        FROM gestion_maritima_audit.FactConciliacionOperacion fco
        JOIN gestion_maritima_audit.DimFecha df ON df.id_fecha = fco.id_fecha_corte
        WHERE df.fecha >= CURRENT_DATE - INTERVAL '7 days'
          AND fco.correccion_aplicada = true
        GROUP BY df.fecha
        ORDER BY df.fecha ASC
      `);

      // Distribución por tipo de corrección
      const distribucionCorrecciones = await this.dataSource.query(`
        SELECT 
          tipo_correccion,
          COUNT(*) as cantidad
        FROM gestion_maritima_audit.FactConciliacionOperacion
        WHERE fecha_registro_batch >= CURRENT_DATE - INTERVAL '30 days'
          AND correccion_aplicada = true
        GROUP BY tipo_correccion
        ORDER BY cantidad DESC
      `);

      return {
        kpis: {
          total_operaciones: parseInt(kpis[0]?.total_operaciones || '0'),
          operaciones_activas: parseInt(kpis[0]?.operaciones_activas || '0'),
          operaciones_finalizadas: parseInt(kpis[0]?.operaciones_finalizadas || '0'),
          total_incidencias: parseInt(kpis[0]?.total_incidencias || '0'),
          incidencias_criticas: parseInt(kpis[0]?.incidencias_criticas || '0'),
          correcciones_recientes: parseInt(correccionesRecientes[0]?.total || '0'),
          intervencion_manual: parseInt(intervencionManual[0]?.total || '0'),
        },
        tendencia_correcciones: tendenciaCorrecciones,
        distribucion_correcciones: distribucionCorrecciones,
      };
    } catch (error: any) {
      console.error('Error al obtener métricas del dashboard:', error.message || error);
      return {
        kpis: {
          total_operaciones: 0,
          operaciones_activas: 0,
          operaciones_finalizadas: 0,
          total_incidencias: 0,
          incidencias_criticas: 0,
          correcciones_recientes: 0,
          intervencion_manual: 0,
        },
        tendencia_correcciones: [],
        distribucion_correcciones: [],
      };
    }
  }

  // Obtener todas las operaciones marítimas con indicador de corrección
  async getTodasOperaciones() {
    try {
      const operaciones = await this.dataSource.query(`
                SELECT 
                    om.id_operacion,
                    o.codigo as codigo_operacion,
                    o.fecha_inicio,
                    o.fecha_fin,
                    eo.nombre as estado,
                    b.nombre as buque,
                    b.matricula,
                    om.porcentaje_trayecto,
                    COUNT(DISTINCT i.id_incidencia) as total_incidencias,
                    COUNT(DISTINCT CASE WHEN i.grado_severidad >= 4 THEN i.id_incidencia END) as incidencias_criticas,
                    CASE 
                        WHEN fco.id_operacion IS NOT NULL THEN true 
                        ELSE false 
                    END as fue_corregida,
                    fco.tipo_correccion,
                    fco.descripcion_correccion,
                    fco.fecha_registro_batch as fecha_correccion
                FROM shared.OperacionMaritima om
                JOIN shared.Operacion o ON o.id_operacion = om.id_operacion
                LEFT JOIN shared.EstadoOperacion eo ON eo.id_estado_operacion = o.id_estado_operacion
                LEFT JOIN shared.Buque b ON b.id_buque = om.id_buque
                LEFT JOIN shared.Incidencia i ON i.id_operacion = o.id_operacion
                LEFT JOIN (
                    SELECT DISTINCT ON (id_operacion) 
                        id_operacion, 
                        tipo_correccion, 
                        descripcion_correccion,
                        fecha_registro_batch
                    FROM gestion_maritima_audit.FactConciliacionOperacion
                    WHERE correccion_aplicada = true
                    ORDER BY id_operacion, fecha_registro_batch DESC
                ) fco ON fco.id_operacion = om.id_operacion
                WHERE o.fecha_inicio >= CURRENT_DATE - INTERVAL '30 days'
                GROUP BY 
                    om.id_operacion, o.codigo, o.fecha_inicio, o.fecha_fin,
                    eo.nombre, b.nombre, b.matricula, om.porcentaje_trayecto,
                    fco.id_operacion, fco.tipo_correccion, fco.descripcion_correccion,
                    fco.fecha_registro_batch
                ORDER BY o.fecha_inicio DESC
            `);

      return operaciones.map((op: any) => ({
        id_operacion: op.id_operacion,
        codigo_operacion: op.codigo_operacion,
        fecha_inicio: op.fecha_inicio,
        fecha_fin: op.fecha_fin,
        estado: op.estado || 'N/A',
        buque: op.buque || 'N/A',
        matricula: op.matricula || 'N/A',
        porcentaje_trayecto: parseFloat(op.porcentaje_trayecto || '0'),
        total_incidencias: parseInt(op.total_incidencias || '0'),
        incidencias_criticas: parseInt(op.incidencias_criticas || '0'),
        fue_corregida: op.fue_corregida,
        tipo_correccion: op.tipo_correccion,
        descripcion_correccion: op.descripcion_correccion,
        fecha_correccion: op.fecha_correccion,
      }));
    } catch (error: any) {
      console.error('Error al obtener operaciones:', error.message || error);
      return [];
    }
  }
}

