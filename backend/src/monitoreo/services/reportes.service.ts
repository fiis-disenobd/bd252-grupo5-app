import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reporte } from '../entities/reporte.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private reporteRepository: Repository<Reporte>,
  ) {}

  async findAll() {
    return await this.reporteRepository.find({
      order: { fecha_reporte: 'DESC' },
      take: 50,
    });
  }
}
