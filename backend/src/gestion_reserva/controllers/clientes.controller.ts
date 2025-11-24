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
} from '@nestjs/common';
import { ClientesService } from '../services/clientes.service';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { AddTelefonoClienteDto } from '../dto/add-telefono-cliente.dto';

@Controller('gestion-reserva/clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Get('ruc/:ruc')
  findByRuc(@Param('ruc') ruc: string) {
    return this.clientesService.findByRuc(ruc);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.clientesService.remove(id);
  }

  @Post(':id/telefonos')
  @HttpCode(HttpStatus.CREATED)
  addTelefono(
    @Param('id') id: string,
    @Body() addTelefonoDto: AddTelefonoClienteDto,
  ) {
    return this.clientesService.addTelefono(id, addTelefonoDto);
  }

  @Delete(':id/telefonos/:telefonoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTelefono(
    @Param('id') id: string,
    @Param('telefonoId') telefonoId: string,
  ) {
    return this.clientesService.removeTelefono(id, telefonoId);
  }
}
