import { Controller, Get, Param } from '@nestjs/common';
import { AgentesService } from '../services/agentes.service';

@Controller('gestion-reserva/agentes')
export class AgentesController {
  constructor(private readonly agentesService: AgentesService) {}

  @Get()
  findAll() {
    return this.agentesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agentesService.findOne(id);
  }

  @Get('empleado/:idEmpleado')
  findByEmpleado(@Param('idEmpleado') idEmpleado: string) {
    return this.agentesService.findByEmpleado(idEmpleado);
  }
}
