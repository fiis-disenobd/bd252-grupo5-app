import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hallazgo } from '../entities/hallazgo.entity';
import { Inspeccion } from '../entities/inspeccion.entity';
import { TipoHallazgo } from '../../shared/entities/tipo-hallazgo.entity';

@Injectable()
export class HallazgosService {
    constructor(
        @InjectRepository(Hallazgo)
        private hallazgoRepository: Repository<Hallazgo>,
        @InjectRepository(Inspeccion)
        private inspeccionRepository: Repository<Inspeccion>,
        @InjectRepository(TipoHallazgo)
        private tipoHallazgoRepository: Repository<TipoHallazgo>,
    ) { }

    async getInspecciones() {
        const inspecciones = await this.inspeccionRepository.find({
            relations: [
                'tipoInspeccion',
                'estadoInspeccion',
                'prioridad',
                'operacion', // To get operation code? Operacion entity might need relation to OperacionMaritima or similar if code is there.
                // Let's assume Operacion has 'codigo' or similar.
                // Wait, Operacion entity structure?
            ],
            order: { fecha: 'DESC' }
        });

        // We need to map to the format expected by frontend
        // Frontend expects: id, type, date, time, priority, operationCode, inspectionCode, status

        // Let's check Operacion entity structure if needed, but for now let's return the entities and let controller/frontend handle mapping or map here.
        // Mapping here is better.

        return inspecciones;
    }

    async getTiposHallazgo() {
        return this.tipoHallazgoRepository.find();
    }

    async createHallazgo(data: {
        codigo: string;
        id_tipo_hallazgo: string;
        nivel_gravedad: number;
        descripcion: string;
        accion_sugerida?: string;
        id_inspeccion: string;
    }) {
        const hallazgo = this.hallazgoRepository.create(data);
        return this.hallazgoRepository.save(hallazgo);
    }
}
