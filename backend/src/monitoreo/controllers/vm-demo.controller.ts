import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { VictoriaMetricsService } from '../services/victoriametrics.service';
import { SensoresService } from '../services/sensores.service';

@Controller('monitoreo/vm')
export class VmDemoController {
  constructor(
    private readonly vmService: VictoriaMetricsService,
    private readonly sensoresService: SensoresService,
  ) {}

  @Get('temperatura/:contenedorId')
  async getTemperatura(@Param('contenedorId') contenedorId: string) {
    const points = await this.vmService.getTemperaturaContenedor(contenedorId);
    return {
      contenedorId,
      points,
    };
  }

  @Post('sync-lecturas/sensor/:sensorId')
  async syncLecturasSensor(
    @Param('sensorId') sensorId: string,
    @Query('limite') limite?: string,
  ) {
    const max = limite ? parseInt(limite, 10) || 100 : 100;
    return this.sensoresService.syncLecturasToVictoriaMetrics(sensorId, max);
  }
}
