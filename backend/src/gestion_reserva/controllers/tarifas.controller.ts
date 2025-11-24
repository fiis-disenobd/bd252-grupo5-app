import { Controller, Get } from '@nestjs/common';
import { TarifasService } from '../services/tarifas.service';

@Controller('gestion-reserva')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService) {}

  @Get('tarifas')
  async getTarifas() {
    return this.tarifasService.findAllTarifas();
  }

  @Get('rutas-maritimas')
  async getRutasMaritimas() {
    return this.tarifasService.findAllRutasMaritimas();
  }
}
