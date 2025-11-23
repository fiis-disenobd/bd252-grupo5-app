import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ReportesService } from '../services/reportes.service';
import type { CreateReporteDto, UpdateReporteDto } from '../services/reportes.service';

@Controller('monitoreo/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  // GET /monitoreo/reportes - Listar reportes con paginación y filtros
  @Get()
  findAll(@Query() query: any) {
    return this.reportesService.findAll(query);
  }

  // GET /monitoreo/reportes/estadisticas - Obtener estadísticas
  @Get('estadisticas')
  getEstadisticas() {
    return this.reportesService.getEstadisticas();
  }

  // GET /monitoreo/reportes/analytics/resumen - Resumen analítico del proceso batch
  @Get('analytics/resumen')
  getAnalyticsResumen() {
    return this.reportesService.getAnalyticsResumen();
  }

  // POST /monitoreo/reportes/cierre-diario - Ejecutar proceso batch analítico
  @Post('cierre-diario')
  ejecutarCierreDiario(@Body('fecha_corte') fecha_corte?: string) {
    return this.reportesService.ejecutarCierreDiario(fecha_corte);
  }

  // POST /monitoreo/reportes/cierre-rango-120 - Ejecutar proceso batch analítico para los últimos 120 días
  @Post('cierre-rango-120')
  ejecutarCierreRango120(@Body('fecha_fin') fecha_fin?: string) {
    return this.reportesService.ejecutarCierreRango120Dias(fecha_fin);
  }

  // GET /monitoreo/reportes/:id - Obtener un reporte por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportesService.findOne(id);
  }

  // POST /monitoreo/reportes - Crear nuevo reporte
  @Post()
  create(@Body() data: CreateReporteDto) {
    return this.reportesService.create(data);
  }

  // POST /monitoreo/reportes/operacion/:id - Crear reporte a partir de una operación e incidencias
  @Post('operacion/:id')
  crearReporteOperacion(
    @Param('id') idOperacion: string,
    @Body()
    body: { incidenciasIds?: string[]; comentario?: string },
  ) {
    return this.reportesService.crearReporteOperacion(
      idOperacion,
      body.incidenciasIds || [],
      body.comentario,
    );
  }

  // POST /monitoreo/reportes/contenedor/:id - Crear reporte a partir de notificaciones de sensores de un contenedor
  @Post('contenedor/:id')
  crearReporteContenedor(
    @Param('id') idContenedor: string,
    @Body()
    body: { notificacionesIds?: string[]; comentario?: string },
  ) {
    return this.reportesService.crearReporteContenedor(
      idContenedor,
      body.notificacionesIds || [],
      body.comentario,
    );
  }

  // PUT /monitoreo/reportes/:id - Actualizar reporte
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateReporteDto) {
    return this.reportesService.update(id, data);
  }

  // DELETE /monitoreo/reportes/:id - Eliminar reporte
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportesService.remove(id);
  }
}
