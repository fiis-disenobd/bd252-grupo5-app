import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { IncidenciasService } from '../services/incidencias.service';
import { CreateIncidenciaDto } from '../dto/create-incidencia.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('gestion-maritima/incidencias')
export class IncidenciasController {
    constructor(private readonly incidenciasService: IncidenciasService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createIncidenciaDto: CreateIncidenciaDto, @Request() req) {
        return this.incidenciasService.create(createIncidenciaDto, req.user.id_usuario);
    }
}
