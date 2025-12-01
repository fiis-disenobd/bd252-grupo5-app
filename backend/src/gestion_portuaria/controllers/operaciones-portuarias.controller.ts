import { Controller, Get } from '@nestjs/common';
import { OperacionesPortuariasService } from '../services/operaciones-portuarias.service';

@Controller('operaciones-portuarias')
export class OperacionesPortuariasController {
  constructor(
    private readonly operacionesPortuariasService: OperacionesPortuariasService,
  ) {}

  @Get()
  async findAll() {
    return this.operacionesPortuariasService.findDashboardList();
  }

  @Get('resumen')
  async getResumen() {
    return this.operacionesPortuariasService.getResumenEstados();
  }
}
