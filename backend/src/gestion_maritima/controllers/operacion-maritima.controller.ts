import { Body, Controller, Get, Post } from '@nestjs/common';
import { OperacionMaritimaService } from '../services/operacion-maritima.service';
import { CreateOperacionMaritimaDto } from '../dto/create-operacion-maritima.dto';

@Controller('gestion-maritima/operaciones-maritimas')
export class OperacionMaritimaController {
    constructor(private readonly operacionMaritimaService: OperacionMaritimaService) { }

    @Post()
    create(@Body() createDto: CreateOperacionMaritimaDto) {
        return this.operacionMaritimaService.create(createDto);
    }

    @Get()
    findAll() {
        return this.operacionMaritimaService.findAll();
    }
}
