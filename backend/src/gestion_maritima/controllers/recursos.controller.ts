import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecursosService } from '../services/recursos.service';

@Controller('monitoreo')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) { }

  @Get('estados')
  async getEstados() {
    return this.recursosService.findEstados();
  }

  @Get('estados-operacion')
  async getEstadosOperacion() {
    return this.recursosService.findEstadosOperacion();
  }

  @Get('operadores')
  async getOperadores() {
    return this.recursosService.findOperadores();
  }

  @Get('vehiculos')
  async getVehiculos() {
    return this.recursosService.findVehiculos();
  }

  @Get('buques')
  async getBuques() {
    return this.recursosService.findBuques();
  }

  @Get('buques/:id')
  async getBuque(@Param('id') id: string) {
    return this.recursosService.findBuqueById(id);
  }

  @Get('puertos')
  async getPuertos() {
    return this.recursosService.findPuertos();
  }

  @Get('muelles')
  async getMuelles(@Query('puertoId') puertoId: string) {
    return this.recursosService.findMuellesByPuerto(puertoId);
  }

  @Get('rutas-maritimas')
  async getRutasMaritimas(
    @Query('origen') origen: string,
    @Query('destino') destino: string,
  ) {
    return this.recursosService.findRutasMaritimasBetweenPuertos(origen, destino);
  }

  @Get('rutas-maritimas/:id')
  async getRutaMaritima(@Param('id') id: string) {
    return this.recursosService.findRutaMaritimaById(id);
  }
}
