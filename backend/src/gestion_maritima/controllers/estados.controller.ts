import { Controller, Get } from '@nestjs/common';
import { EstadosService } from '../services/estados.service';

@Controller('monitoreo')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) { }

  @Get('estados')
  async getEstados() {
    return this.estadosService.findEstados();
  }

  @Get('estados-embarcacion')
  async getEstadosEmbarcacion() {
    return this.estadosService.findEstadosEmbarcacion();
  }
}
