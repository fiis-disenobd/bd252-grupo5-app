import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(EstadoOperacion)
    private readonly estadoOperacionRepository: Repository<EstadoOperacion>,
  ) {}

  async findEstados() {
    try {
      return await this.estadoOperacionRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener estados:', error);
      return [];
    }
  }
}
