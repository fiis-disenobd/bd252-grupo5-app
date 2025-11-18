import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { Operador } from '../entities/operador.entity';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';
import { Buque } from '../../shared/entities/buque.entity';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(EstadoOperacion)
    private estadoOperacionRepository: Repository<EstadoOperacion>,
    @InjectRepository(Operador)
    private operadorRepository: Repository<Operador>,
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Buque)
    private buqueRepository: Repository<Buque>,
  ) {}

  async findEstados() {
    try {
      return await this.estadoOperacionRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener estados:', error);
      return [];
    }
  }

  async findOperadores() {
    try {
      return await this.operadorRepository.find({
        relations: ['empleado'],
        order: { turno: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener operadores:', error);
      return [];
    }
  }

  async findVehiculos() {
    try {
      return await this.vehiculoRepository.find({
        order: { placa: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return [];
    }
  }

  async findBuques() {
    try {
      return await this.buqueRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener buques:', error);
      return [];
    }
  }
}
