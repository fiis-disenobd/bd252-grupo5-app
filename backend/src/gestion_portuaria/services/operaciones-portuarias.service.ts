import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OperacionPortuaria } from '../../gestion_maritima/entities/operacion-portuaria.entity';
import { OperacionPortuariaDto, ResumenOperacionesPortuariasDto } from '../dto/operacion-portuaria.dto';

@Injectable()
export class OperacionesPortuariasService {
  constructor(
    @InjectRepository(OperacionPortuaria)
    private readonly operacionPortuariaRepo: Repository<OperacionPortuaria>,
  ) {}

  async findDashboardList(): Promise<OperacionPortuariaDto[]> {
    const operaciones = await this.operacionPortuariaRepo.find({
      relations: [
        'operacion',
        'operacion.estado_operacion',
        'puerto',
        'muelle',
        'tipo_operacion_portuaria',
        'buque',
      ],
    });

    return operaciones.map((op) => ({
      id_operacion_portuaria: op.id_operacion_portuaria,
      puerto: op.puerto?.nombre ?? '',
      muelle: op.muelle?.codigo ?? '',
      tipo_operacion_portuaria: op.tipo_operacion_portuaria?.nombre ?? '',
      matricula_buque: op.buque?.matricula ?? '',
      estado: op.operacion?.estado_operacion?.nombre ?? '',
    }));
  }

  async getResumenEstados(): Promise<ResumenOperacionesPortuariasDto> {
    const operaciones = await this.operacionPortuariaRepo.find({
      relations: ['operacion', 'operacion.estado_operacion'],
    });

    let pendientes = 0;
    let en_curso = 0;
    let completadas = 0;

    for (const op of operaciones) {
      const estado = op.operacion?.estado_operacion?.nombre ?? '';
      if (estado.toLowerCase() === 'pendiente') {
        pendientes++;
      } else if (estado.toLowerCase() === 'en curso') {
        en_curso++;
      } else if (estado.toLowerCase() === 'completada' || estado.toLowerCase() === 'completado') {
        completadas++;
      }
    }

    return { pendientes, en_curso, completadas };
  }
}
