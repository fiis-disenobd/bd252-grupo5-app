import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';

@Injectable()
export class BuquesService {
  constructor(
    @InjectRepository(Buque)
    private readonly buqueRepository: Repository<Buque>,
  ) {}

  async findBuques() {
    try {
      return await this.buqueRepository.find({
        relations: ['estado_embarcacion'],
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener buques:', error);
      return [];
    }
  }

  async findBuqueById(id: string) {
    try {
      return await this.buqueRepository.findOne({ where: { id_buque: id } });
    } catch (error) {
      console.error('Error al obtener buque por id:', error);
      return null;
    }
  }
}
