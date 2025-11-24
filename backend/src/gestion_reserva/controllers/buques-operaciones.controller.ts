import { Controller, Get } from '@nestjs/common';
import { BuquesOperacionesService } from '../services/buques-operaciones.service';

@Controller('gestion-reserva')
export class BuquesOperacionesController {
  constructor(
    private readonly buquesOperacionesService: BuquesOperacionesService,
  ) {}

  @Get('buques-operaciones')
  async getBuquesConOperaciones() {
    return this.buquesOperacionesService.findBuquesConOperaciones();
  }
}
