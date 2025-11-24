import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReservasService } from '../services/reservas.service';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Controller('gestion-reserva/reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll(@Query('ruc_cliente') rucCliente?: string) {
    if (rucCliente) {
      return this.reservasService.findByCliente(rucCliente);
    }
    return this.reservasService.findAll();
  }

  @Get('estadisticas')
  getEstadisticas() {
    return this.reservasService.getEstadisticas();
  }

  @Get('codigo/:codigo')
  findByCodigo(@Param('codigo') codigo: string) {
    return this.reservasService.findByCodigo(codigo);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reservasService.remove(id);
  }
}
