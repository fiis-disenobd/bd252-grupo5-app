import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { OperacionesService } from '../services/operaciones.service';
import { CreateOperacionDto } from '../dto/create-operacion.dto';

@Controller('monitoreo/operaciones')
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Get()
  findAll(@Query('estado') estado?: string) {
    return this.operacionesService.findAll(estado);
  }

  @Get('kpis')
  getKPIs() {
    return this.operacionesService.getKPIs();
  }

  @Get('por-estado')
  getOperacionesPorEstado() {
    return this.operacionesService.getOperacionesPorEstado();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operacionesService.findOne(id);
  }

  @Post()
  create(@Body() createOperacionDto: CreateOperacionDto) {
    return this.operacionesService.create(createOperacionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.operacionesService.update(id, updateData);
  }

  @Patch(':id/finalizar')
  finalize(@Param('id') id: string) {
    return this.operacionesService.finalize(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operacionesService.remove(id);
  }
}
