import { Controller, Get, Query } from '@nestjs/common';
import { OperacionesIncidenciasService } from '../services/operaciones-incidencias.service';

@Controller('gestion-maritima/operaciones-incidencias')
export class OperacionesIncidenciasController {
    constructor(
        private readonly operacionesIncidenciasService: OperacionesIncidenciasService,
    ) { }

    @Get()
    async getOperacionesConIncidencias(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('severidadMin') severidadMin?: string,
    ) {
        return this.operacionesIncidenciasService.getOperacionesConIncidencias(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            search,
            severidadMin ? parseInt(severidadMin) : undefined,
        );
    }
}
