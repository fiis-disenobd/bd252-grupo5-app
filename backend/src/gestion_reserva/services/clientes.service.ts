import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';
import { ClienteTelefono } from '../entities/cliente-telefono.entity';
import { CreateClienteDto } from '../dto/create-cliente.dto';
import { UpdateClienteDto } from '../dto/update-cliente.dto';
import { AddTelefonoClienteDto } from '../dto/add-telefono-cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(ClienteTelefono)
    private readonly telefonoRepository: Repository<ClienteTelefono>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const existingCliente = await this.clienteRepository.findOne({
      where: { ruc: createClienteDto.ruc },
    });

    if (existingCliente) {
      throw new ConflictException('Ya existe un cliente con ese RUC');
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async findAll(): Promise<Cliente[]> {
    return await this.clienteRepository.find({
      relations: ['telefonos', 'reservas'],
      order: { razon_social: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id_cliente: id },
      relations: ['telefonos', 'reservas', 'atenciones'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  async findByRuc(ruc: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { ruc },
      relations: ['telefonos', 'reservas'],
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con RUC ${ruc} no encontrado`);
    }

    return cliente;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findOne(id);

    if (updateClienteDto.ruc && updateClienteDto.ruc !== cliente.ruc) {
      const existingCliente = await this.clienteRepository.findOne({
        where: { ruc: updateClienteDto.ruc },
      });

      if (existingCliente) {
        throw new ConflictException('Ya existe un cliente con ese RUC');
      }
    }

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string): Promise<void> {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
  }

  async addTelefono(id: string, addTelefonoDto: AddTelefonoClienteDto): Promise<ClienteTelefono> {
    const cliente = await this.findOne(id);

    const telefono = this.telefonoRepository.create({
      ...addTelefonoDto,
      id_cliente: cliente.id_cliente,
    });

    return await this.telefonoRepository.save(telefono);
  }

  async removeTelefono(idCliente: string, idTelefono: string): Promise<void> {
    const telefono = await this.telefonoRepository.findOne({
      where: { id_cliente_telefono: idTelefono, id_cliente: idCliente },
    });

    if (!telefono) {
      throw new NotFoundException('Teléfono no encontrado');
    }

    await this.telefonoRepository.remove(telefono);
  }
}
