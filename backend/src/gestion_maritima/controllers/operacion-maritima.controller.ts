import { Body, Controller, Get, Post, Query } from '@nestjs/common';
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
    findAll(@Query('page') page: string = '1', @Query('limit') limit: string = '10') {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        return this.operacionMaritimaService.findAll(pageNum, limitNum);
    }
}
