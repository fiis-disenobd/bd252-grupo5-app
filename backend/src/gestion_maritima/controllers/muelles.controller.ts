import { Controller, Get, Query } from '@nestjs/common';
import { MuellesService } from '../services/muelles.service';

@Controller('monitoreo')
export class MuellesController {
  constructor(private readonly muellesService: MuellesService) {}

  @Get('muelles')
  async getMuelles(@Query('puertoId') puertoId: string) {
    return this.muellesService.findMuellesByPuerto(puertoId);
  }
}
