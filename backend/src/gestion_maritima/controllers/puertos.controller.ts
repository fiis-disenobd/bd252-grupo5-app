import { Controller, Get } from '@nestjs/common';
import { PuertosService } from '../services/puertos.service';

@Controller('monitoreo')
export class PuertosController {
  constructor(private readonly puertosService: PuertosService) {}

  @Get('puertos')
  async getPuertos() {
    return this.puertosService.findPuertos();
  }
}
