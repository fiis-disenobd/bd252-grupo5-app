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

  async findAll(): Promise<any[]> {
    const query = `
      SELECT id_estado_reserva, nombre
      FROM shared.estadoreserva
      ORDER BY nombre ASC
    `;
    return await this.estadoReservaRepository.query(query);
  }

  async findByNombre(nombre: string): Promise<any | null> {
    const query = `
      SELECT id_estado_reserva, nombre
      FROM shared.estadoreserva
      WHERE nombre = $1
    `;
    const result = await this.estadoReservaRepository.query(query, [nombre]);
    return result.length > 0 ? result[0] : null;
  }
}
