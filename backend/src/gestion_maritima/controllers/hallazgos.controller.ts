import { Controller, Get, Post, Body } from '@nestjs/common';
import { HallazgosService } from '../services/hallazgos.service';

@Controller('gestion-maritima/hallazgos')
export class HallazgosController {
  constructor(private readonly hallazgosService: HallazgosService) { }

  @Get('inspecciones')
  async getInspecciones() {
    const inspecciones = await this.hallazgosService.getInspecciones();

    // Map to frontend format
    return inspecciones.map(insp => ({
      id: insp.id_inspeccion,
      type: insp.tipoInspeccion?.nombre || 'N/A',
      date: insp.fecha.toISOString().split('T')[0],
      time: insp.fecha.toISOString().split('T')[1].substring(0, 5),
      priority: insp.prioridad?.nombre || 'N/A',
      operationCode: insp.operacion?.codigo || 'N/A',
      inspectionCode: insp.codigo,
      status: insp.estadoInspeccion?.nombre || 'N/A',
    }));
  }

  @Get('tipos')
  async getTiposHallazgo() {
    return this.hallazgosService.getTiposHallazgo();
  }

  @Post()
  async createHallazgo(
    @Body() body: {
      id_tipo_hallazgo: string;
      nivel_gravedad: number;
      descripcion: string;
      accion_sugerida?: string;
      id_inspeccion: string;
    }
  ) {
    // Generate codigo
    const codigo = `HAL-${Date.now()}`;

    return this.hallazgosService.createHallazgo({
      codigo,
      ...body
    });
  }
}
