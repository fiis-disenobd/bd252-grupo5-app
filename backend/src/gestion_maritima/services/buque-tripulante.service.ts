import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuqueTripulante } from '../entities/buque-tripulante.entity';
import { CreateBuqueTripulanteDto } from '../dto/create-buque-tripulante.dto';
import { UpdateBuqueTripulanteDto } from '../dto/update-buque-tripulante.dto';
import { Buque } from '../../shared/entities/buque.entity';
import { Tripulante } from '../../shared/entities/tripulante.entity';

@Injectable()
export class BuqueTripulanteService {
  constructor(
    @InjectRepository(BuqueTripulante)
    private buqueTripulanteRepository: Repository<BuqueTripulante>,
    @InjectRepository(Buque)
    private buqueRepository: Repository<Buque>,
    @InjectRepository(Tripulante)
    private tripulanteRepository: Repository<Tripulante>,
  ) {}

  async create(createBuqueTripulanteDto: CreateBuqueTripulanteDto) {
    // Validar que el buque existe
    const buque = await this.buqueRepository.findOne({
      where: { id_buque: createBuqueTripulanteDto.id_buque },
    });
    if (!buque) {
      throw new NotFoundException('Buque no encontrado');
    }

    // Validar que el tripulante existe
    const tripulante = await this.tripulanteRepository.findOne({
      where: { id_tripulante: createBuqueTripulanteDto.id_tripulante },
    });
    if (!tripulante) {
      throw new NotFoundException('Tripulante no encontrado');
    }

    // Validar que el tripulante esté disponible
    if (!tripulante.disponibilidad) {
      throw new BadRequestException('Tripulante no está disponible');
    }

    // Verificar si ya existe una asignación activa
    const asignacionExistente = await this.buqueTripulanteRepository.findOne({
      where: {
        id_buque: createBuqueTripulanteDto.id_buque,
        id_tripulante: createBuqueTripulanteDto.id_tripulante,
      },
    });

    if (asignacionExistente) {
      throw new BadRequestException('El tripulante ya está asignado a este buque');
    }

    // Crear la asignación
    const buqueTripulante = this.buqueTripulanteRepository.create({
      ...createBuqueTripulanteDto,
      fecha_asignacion: createBuqueTripulanteDto.fecha_asignacion 
        ? new Date(createBuqueTripulanteDto.fecha_asignacion)
        : new Date(),
      hora_asignacion: createBuqueTripulanteDto.hora_asignacion
        ? new Date(`1970-01-01T${createBuqueTripulanteDto.hora_asignacion}`)
        : new Date(),
    });

    return await this.buqueTripulanteRepository.save(buqueTripulante);
  }

  async findAll() {
    return await this.buqueTripulanteRepository.find({
      relations: ['buque', 'tripulante', 'tripulante.empleado'],
    });
  }

  async findOne(id: string) {
    const buqueTripulante = await this.buqueTripulanteRepository.findOne({
      where: { id_buque_tripulante: id },
      relations: ['buque', 'tripulante', 'tripulante.empleado'],
    });

    if (!buqueTripulante) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return buqueTripulante;
  }

  async findByBuque(id_buque: string) {
    return await this.buqueTripulanteRepository.find({
      where: { id_buque },
      relations: ['tripulante', 'tripulante.empleado'],
    });
  }

  async findByTripulante(id_tripulante: string) {
    return await this.buqueTripulanteRepository.find({
      where: { id_tripulante },
      relations: ['buque'],
    });
  }

  async update(id: string, updateBuqueTripulanteDto: UpdateBuqueTripulanteDto) {
    const buqueTripulante = await this.findOne(id);

    if (updateBuqueTripulanteDto.id_buque) {
      const buque = await this.buqueRepository.findOne({
        where: { id_buque: updateBuqueTripulanteDto.id_buque },
      });
      if (!buque) {
        throw new NotFoundException('Buque no encontrado');
      }
    }

    if (updateBuqueTripulanteDto.id_tripulante) {
      const tripulante = await this.tripulanteRepository.findOne({
        where: { id_tripulante: updateBuqueTripulanteDto.id_tripulante },
      });
      if (!tripulante) {
        throw new NotFoundException('Tripulante no encontrado');
      }
    }

    Object.assign(buqueTripulante, updateBuqueTripulanteDto);

    return await this.buqueTripulanteRepository.save(buqueTripulante);
  }

  async remove(id: string) {
    const buqueTripulante = await this.findOne(id);
    return await this.buqueTripulanteRepository.remove(buqueTripulante);
  }

  async removeByBuqueAndTripulante(id_buque: string, id_tripulante: string) {
    const asignacion = await this.buqueTripulanteRepository.findOne({
      where: { id_buque, id_tripulante },
    });

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return await this.buqueTripulanteRepository.remove(asignacion);
  }
}
