import { Controller, Get, Param, Query } from '@nestjs/common';
import { SensoresService } from '../services/sensores.service';

@Controller('monitoreo/sensores')
export class SensoresController {
  constructor(private readonly sensoresService: SensoresService) {}

  @Get('contenedor/:id')
  findByContenedor(@Param('id') id: string) {
    return this.sensoresService.findByContenedor(id);
  }

  @Get('notificaciones')
  findNotificaciones(@Query() filtros: any) {
    return this.sensoresService.findNotificaciones(filtros);
  }

  @Get('notificaciones/estadisticas')
  getEstadisticasNotificaciones() {
    return this.sensoresService.getEstadisticasNotificaciones();
  }

  @Get('notificaciones/por-dia')
  getNotificacionesPorDia(@Query('dias') dias?: string) {
    return this.sensoresService.getNotificacionesPorDia(dias ? parseInt(dias) : 7);
  }

  @Get('notificaciones/:id')
  async findNotificacionDetalle(@Param('id') id: string) {
    return this.sensoresService.findNotificacionDetalle(id);
  }

  @Get(':id/analiticas')
  getAnaliticas(@Param('id') id: string) {
    return this.sensoresService.getAnaliticas(id);
  }

  @Get(':id/detalle')
  findOneDetalle(@Param('id') id: string) {
    return this.sensoresService.findOneDetalle(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sensoresService.findOne(id);
  }
}
