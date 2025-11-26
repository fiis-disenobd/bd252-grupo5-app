import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoIncidencia } from '../../monitoreo/entities/tipo-incidencia.entity';

@Injectable()
export class TipoIncidenciaService {
    constructor(
        @InjectRepository(TipoIncidencia)
        private tipoIncidenciaRepository: Repository<TipoIncidencia>,
    ) { }

    async findAll(): Promise<TipoIncidencia[]> {
        return this.tipoIncidenciaRepository.find({
            order: {
                nombre: 'ASC',
            },
        });
    }
}
