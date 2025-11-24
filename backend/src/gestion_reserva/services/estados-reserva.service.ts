import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoReserva } from '../../shared/entities/estado-reserva.entity';

@Injectable()
export class EstadosReservaService {
  constructor(
    @InjectRepository(EstadoReserva)
    private readonly estadoReservaRepository: Repository<EstadoReserva>,
  ) {}

  async findAll(): Promise<EstadoReserva[]> {
    return await this.estadoReservaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findByNombre(nombre: string): Promise<EstadoReserva | null> {
    return await this.estadoReservaRepository.findOne({
      where: { nombre },
    });
  }
}
