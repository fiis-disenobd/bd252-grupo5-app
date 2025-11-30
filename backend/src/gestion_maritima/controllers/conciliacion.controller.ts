import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ConciliacionService } from '../services/conciliacion.service';

@Controller('gestion-maritima')
export class ConciliacionController {
    constructor(private readonly conciliacionService: ConciliacionService) { }

    @Post('conciliacion-nocturna')
    async ejecutarConciliacionNocturna(
        @Body() body: { fecha_corte?: string },
    ) {
        return this.conciliacionService.ejecutarConciliacionNocturna(body.fecha_corte);
    }

    @Get('correcciones')
    async getCorrecciones(
        @Query('fecha_desde') fechaDesde?: string,
        @Query('fecha_hasta') fechaHasta?: string,
    ) {
        return this.conciliacionService.getCorrecciones(fechaDesde, fechaHasta);
    }

    @Get('dashboard/metricas')
    async getDashboardMetricas() {
        return this.conciliacionService.getDashboardMetricas();
    }

    @Get('operaciones')
    async getTodasOperaciones() {
        return this.conciliacionService.getTodasOperaciones();
    }
}
