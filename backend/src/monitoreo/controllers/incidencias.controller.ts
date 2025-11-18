import { Controller, Get, Post, Body } from '@nestjs/common';
import { IncidenciasService } from '../services/incidencias.service';

@Controller('monitoreo/incidencias')
export class IncidenciasController {
  constructor(private readonly incidenciasService: IncidenciasService) {}

  @Get()
  findAll() {
    return this.incidenciasService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.incidenciasService.create(data);
  }
}
