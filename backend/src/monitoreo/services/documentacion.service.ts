import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documentacion } from '../entities/documentacion.entity';
import { TipoDocumento } from '../../shared/entities/tipo-documento.entity';

@Injectable()
export class DocumentacionService {
  constructor(
    @InjectRepository(Documentacion)
    private readonly documentacionRepository: Repository<Documentacion>,
    @InjectRepository(TipoDocumento)
    private readonly tipoDocumentoRepository: Repository<TipoDocumento>,
  ) {}

  async findOne(id: string) {
    try {
      const doc = await this.documentacionRepository.findOne({
        where: { id_documentacion: id },
        relations: ['tipo_documento'],
      });
      return doc || null;
    } catch (error) {
      console.error('Error en DocumentacionService.findOne:', error.message);
      return null;
    }
  }
}
