import { Controller, Get } from '@nestjs/common';
import { OperadoresService } from '../services/operadores.service';

@Controller('monitoreo')
export class OperadoresController {
  constructor(private readonly operadoresService: OperadoresService) {}

  @Get('operadores')
  async getOperadores() {
    return this.operadoresService.findOperadores();
  }
}
