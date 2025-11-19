import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { IncidenciasService } from '../services/incidencias.service';
import type { CreateIncidenciaDto, UpdateIncidenciaDto } from '../services/incidencias.service';

@Controller('monitoreo/incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Get()
  findAll(@Query() filtros: any) {
    return this.incidenciasService.findAll(filtros);
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.incidenciasService.getEstadisticas();
  }

  @Get('tipos')
  getTiposIncidencia() {
    return this.incidenciasService.getTiposIncidencia();
  }

  @Get('estados')
  getEstadosIncidencia() {
    return this.incidenciasService.getEstadosIncidencia();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidenciasService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateIncidenciaDto) {
    return this.incidenciasService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateIncidenciaDto) {
    return this.incidenciasService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidenciasService.remove(id);
  }
}
