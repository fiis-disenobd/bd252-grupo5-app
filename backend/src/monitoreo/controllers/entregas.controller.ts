import { Controller, Get, Post, Body } from '@nestjs/common';
import { EntregasService } from '../services/entregas.service';

@Controller('monitoreo/entregas')
export class EntregasController {
  constructor(private readonly entregasService: EntregasService) {}

  @Get()
  findAll() {
    return this.entregasService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.entregasService.create(data);
  }
}
