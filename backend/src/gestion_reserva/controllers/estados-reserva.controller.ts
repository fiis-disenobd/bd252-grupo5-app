import { Controller, Get } from '@nestjs/common';
import { EstadosReservaService } from '../services/estados-reserva.service';

@Controller('gestion-reserva')
export class EstadosReservaController {
  constructor(private readonly estadosReservaService: EstadosReservaService) {}

  @Get('estados-reserva')
  async getEstadosReserva() {
    return this.estadosReservaService.findAll();
  }
}
