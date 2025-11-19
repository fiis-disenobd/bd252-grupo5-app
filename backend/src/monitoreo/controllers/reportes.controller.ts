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
