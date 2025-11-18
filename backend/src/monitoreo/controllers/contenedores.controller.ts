import { Controller, Get, Param, Query } from '@nestjs/common';
import { ContenedoresService } from '../services/contenedores.service';

@Controller('monitoreo/contenedores')
export class ContenedoresController {
  constructor(private readonly contenedoresService: ContenedoresService) {}

  @Get('estadisticas')
  getEstadisticas() {
    return this.contenedoresService.getEstadisticas();
  }

  @Get()
  findAll(@Query('estado') estado?: string, @Query('tipo') tipo?: string) {
    if (estado) {
      return this.contenedoresService.findByEstado(estado);
    }
    if (tipo) {
      return this.contenedoresService.findByTipo(tipo);
    }
    return this.contenedoresService.findAll();
  }

  @Get(':id/detalle')
  findOneDetalle(@Param('id') id: string) {
    return this.contenedoresService.findOneDetalle(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contenedoresService.findOne(id);
  }
}
