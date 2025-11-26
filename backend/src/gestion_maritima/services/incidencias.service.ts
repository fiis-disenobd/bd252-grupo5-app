import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incidencia } from '../../monitoreo/entities/incidencia.entity';
import { TipoIncidencia } from '../../monitoreo/entities/tipo-incidencia.entity';
import { EstadoIncidencia } from '../../monitoreo/entities/estado-incidencia.entity';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';
import { CreateIncidenciaDto } from '../dto/create-incidencia.dto';

@Injectable()
export class IncidenciasService {
    constructor(
        @InjectRepository(Incidencia)
        private incidenciaRepository: Repository<Incidencia>,
        @InjectRepository(TipoIncidencia)
        private tipoIncidenciaRepository: Repository<TipoIncidencia>,
        @InjectRepository(EstadoIncidencia)
        private estadoIncidenciaRepository: Repository<EstadoIncidencia>,
        @InjectRepository(OperacionMaritima)
        private operacionMaritimaRepository: Repository<OperacionMaritima>,
    ) { }

    async create(data: CreateIncidenciaDto, id_usuario: string) {
        // 1. Buscar OperacionMaritima por código
        const operacionMaritima = await this.operacionMaritimaRepository.findOne({
            where: { codigo: data.codigo_operacion },
        });

        if (!operacionMaritima) {
            throw new NotFoundException(`Operación Marítima con código ${data.codigo_operacion} no encontrada`);
        }

        // 2. Validar Tipo de Incidencia
        const tipoIncidencia = await this.tipoIncidenciaRepository.findOne({
            where: { id_tipo_incidencia: data.id_tipo_incidencia },
        });

        if (!tipoIncidencia) {
            throw new BadRequestException('Tipo de incidencia no válido');
        }

        // 3. Obtener Estado Inicial (Asumimos "Abierta" o el primero disponible)
        let estadoInicial = await this.estadoIncidenciaRepository.findOne({
            where: { nombre: 'Abierta' },
        });

        if (!estadoInicial) {
            // Fallback: tomar el primero
            estadoInicial = await this.estadoIncidenciaRepository.findOne({ where: {} });
        }

        if (!estadoInicial) {
            throw new BadRequestException('No hay estados de incidencia configurados');
        }

        // 4. Generar Código Único
        const codigo = await this.generarCodigoUnico();

        // 5. Crear Incidencia
        const incidencia = this.incidenciaRepository.create({
            codigo,
            descripcion: data.descripcion,
            grado_severidad: data.grado_severidad,
            id_tipo_incidencia: data.id_tipo_incidencia,
            id_estado_incidencia: estadoInicial.id_estado_incidencia,
            id_operacion: operacionMaritima.id_operacion,
            id_usuario: id_usuario,
            fecha_hora: new Date(),
        });

        return await this.incidenciaRepository.save(incidencia);
    }

    private async generarCodigoUnico(): Promise<string> {
        const fecha = new Date();
        const año = fecha.getFullYear().toString().slice(-2);
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');

        const count = await this.incidenciaRepository
            .createQueryBuilder('incidencia')
            .where('EXTRACT(YEAR FROM incidencia.fecha_hora) = :year', { year: fecha.getFullYear() })
            .andWhere('EXTRACT(MONTH FROM incidencia.fecha_hora) = :month', { month: fecha.getMonth() + 1 })
            .getCount();

        const secuencia = (count + 1).toString().padStart(4, '0');

        return `INC-${año}${mes}-${secuencia}`;
    }
}
