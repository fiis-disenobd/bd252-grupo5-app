import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PosicionContenedor } from '../entities/posicion-contenedor.entity';
import { PosicionVehiculo } from '../entities/posicion-vehiculo.entity';
import { PosicionBuque } from '../entities/posicion-buque.entity';

@Injectable()
export class GpsService {
  constructor(
    @InjectRepository(PosicionContenedor)
    private posicionContenedorRepository: Repository<PosicionContenedor>,
    @InjectRepository(PosicionVehiculo)
    private posicionVehiculoRepository: Repository<PosicionVehiculo>,
    @InjectRepository(PosicionBuque)
    private posicionBuqueRepository: Repository<PosicionBuque>,
  ) {}

  async getPosicionesContenedores() {
    try {
      // SQL explícito: últimas posiciones de contenedores
      const rows = await this.posicionContenedorRepository.query(
        `
        SELECT 
          id_posicion,
          id_contenedor,
          latitud,
          longitud,
          fecha_hora
        FROM monitoreo.posicioncontenedor
        ORDER BY fecha_hora DESC
        LIMIT 100
        `,
      );

      return rows;
    } catch (error) {
      console.error('Error en getPosicionesContenedores:', error.message);
      return []; // Devolver array vacío si hay error
    }
  }

  async getUltimaPosicionContenedor(id_contenedor: string) {
    try {
      // SQL explícito: última posición de un contenedor
      const rows = await this.posicionContenedorRepository.query(
        `
        SELECT 
          id_posicion,
          id_contenedor,
          latitud,
          longitud,
          fecha_hora
        FROM monitoreo.posicioncontenedor
        WHERE id_contenedor = $1
        ORDER BY fecha_hora DESC
        LIMIT 1
        `,
        [id_contenedor],
      );

      return rows[0] ?? null;
    } catch (error) {
      console.error('Error en getUltimaPosicionContenedor:', error.message);
      return null;
    }
  }

  async getHistorialPosicionesContenedor(id_contenedor: string, limit = 50) {
    try {
      // SQL explícito: historial de posiciones de un contenedor
      const rows = await this.posicionContenedorRepository.query(
        `
        SELECT 
          id_posicion,
          id_contenedor,
          latitud,
          longitud,
          fecha_hora
        FROM monitoreo.posicioncontenedor
        WHERE id_contenedor = $1
        ORDER BY fecha_hora DESC
        LIMIT $2
        `,
        [id_contenedor, limit],
      );

      return rows;
    } catch (error) {
      console.error('Error en getHistorialPosicionesContenedor:', error.message);
      return [];
    }
  }

  async getAllPosiciones() {
    try {
      // Obtener últimas posiciones de contenedores con SQL explícito
      const contRows = await this.posicionContenedorRepository.query(
        `
        SELECT DISTINCT ON (pc.id_contenedor)
          pc.id_posicion,
          pc.id_contenedor,
          pc.latitud,
          pc.longitud,
          pc.fecha_hora,
          c.codigo AS contenedor_codigo,
          ec.nombre AS estado_contenedor_nombre
        FROM monitoreo.posicioncontenedor pc
        JOIN shared.contenedor c ON c.id_contenedor = pc.id_contenedor
        LEFT JOIN shared.estadocontenedor ec ON ec.id_estado_contenedor = c.id_estado_contenedor
        ORDER BY pc.id_contenedor, pc.fecha_hora DESC
        `,
      );

      // Obtener últimas posiciones de vehículos con su estado
      const vehiculos = await this.posicionVehiculoRepository
        .createQueryBuilder('pv')
        .leftJoinAndSelect('pv.vehiculo', 'v')
        .leftJoinAndSelect('v.estado_vehiculo', 'ev')
        .distinctOn(['pv.id_vehiculo'])
        .orderBy('pv.id_vehiculo')
        .addOrderBy('pv.fecha_hora', 'DESC')
        .getMany();

      // Obtener últimas posiciones de buques con su estado
      const buques = await this.posicionBuqueRepository
        .createQueryBuilder('pb')
        .leftJoinAndSelect('pb.buque', 'b')
        .leftJoinAndSelect('b.estado_embarcacion', 'eb')
        .distinctOn(['pb.id_buque'])
        .orderBy('pb.id_buque')
        .addOrderBy('pb.fecha_hora', 'DESC')
        .getMany();

      // Formatear datos para el mapa
      const assetsContenedores = contRows.map((pc: any) => ({
        id: pc.id_posicion,
        code: pc.contenedor_codigo || `CNT-${pc.id_contenedor.substring(0, 8)}`,
        type: 'container',
        position: [Number(pc.latitud), Number(pc.longitud)],
        status: pc.estado_contenedor_nombre || 'Desconocido',
        statusColor: this.getStatusColor(pc.estado_contenedor_nombre),
        icon: 'inventory_2',
        lastUpdate: pc.fecha_hora,
        speed: 'N/A',
        temp: 'N/A',
      }));

      const assets = [
        ...assetsContenedores,
        ...vehiculos.map(pv => ({
          id: pv.id_posicion,
          code: pv.vehiculo?.placa || `VEH-${pv.id_vehiculo.substring(0, 8)}`,
          type: 'vehicle',
          position: [Number(pv.latitud), Number(pv.longitud)],
          status: pv.vehiculo?.estado_vehiculo?.nombre || 'Desconocido',
          statusColor: this.getVehiculoStatusColor(pv.vehiculo?.estado_vehiculo?.nombre),
          icon: 'local_shipping',
          lastUpdate: pv.fecha_hora,
          speed: 'N/A',
          temp: 'N/A',
        })),
        ...buques.map(pb => ({
          id: pb.id_posicion,
          code: pb.buque?.nombre || `BQE-${pb.id_buque.substring(0, 8)}`,
          type: 'ship',
          position: [Number(pb.latitud), Number(pb.longitud)],
          status: pb.buque?.estado_embarcacion?.nombre || 'Desconocido',
          statusColor: this.getBuqueStatusColor(pb.buque?.estado_embarcacion?.nombre),
          icon: 'sailing',
          lastUpdate: pb.fecha_hora,
          speed: 'N/A',
          temp: 'N/A',
        })),
      ];

      return assets;
    } catch (error) {
      console.error('Error en getAllPosiciones:', error.message);
      return [];
    }
  }

  private getStatusColor(status: string | undefined): string {
    // Contenedores - EstadoContenedor
    if (!status) return '#6b7280';
    const key = status.toLowerCase();

    const colors: Record<string, string> = {
      'disponible':        '#10b981', // verde
      'en transito':       '#3b82f6', // azul
      'en puerto':         '#6366f1', // indigo
      'en reparacion':     '#f59e0b', // ámbar
      'fuera de servicio': '#ef4444', // rojo
    };

    return colors[key] || '#6b7280';
  }

  private getVehiculoStatusColor(status: string | undefined): string {
    // Vehiculos - EstadoVehiculo
    if (!status) return '#6b7280';
    const key = status.toLowerCase();

    const colors: Record<string, string> = {
      'disponible':        '#10b981', // verde
      'en ruta':           '#3b82f6', // azul
      'en mantenimiento':  '#f59e0b', // ámbar
      'fuera de servicio': '#ef4444', // rojo
      'en revision':       '#8b5cf6', // violeta
    };

    return colors[key] || '#6b7280';
  }

  private getBuqueStatusColor(status: string | undefined): string {
    // Embarcaciones - EstadoEmbarcacion
    if (!status) return '#6b7280';
    const key = status.toLowerCase();

    const colors: Record<string, string> = {
      'operativo':         '#10b981', // verde
      'en mantenimiento':  '#f59e0b', // ámbar
      'fuera de servicio': '#ef4444', // rojo
      'en reparacion':     '#f97316', // naranja
      'disponible':        '#3b82f6', // azul
    };

    return colors[key] || '#6b7280';
  }
}
