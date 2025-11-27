import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { EstadoEmbarcacion } from '../../shared/entities/estado-embarcacion.entity';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(EstadoOperacion)
    private readonly estadoOperacionRepository: Repository<EstadoOperacion>,
    @InjectRepository(EstadoEmbarcacion)
    private readonly estadoEmbarcacionRepository: Repository<EstadoEmbarcacion>,
  ) { }

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

  async findEstadosEmbarcacion() {
    try {
      return await this.estadoEmbarcacionRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener estados de embarcación:', error);
      return [];
    }
  }
}
