import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaMaritima } from '../entities/ruta-maritima.entity';

@Injectable()
export class RutasMaritimasService {
  constructor(
    @InjectRepository(RutaMaritima)
    private readonly rutaMaritimaRepository: Repository<RutaMaritima>,
  ) { }

  async findRutasMaritimasBetweenPuertos(
    id_puerto_origen: string,
    id_puerto_destino: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const offset = (page - 1) * limit;

      const query = `
        SELECT 
            rm.id_ruta_maritima,
            rm.codigo,
            rm.distancia,
            r.duracion,
            r.tarifa
        FROM gestion_maritima.RutaMaritima rm
        JOIN shared.Ruta r ON rm.id_ruta = r.id_ruta
        JOIN gestion_maritima.Puerto po ON rm.id_puerto_origen = po.id_puerto
        JOIN gestion_maritima.Puerto pd ON rm.id_puerto_destino = pd.id_puerto
        WHERE rm.id_puerto_origen = $1 
          AND rm.id_puerto_destino = $2
        ORDER BY rm.codigo
        LIMIT $3 OFFSET $4
      `;

      const countQuery = `
        SELECT COUNT(*) as total
        FROM gestion_maritima.RutaMaritima rm
        WHERE rm.id_puerto_origen = $1 
          AND rm.id_puerto_destino = $2
      `;

      const [rutas, countResult] = await Promise.all([
        this.rutaMaritimaRepository.query(query, [id_puerto_origen, id_puerto_destino, limit, offset]),
        this.rutaMaritimaRepository.query(countQuery, [id_puerto_origen, id_puerto_destino])
      ]);

      const total = parseInt(countResult[0].total, 10);

      const rutasConPuertos = await Promise.all(rutas.map(async (ruta: any) => {
        const puertosQuery = `
            SELECT 
                p.nombre
            FROM gestion_maritima.RutaPuertoIntermedio rpi
            JOIN gestion_maritima.Puerto p ON rpi.id_puerto = p.id_puerto
            WHERE rpi.id_ruta_maritima = $1 
            ORDER BY p.nombre
        `;
        const puertos = await this.rutaMaritimaRepository.query(puertosQuery, [ruta.id_ruta_maritima]);

        return {
          id: ruta.id_ruta_maritima,
          codigo: ruta.codigo,
          distancia: ruta.distancia,
          duracion: ruta.duracion,
          tarifa: ruta.tarifa,
          puertosIntermedios: puertos.map((p: any) => p.nombre)
        };
      }));

      return {
        data: rutasConPuertos,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error al obtener rutas marítimas entre puertos:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }

  async findRutaMaritimaById(id: string) {
    try {
      const ruta = await this.rutaMaritimaRepository.findOne({
        where: { id_ruta_maritima: id },
        relations: [
          'puerto_origen',
          'puerto_destino',
          'puertos_intermedios',
          'puertos_intermedios.puerto',
        ],
      });

      if (!ruta) {
        return null;
      }

      const puertos = [] as {
        tipo: 'origen' | 'intermedio' | 'destino';
        nombre: string;
        direccion: string;
      }[];

      if (ruta.puerto_origen) {
        puertos.push({
          tipo: 'origen',
          nombre: ruta.puerto_origen.nombre,
          direccion: ruta.puerto_origen.direccion,
        });
      }

      if (ruta.puertos_intermedios) {
        for (const intermedio of ruta.puertos_intermedios) {
          if (intermedio.puerto) {
            puertos.push({
              tipo: 'intermedio',
              nombre: intermedio.puerto.nombre,
              direccion: intermedio.puerto.direccion,
            });
          }
        }
      }

      if (ruta.puerto_destino) {
        puertos.push({
          tipo: 'destino',
          nombre: ruta.puerto_destino.nombre,
          direccion: ruta.puerto_destino.direccion,
        });
      }

      return {
        id: ruta.id_ruta_maritima,
        codigo: ruta.codigo,
        id_puerto_origen: ruta.id_puerto_origen,
        id_puerto_destino: ruta.id_puerto_destino,
        puertos,
      };
    } catch (error) {
      console.error('Error al obtener ruta marítima por id:', error);
      return null;
    }
  }
}
