import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaMaritima } from '../../gestion_maritima/entities/ruta-maritima.entity';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(RutaMaritima)
    private readonly rutaMaritimaRepository: Repository<RutaMaritima>,
  ) {}

  async findAllTarifas(): Promise<any[]> {
    try {
      const query = `
        SELECT 
          rm.id_ruta_maritima,
          rm.codigo,
          rm.distancia,
          rm.id_ruta,
          r.duracion,
          r.tarifa,
          po.nombre AS puerto_origen,
          pd.nombre AS puerto_destino
        FROM gestion_maritima.rutamaritima rm
        LEFT JOIN shared.ruta r ON rm.id_ruta = r.id_ruta
        LEFT JOIN gestion_maritima.puerto po ON rm.id_puerto_origen = po.id_puerto
        LEFT JOIN gestion_maritima.puerto pd ON rm.id_puerto_destino = pd.id_puerto
        ORDER BY rm.codigo ASC
      `;

      const rutas = await this.rutaMaritimaRepository.query(query);

      // Obtener puertos intermedios para cada ruta
      for (const ruta of rutas) {
        const intermediosQuery = `
          SELECT p.nombre
          FROM gestion_maritima.rutapuertointermedio rpi
          JOIN gestion_maritima.puerto p ON rpi.id_puerto = p.id_puerto
          WHERE rpi.id_ruta_maritima = $1
          ORDER BY rpi.orden ASC
        `;
        const intermedios = await this.rutaMaritimaRepository.query(intermediosQuery, [ruta.id_ruta_maritima]);
        ruta.puertosIntermedios = intermedios.map((i: any) => i.nombre);
      }

      return rutas.map((ruta: any) => ({
        id: ruta.id_ruta_maritima,
        id_ruta: ruta.id_ruta,
        codigo: ruta.codigo,
        distancia: ruta.distancia,
        duracion: ruta.duracion,
        tarifa: ruta.tarifa,
        puerto_origen: ruta.puerto_origen,
        puerto_destino: ruta.puerto_destino,
        puertosIntermedios: ruta.puertosIntermedios || [],
      }));
    } catch (error) {
      console.error('Error al obtener tarifas:', error);
      return [];
    }
  }

  async findAllRutasMaritimas(): Promise<any[]> {
    try {
      const query = `
        SELECT 
          rm.id_ruta_maritima,
          rm.id_ruta,
          rm.codigo,
          rm.distancia,
          rm.id_puerto_origen,
          rm.id_puerto_destino,
          r.duracion,
          r.tarifa,
          po.nombre AS puerto_origen,
          pd.nombre AS puerto_destino
        FROM gestion_maritima.rutamaritima rm
        LEFT JOIN shared.ruta r ON rm.id_ruta = r.id_ruta
        LEFT JOIN gestion_maritima.puerto po ON rm.id_puerto_origen = po.id_puerto
        LEFT JOIN gestion_maritima.puerto pd ON rm.id_puerto_destino = pd.id_puerto
        ORDER BY rm.codigo ASC
      `;

      const result = await this.rutaMaritimaRepository.query(query);

      return result.map((row: any) => ({
        id_ruta_maritima: row.id_ruta_maritima,
        id_ruta: row.id_ruta,
        codigo: row.codigo,
        distancia: row.distancia,
        duracion: row.duracion,
        tarifa: row.tarifa,
        puerto_origen: row.puerto_origen || 'Origen',
        puerto_destino: row.puerto_destino || 'Destino',
        id_puerto_origen: row.id_puerto_origen,
        id_puerto_destino: row.id_puerto_destino,
      }));
    } catch (error) {
      console.error('Error al obtener rutas marítimas:', error);
      return [];
    }
  }
}
