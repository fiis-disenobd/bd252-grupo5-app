import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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

    @Post('marcar-investigacion')
    async marcarParaInvestigacion(
        @Body() body: {
            codigoOperacion: string;
            tipoInspeccion: string;
            prioridad: string;
            fecha: string;
            hora: string;
            idUsuario?: string;
        }
    ) {
        return this.operacionesIncidenciasService.marcarParaInvestigacion(
            body.codigoOperacion,
            body.tipoInspeccion,
            body.prioridad,
            body.fecha,
            body.hora,
            body.idUsuario,
        );
    }
}
