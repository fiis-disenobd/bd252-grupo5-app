import { Controller, Get } from '@nestjs/common';
import { VehiculosService } from '../services/vehiculos.service';

@Controller('monitoreo')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Get('vehiculos')
  async getVehiculos() {
    return this.vehiculosService.findVehiculos();
  }
}
