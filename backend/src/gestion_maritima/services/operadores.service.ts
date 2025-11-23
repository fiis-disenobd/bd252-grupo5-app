import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operador } from '../../monitoreo/entities/operador.entity';

@Injectable()
export class OperadoresService {
  constructor(
    @InjectRepository(Operador)
    private readonly operadorRepository: Repository<Operador>,
  ) {}

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
}
