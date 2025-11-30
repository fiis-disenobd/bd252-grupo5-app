import { Controller, Get, Param } from '@nestjs/common';
import { ClientesService } from '../services/clientes.service';

@Controller('gestion-reserva/clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get('ruc/:ruc')
  findByRuc(@Param('ruc') ruc: string) {
    return this.clientesService.findByRuc(ruc);
  }
}
