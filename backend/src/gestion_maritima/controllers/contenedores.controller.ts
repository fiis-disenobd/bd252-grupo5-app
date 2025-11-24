import { Controller, Get } from '@nestjs/common';
import { ContenedoresMaritimosService } from '../services/contenedores.service';

@Controller('operaciones-maritimas')
export class ContenedoresMaritimosController {
  constructor(
    private readonly contenedoresService: ContenedoresMaritimosService,
  ) {}

  @Get('contenedores')
  async getContenedores() {
    return this.contenedoresService.findContenedores();
  }
}
