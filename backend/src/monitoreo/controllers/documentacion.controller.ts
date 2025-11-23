import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DocumentacionService } from '../services/documentacion.service';

@Controller('monitoreo/documentacion')
export class DocumentacionController {
  constructor(private readonly documentacionService: DocumentacionService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const doc = await this.documentacionService.findOne(id);
    if (!doc) {
      throw new NotFoundException('Documentación no encontrada');
    }
    return doc;
  }
}
