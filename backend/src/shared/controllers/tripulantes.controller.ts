import { Controller, Get } from '@nestjs/common';
import { TripulantesService } from '../services/tripulantes.service';

@Controller('tripulantes')
export class TripulantesController {
  constructor(private readonly tripulantesService: TripulantesService) {}

  @Get()
  async getTripulantes() {
    return this.tripulantesService.findAll();
  }
}
