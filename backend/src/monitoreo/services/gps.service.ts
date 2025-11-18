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
      return await this.posicionContenedorRepository.find({
        order: { fecha_hora: 'DESC' },
        take: 100,
      });
    } catch (error) {
      console.error('Error en getPosicionesContenedores:', error.message);
      return []; // Devolver array vacío si hay error
    }
  }

  async getUltimaPosicionContenedor(id_contenedor: string) {
    try {
      return await this.posicionContenedorRepository.findOne({
        where: { id_contenedor },
        order: { fecha_hora: 'DESC' },
      });
    } catch (error) {
      console.error('Error en getUltimaPosicionContenedor:', error.message);
      return null;
    }
  }

  async getHistorialPosicionesContenedor(id_contenedor: string, limit = 50) {
    try {
      return await this.posicionContenedorRepository.find({
        where: { id_contenedor },
        order: { fecha_hora: 'DESC' },
        take: limit,
      });
    } catch (error) {
      console.error('Error en getHistorialPosicionesContenedor:', error.message);
      return [];
    }
  }

  async getAllPosiciones() {
    try {
      // Obtener últimas posiciones de contenedores con sus relaciones
      const contenedores = await this.posicionContenedorRepository
        .createQueryBuilder('pc')
        .leftJoinAndSelect('pc.contenedor', 'c')
        .leftJoinAndSelect('c.estado_contenedor', 'ec')
        .distinctOn(['pc.id_contenedor'])
        .orderBy('pc.id_contenedor')
        .addOrderBy('pc.fecha_hora', 'DESC')
        .getMany();

      // Obtener últimas posiciones de vehículos
      const vehiculos = await this.posicionVehiculoRepository
        .createQueryBuilder('pv')
        .leftJoinAndSelect('pv.vehiculo', 'v')
        .distinctOn(['pv.id_vehiculo'])
        .orderBy('pv.id_vehiculo')
        .addOrderBy('pv.fecha_hora', 'DESC')
        .getMany();

      // Obtener últimas posiciones de buques
      const buques = await this.posicionBuqueRepository
        .createQueryBuilder('pb')
        .leftJoinAndSelect('pb.buque', 'b')
        .distinctOn(['pb.id_buque'])
        .orderBy('pb.id_buque')
        .addOrderBy('pb.fecha_hora', 'DESC')
        .getMany();

      // Formatear datos para el mapa
      const assets = [
        ...contenedores.map(pc => ({
          id: pc.id_posicion,
          code: pc.contenedor?.codigo || `CNT-${pc.id_contenedor.substring(0, 8)}`,
          type: 'container',
          position: [Number(pc.latitud), Number(pc.longitud)],
          status: pc.contenedor?.estado_contenedor?.nombre || 'Desconocido',
          statusColor: this.getStatusColor(pc.contenedor?.estado_contenedor?.nombre),
          icon: 'inventory_2',
          lastUpdate: pc.fecha_hora,
          speed: 'N/A',
          temp: 'N/A',
        })),
        ...vehiculos.map(pv => ({
          id: pv.id_posicion,
          code: pv.vehiculo?.placa || `VEH-${pv.id_vehiculo.substring(0, 8)}`,
          type: 'vehicle',
          position: [Number(pv.latitud), Number(pv.longitud)],
          status: 'En Tránsito',
          statusColor: '#28A745',
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
          status: 'En Tránsito',
          statusColor: '#17A2B8',
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
    if (!status) return '#6C757D';
    
    const colors: Record<string, string> = {
      'En Tránsito': '#28A745',
      'En Almacén': '#FFC107',
      'Entregado': '#17A2B8',
      'En Alerta': '#DC3545',
      'Disponible': '#28A745',
    };
    
    return colors[status] || '#6C757D';
  }
}
