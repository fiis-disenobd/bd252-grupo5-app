import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ImportadoresService } from '../services/importadores.service';

@Controller('monitoreo/importadores')
export class ImportadoresController {
  constructor(private readonly importadoresService: ImportadoresService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importadoresService.findOneDetalle(id);
  }

  @Post(':id/direcciones')
  createDireccion(
    @Param('id') id: string,
    @Body() body: { direccion: string; tipo?: string | null; principal?: boolean },
  ) {
    return this.importadoresService.createDireccion(id, body);
  }
}
