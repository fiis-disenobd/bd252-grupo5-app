import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entrega } from '../entities/entrega.entity';

@Injectable()
export class EntregasService {
  constructor(
    @InjectRepository(Entrega)
    private entregaRepository: Repository<Entrega>,
  ) {}

  async findAll() {
    return await this.entregaRepository.find({
      relations: ['contenedor', 'importador'],
      order: { fecha_entrega: 'DESC' },
      take: 50,
    });
  }

  async create(data: any) {
    const entrega = this.entregaRepository.create(data);
    return await this.entregaRepository.save(entrega);
  }
}
