import { Controller, Get } from '@nestjs/common';
import { ReportesService } from '../services/reportes.service';

@Controller('monitoreo/reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get()
  findAll() {
    return this.reportesService.findAll();
  }
}
