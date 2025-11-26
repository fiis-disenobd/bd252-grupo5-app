import { Controller, Get } from '@nestjs/common';
import { TipoIncidenciaService } from '../services/tipo-incidencia.service';

@Controller('gestion-maritima/tipos-incidencia')
export class TipoIncidenciaController {
    constructor(private readonly tipoIncidenciaService: TipoIncidenciaService) { }

    @Get()
    findAll() {
        return this.tipoIncidenciaService.findAll();
    }
}
