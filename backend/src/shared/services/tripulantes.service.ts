import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tripulante } from '../entities/tripulante.entity';

@Injectable()
export class TripulantesService {
  constructor(
    @InjectRepository(Tripulante)
    private readonly tripulanteRepository: Repository<Tripulante>,
  ) {}

  async findAll(): Promise<Tripulante[]> {
    return this.tripulanteRepository.find({
      relations: ['empleado'],
    });
  }
}
