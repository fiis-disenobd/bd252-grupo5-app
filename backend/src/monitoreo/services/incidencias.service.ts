import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from '../entities/incidencia.entity';

@Injectable()
export class IncidenciasService {
  constructor(
    @InjectRepository(Incidencia)
    private incidenciaRepository: Repository<Incidencia>,
  ) {}

  async findAll() {
    return await this.incidenciaRepository.find({
      order: { fecha_hora: 'DESC' },
      take: 100,
    });
  }

  async create(data: any) {
    const incidencia = this.incidenciaRepository.create(data);
    return await this.incidenciaRepository.save(incidencia);
  }
}
