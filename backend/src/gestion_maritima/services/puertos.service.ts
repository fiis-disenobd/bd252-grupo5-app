import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puerto } from '../entities/puerto.entity';

@Injectable()
export class PuertosService {
  constructor(
    @InjectRepository(Puerto)
    private readonly puertoRepository: Repository<Puerto>,
  ) {}

  async findPuertos() {
    try {
      return await this.puertoRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener puertos:', error);
      return [];
    }
  }
}
