import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Importador } from '../entities/importador.entity';
import { ImportadorDireccion } from '../entities/importador-direccion.entity';

@Injectable()
export class ImportadoresService {
  constructor(
    @InjectRepository(Importador)
    private readonly importadorRepository: Repository<Importador>,
    @InjectRepository(ImportadorDireccion)
    private readonly direccionRepository: Repository<ImportadorDireccion>,
  ) {}

  async findOneDetalle(id: string) {
    try {
      const importador = await this.importadorRepository.findOne({
        where: { id_importador: id },
      });

      if (!importador) {
        throw new NotFoundException(`Importador con ID ${id} no encontrado`);
      }

      const direcciones = await this.direccionRepository.find({
        where: { id_importador: id },
        order: { principal: 'DESC', tipo: 'ASC' },
      });

      return {
        ...importador,
        direcciones,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error en findOneDetalle importador:', error.message);
      throw new Error('Error al obtener el detalle del importador');
    }
  }

  async createDireccion(id_importador: string, data: { direccion: string; tipo?: string | null; principal?: boolean }) {
    const importador = await this.importadorRepository.findOne({ where: { id_importador } });

    if (!importador) {
      throw new NotFoundException(`Importador con ID ${id_importador} no encontrado`);
    }

    const direccionTrim = (data.direccion || '').trim();
    if (!direccionTrim) {
      throw new BadRequestException('La dirección es obligatoria');
    }

    const esPrincipal = !!data.principal;

    if (esPrincipal) {
      // Si se marca como principal, desmarcar otras direcciones principales del mismo importador
      await this.direccionRepository.update({ id_importador, principal: true }, { principal: false });
    }

    const nueva = this.direccionRepository.create({
      id_importador,
      direccion: direccionTrim,
      tipo: data.tipo ?? null,
      principal: esPrincipal,
    });

    const guardada = await this.direccionRepository.save(nueva);

    return guardada;
  }
}
