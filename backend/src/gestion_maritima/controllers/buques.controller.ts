import { Controller, Get, Param, Query } from '@nestjs/common';
import { BuquesService } from '../services/buques.service';

@Controller('monitoreo')
export class BuquesController {
  constructor(private readonly buquesService: BuquesService) { }

  @Get('buques')
  async getBuques(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('minWeight') minWeight?: number,
    @Query('maxWeight') maxWeight?: number,
    @Query('stateId') stateId?: string,
  ) {
    return this.buquesService.findBuques(page, limit, minWeight, maxWeight, stateId);
  }

  @Get('buques/:id')
  async getBuque(@Param('id') id: string) {
    return this.buquesService.findBuqueById(id);
  }
}
