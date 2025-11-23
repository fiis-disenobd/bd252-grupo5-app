import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) {}

  async findVehiculos() {
    try {
      return await this.vehiculoRepository
        .createQueryBuilder('v')
        .leftJoinAndSelect('v.estado_vehiculo', 'ev')
        .where('LOWER(ev.nombre) = :estado', { estado: 'disponible' })
        .orderBy('v.placa', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return [];
    }
  }
}
