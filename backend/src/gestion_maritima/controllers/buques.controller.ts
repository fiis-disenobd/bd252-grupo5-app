import { Controller, Get, Param } from '@nestjs/common';
import { BuquesService } from '../services/buques.service';

@Controller('monitoreo')
export class BuquesController {
  constructor(private readonly buquesService: BuquesService) {}

  @Get('buques')
  async getBuques() {
    return this.buquesService.findBuques();
  }

  @Get('buques/:id')
  async getBuque(@Param('id') id: string) {
    return this.buquesService.findBuqueById(id);
  }
}
