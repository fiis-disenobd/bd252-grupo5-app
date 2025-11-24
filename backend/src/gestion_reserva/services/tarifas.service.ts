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

  async findAllTarifas() {
    try {
      const rutas = await this.rutaMaritimaRepository.find({
        relations: [
          'ruta',
          'puerto_origen',
          'puerto_destino',
          'puertos_intermedios',
          'puertos_intermedios.puerto',
        ],
        order: { codigo: 'ASC' },
      });

      return rutas.map((ruta) => ({
        id: ruta.id_ruta_maritima,
        id_ruta: ruta.ruta?.id_ruta ?? null,
        codigo: ruta.codigo,
        distancia: ruta.distancia,
        duracion: ruta.ruta?.duracion ?? null,
        tarifa: ruta.ruta?.tarifa ?? null,
        puerto_origen: ruta.puerto_origen?.nombre ?? null,
        puerto_destino: ruta.puerto_destino?.nombre ?? null,
        puertosIntermedios:
          ruta.puertos_intermedios?.map((ri) => ri.puerto?.nombre).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Error al obtener tarifas:', error);
      return [];
    }
  }
}
