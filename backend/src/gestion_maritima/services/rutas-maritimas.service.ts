import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RutaMaritima } from '../entities/ruta-maritima.entity';

@Injectable()
export class RutasMaritimasService {
  constructor(
    @InjectRepository(RutaMaritima)
    private readonly rutaMaritimaRepository: Repository<RutaMaritima>,
  ) {}

  async findRutasMaritimasBetweenPuertos(id_puerto_origen: string, id_puerto_destino: string) {
    try {
      const rutas = await this.rutaMaritimaRepository.find({
        where: {
          id_puerto_origen,
          id_puerto_destino,
        },
        relations: ['ruta', 'puertos_intermedios', 'puertos_intermedios.puerto'],
        order: { codigo: 'ASC' },
      });

      return rutas.map((ruta) => ({
        id: ruta.id_ruta_maritima,
        codigo: ruta.codigo,
        distancia: ruta.distancia,
        duracion: ruta.ruta?.duracion ?? null,
        tarifa: ruta.ruta?.tarifa ?? null,
        puertosIntermedios:
          ruta.puertos_intermedios?.map((ri) => ri.puerto?.nombre).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Error al obtener rutas marítimas entre puertos:', error);
      return [];
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
        puertos,
      };
    } catch (error) {
      console.error('Error al obtener ruta marítima por id:', error);
      return null;
    }
  }
}
