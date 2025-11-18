import { Controller, Get } from '@nestjs/common';
import { RecursosService } from '../services/recursos.service';

@Controller('monitoreo')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Get('estados')
  async getEstados() {
    return this.recursosService.findEstados();
  }

  @Get('operadores')
  async getOperadores() {
    return this.recursosService.findOperadores();
  }

  @Get('vehiculos')
  async getVehiculos() {
    return this.recursosService.findVehiculos();
  }

  @Get('buques')
  async getBuques() {
    return this.recursosService.findBuques();
  }
}
