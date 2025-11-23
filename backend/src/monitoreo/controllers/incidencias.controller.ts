import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { IncidenciasService } from '../services/incidencias.service';
import type { CreateIncidenciaDto, UpdateIncidenciaDto } from '../services/incidencias.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() data: CreateIncidenciaDto) {
    const id_usuario = req.user?.id_usuario;
    return this.incidenciasService.create({ ...data, id_usuario });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() data: UpdateIncidenciaDto) {
    return this.incidenciasService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.incidenciasService.remove(id);
  }
}
