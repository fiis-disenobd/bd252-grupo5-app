import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { EntregasService } from '../services/entregas.service';
import type { CreateEntregaDto, UpdateEntregaDto } from '../services/entregas.service';

@Controller('monitoreo/entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  // GET /monitoreo/entregas - Listar entregas con paginación y filtros
  @Get()
  findAll(@Query() query: any) {
    return this.entregasService.findAll(query);
  }

  // GET /monitoreo/entregas/estadisticas - Obtener estadísticas
  @Get('estadisticas')
  getEstadisticas() {
    return this.entregasService.getEstadisticas();
  }

  // GET /monitoreo/entregas/estados - Obtener estados de entrega
  @Get('estados')
  getEstadosEntrega() {
    return this.entregasService.getEstadosEntrega();
  }

  // GET /monitoreo/entregas/contenedores-disponibles - Obtener contenedores sin entrega
  @Get('contenedores-disponibles')
  getContenedoresDisponibles() {
    return this.entregasService.getContenedoresDisponibles();
  }

  // GET /monitoreo/entregas/importadores - Obtener importadores
  @Get('importadores')
  getImportadores() {
    return this.entregasService.getImportadores();
  }

  // GET /monitoreo/entregas/:id - Obtener una entrega por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entregasService.findOne(id);
  }

  // POST /monitoreo/entregas - Crear nueva entrega
  @Post()
  create(@Body() data: CreateEntregaDto) {
    return this.entregasService.create(data);
  }

  // PUT /monitoreo/entregas/:id - Actualizar entrega
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateEntregaDto) {
    return this.entregasService.update(id, data);
  }

   // PATCH /monitoreo/entregas/:id/finalizar - Marcar entrega como Entregada
  @Patch(':id/finalizar')
  finalize(@Param('id') id: string) {
    return this.entregasService.finalize(id);
  }

  // DELETE /monitoreo/entregas/:id - Eliminar entrega
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entregasService.remove(id);
  }
}
