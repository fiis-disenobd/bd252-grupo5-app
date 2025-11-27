import { Controller, Get, Param, Query } from '@nestjs/common';
import { RutasMaritimasService } from '../services/rutas-maritimas.service';

@Controller('monitoreo')
export class RutasMaritimasController {
  constructor(private readonly rutasMaritimasService: RutasMaritimasService) { }

  @Get('rutas-maritimas')
  async getRutasMaritimas(
    @Query('origen') origen: string,
    @Query('destino') destino: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.rutasMaritimasService.findRutasMaritimasBetweenPuertos(origen, destino, page, limit);
  }

  @Get('rutas-maritimas/:id')
  async getRutaMaritima(@Param('id') id: string) {
    return this.rutasMaritimasService.findRutaMaritimaById(id);
  }
}
