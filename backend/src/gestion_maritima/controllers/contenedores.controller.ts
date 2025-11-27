import { Controller, Get, Query } from '@nestjs/common';
import { ContenedoresMaritimosService } from '../services/contenedores.service';

@Controller('operaciones-maritimas')
export class ContenedoresMaritimosController {
  constructor(
    private readonly contenedoresService: ContenedoresMaritimosService,
  ) { }

  @Get('contenedores')
  async getContenedores(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('estado') estado?: string,
    @Query('mercancia') mercancia?: string,
  ) {
    return this.contenedoresService.findContenedores(page, limit, estado, mercancia);
  }
}
