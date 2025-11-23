import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Muelle } from '../entities/muelle.entity';

@Injectable()
export class MuellesService {
  constructor(
    @InjectRepository(Muelle)
    private readonly muelleRepository: Repository<Muelle>,
  ) {}

  async findMuellesByPuerto(id_puerto: string) {
    try {
      return await this.muelleRepository.find({
        where: { id_puerto },
        order: { codigo: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener muelles por puerto:', error);
      return [];
    }
  }
}
