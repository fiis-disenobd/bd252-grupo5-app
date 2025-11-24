import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenteReservas } from '../entities/agente-reservas.entity';

@Injectable()
export class AgentesService {
  constructor(
    @InjectRepository(AgenteReservas)
    private readonly agenteRepository: Repository<AgenteReservas>,
  ) {}

  async findAll(): Promise<AgenteReservas[]> {
    return await this.agenteRepository.find({
      relations: ['empleado', 'reservas'],
      order: { id_agente_reservas: 'ASC' },
    });
  }

  async findOne(id: string): Promise<AgenteReservas> {
    const agente = await this.agenteRepository.findOne({
      where: { id_agente_reservas: id },
      relations: ['empleado', 'reservas', 'atenciones_clientes'],
    });

    if (!agente) {
      throw new NotFoundException(`Agente con ID ${id} no encontrado`);
    }

    return agente;
  }

  async findByEmpleado(idEmpleado: string): Promise<AgenteReservas> {
    const agente = await this.agenteRepository.findOne({
      where: { id_empleado: idEmpleado },
      relations: ['empleado', 'reservas'],
    });

    if (!agente) {
      throw new NotFoundException(`Agente con empleado ID ${idEmpleado} no encontrado`);
    }

    return agente;
  }
}
