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

  async findAllRutasMaritimas() {
    try {
      const rutas = await this.rutaMaritimaRepository.find({
        relations: ['puerto_origen', 'puerto_destino', 'ruta'],
        order: { codigo: 'ASC' },
      });

      return rutas.map((ruta) => ({
        id_ruta_maritima: ruta.id_ruta_maritima,
        id_ruta: ruta.id_ruta,
        codigo: ruta.codigo,
        distancia: ruta.distancia,
        duracion: ruta.ruta?.duracion ?? null,
        tarifa: ruta.ruta?.tarifa ?? null,
        puerto_origen: ruta.puerto_origen?.nombre ?? 'Origen',
        puerto_destino: ruta.puerto_destino?.nombre ?? 'Destino',
        id_puerto_origen: ruta.id_puerto_origen,
        id_puerto_destino: ruta.id_puerto_destino,
      }));
    } catch (error) {
      console.error('Error al obtener rutas marítimas:', error);
      return [];
    }
  }
}
