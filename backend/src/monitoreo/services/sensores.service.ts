import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Sensor } from '../entities/sensor.entity';
import { Notificacion } from '../entities/notificacion.entity';

@Injectable()
export class SensoresService {
  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(Notificacion)
    private notificacionRepository: Repository<Notificacion>,
  ) {}

  async findByContenedor(id_contenedor: string) {
    return await this.sensorRepository.find({
      where: { id_contenedor },
      relations: ['tipo_sensor', 'rol_sensor'],
    });
  }

  async findNotificaciones(filtros: any = {}) {
    try {
      const { tipo, estado, fecha_desde, fecha_hasta, limite = 50, pagina = 1 } = filtros;
      
      const query = this.notificacionRepository
        .createQueryBuilder('notificacion')
        .leftJoinAndSelect('notificacion.tipo_notificacion', 'tipo_notificacion')
        .leftJoinAndSelect('notificacion.sensor', 'sensor')
        .leftJoinAndSelect('sensor.tipo_sensor', 'tipo_sensor')
        .leftJoinAndSelect('sensor.contenedor', 'contenedor')
        .orderBy('notificacion.fecha_hora', 'DESC');

      // Aplicar filtros
      if (tipo) {
        // El frontend envía el nombre del tipo de notificación, alineado con getEstadisticasNotificaciones
        query.andWhere('tipo_notificacion.nombre = :tipo', { tipo });
      }

      if (fecha_desde) {
        query.andWhere('notificacion.fecha_hora >= :fecha_desde', { fecha_desde });
      }

      if (fecha_hasta) {
        query.andWhere('notificacion.fecha_hora <= :fecha_hasta', { fecha_hasta });
      }

      // Paginación
      const skip = (pagina - 1) * limite;
      query.skip(skip).take(limite);

      const [notificaciones, total] = await query.getManyAndCount();

      return {
        notificaciones,
        total,
        pagina: Number(pagina),
        total_paginas: Math.ceil(total / limite),
        por_pagina: Number(limite),
      };
    } catch (error) {
      console.error('Error en findNotificaciones:', error.message);
      return {
        notificaciones: [],
        total: 0,
        pagina: 1,
        total_paginas: 0,
        por_pagina: 50,
      };
    }
  }

  async getEstadisticasNotificaciones() {
    try {
      const total = await this.notificacionRepository.count();
      
      const porTipo = await this.notificacionRepository
        .createQueryBuilder('notificacion')
        .leftJoin('notificacion.tipo_notificacion', 'tipo')
        .select('tipo.nombre', 'tipo')
        .addSelect('COUNT(*)', 'cantidad')
        .groupBy('tipo.nombre')
        .getRawMany();

      const ultimaSemana = new Date();
      ultimaSemana.setDate(ultimaSemana.getDate() - 7);
      
      const recientes = await this.notificacionRepository.count({
        where: {
          fecha_hora: MoreThanOrEqual(ultimaSemana),
        },
      });

      return {
        total,
        por_tipo: porTipo,
        ultima_semana: recientes,
      };
    } catch (error) {
      console.error('Error en getEstadisticasNotificaciones:', error.message);
      return {
        total: 0,
        por_tipo: [],
        ultima_semana: 0,
      };
    }
  }

  async getNotificacionesPorDia(dias = 7) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - dias);
      
      const resultado = await this.notificacionRepository
        .createQueryBuilder('notificacion')
        .select('DATE(notificacion.fecha_hora)', 'fecha')
        .addSelect('COUNT(*)', 'cantidad')
        .where('notificacion.fecha_hora >= :fechaInicio', { fechaInicio })
        .groupBy('DATE(notificacion.fecha_hora)')
        .orderBy('fecha', 'ASC')
        .getRawMany();

      return resultado.map(item => ({
        fecha: item.fecha,
        cantidad: parseInt(item.cantidad),
      }));
    } catch (error) {
      console.error('Error en getNotificacionesPorDia:', error.message);
      return [];
    }
  }

  async findOne(id_sensor: string) {
    try {
      return await this.sensorRepository.findOne({
        where: { id_sensor },
        relations: ['tipo_sensor', 'rol_sensor', 'contenedor'],
      });
    } catch (error) {
      console.error('Error en findOne sensor:', error.message);
      return null;
    }
  }

  async findOneDetalle(id_sensor: string) {
    try {
      const sensor = await this.sensorRepository.findOne({
        where: { id_sensor },
        relations: ['tipo_sensor', 'rol_sensor', 'contenedor', 'contenedor.estado_contenedor'],
      });

      if (!sensor) {
        return null;
      }

      // Obtener notificaciones recientes del sensor
      const notificaciones = await this.notificacionRepository.find({
        where: { id_sensor },
        relations: ['tipo_notificacion'],
        order: { fecha_hora: 'DESC' },
        take: 20,
      });

      // Generar datos de lecturas simuladas (en producción vendrían de una tabla de lecturas)
      const lecturas = this.generarLecturasSimuladas(sensor.tipo_sensor?.nombre || 'Temperatura', 50);

      return {
        ...sensor,
        notificaciones,
        lecturas,
        ultima_lectura: lecturas[0],
      };
    } catch (error) {
      console.error('Error en findOneDetalle sensor:', error.message);
      return null;
    }
  }

  async getAnaliticas(id_sensor: string) {
    try {
      const sensor = await this.sensorRepository.findOne({
        where: { id_sensor },
        relations: ['tipo_sensor', 'contenedor'],
      });

      if (!sensor) {
        return null;
      }

      // Generar datos analíticos (en producción calcularías esto de datos reales)
      const lecturas = this.generarLecturasSimuladas(sensor.tipo_sensor?.nombre || 'Temperatura', 100);
      
      const valores = lecturas.map(l => l.valor);
      const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
      const maximo = Math.max(...valores);
      const minimo = Math.min(...valores);
      const desviacion = Math.sqrt(
        valores.reduce((sq, n) => sq + Math.pow(n - promedio, 2), 0) / valores.length
      );

      return {
        sensor,
        estadisticas: {
          promedio: Number(promedio.toFixed(2)),
          maximo: Number(maximo.toFixed(2)),
          minimo: Number(minimo.toFixed(2)),
          desviacion_estandar: Number(desviacion.toFixed(2)),
          total_lecturas: lecturas.length,
        },
        lecturas_por_hora: this.agruparPorHora(lecturas),
        tendencia: this.calcularTendencia(lecturas),
        alertas_generadas: await this.notificacionRepository.count({
          where: { id_sensor },
        }),
      };
    } catch (error) {
      console.error('Error en getAnaliticas:', error.message);
      return null;
    }
  }

  // Métodos auxiliares para generar datos simulados
  private generarLecturasSimuladas(tipo: string, cantidad: number): Array<{
    fecha_hora: Date;
    valor: number;
    unidad: string;
    estado: string;
  }> {
    const ahora = new Date();
    const lecturas: Array<{
      fecha_hora: Date;
      valor: number;
      unidad: string;
      estado: string;
    }> = [];
    
    let baseValue = 25;
    let unidad = '°C';
    
    if (tipo.toLowerCase().includes('humedad')) {
      baseValue = 65;
      unidad = '%';
    } else if (tipo.toLowerCase().includes('presion')) {
      baseValue = 1013;
      unidad = 'hPa';
    }

    for (let i = cantidad - 1; i >= 0; i--) {
      const fecha = new Date(ahora.getTime() - i * 3600000); // 1 hora atrás por cada lectura
      const variacion = (Math.random() - 0.5) * 5;
      const valor = baseValue + variacion;
      
      lecturas.push({
        fecha_hora: fecha,
        valor: Number(valor.toFixed(2)),
        unidad,
        estado: this.determinarEstado(valor, tipo),
      });
    }

    return lecturas;
  }

  private determinarEstado(valor: number, tipo: string): string {
    if (tipo.toLowerCase().includes('temperatura')) {
      if (valor < 15 || valor > 30) return 'warning';
      if (valor < 10 || valor > 35) return 'alert';
      return 'normal';
    }
    return 'normal';
  }

  private agruparPorHora(lecturas: any[]) {
    const grupos: { [key: string]: number[] } = {};
    
    lecturas.forEach(lectura => {
      const hora = new Date(lectura.fecha_hora).getHours();
      const key = `${hora}:00`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(lectura.valor);
    });

    return Object.keys(grupos).map(hora => ({
      hora,
      promedio: Number((grupos[hora].reduce((a, b) => a + b, 0) / grupos[hora].length).toFixed(2)),
      cantidad: grupos[hora].length,
    }));
  }

  private calcularTendencia(lecturas: any[]) {
    if (lecturas.length < 2) return 'estable';
    
    const recientes = lecturas.slice(-10);
    const anteriores = lecturas.slice(-20, -10);
    
    const promedioReciente = recientes.reduce((a, b) => a + b.valor, 0) / recientes.length;
    const promedioAnterior = anteriores.reduce((a, b) => a + b.valor, 0) / anteriores.length;
    
    const diferencia = promedioReciente - promedioAnterior;
    
    if (Math.abs(diferencia) < 0.5) return 'estable';
    return diferencia > 0 ? 'ascendente' : 'descendente';
  }
}
