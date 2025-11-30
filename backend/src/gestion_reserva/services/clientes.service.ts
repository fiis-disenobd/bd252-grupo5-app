import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from '../entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async findAll(): Promise<any[]> {
    const query = `
      SELECT 
        c.id_cliente,
        c.ruc,
        c.razon_social,
        c.direccion,
        c.email
      FROM gestion_reserva.cliente c
      ORDER BY c.razon_social ASC
    `;
    
    return await this.clienteRepository.query(query);
  }

  async findByRuc(ruc: string): Promise<any> {
    const query = `
      SELECT 
        c.id_cliente,
        c.ruc,
        c.razon_social,
        c.direccion,
        c.email
      FROM gestion_reserva.cliente c
      WHERE c.ruc = $1
    `;
    
    const result = await this.clienteRepository.query(query, [ruc]);

    if (result.length === 0) {
      throw new NotFoundException(`Cliente con RUC ${ruc} no encontrado`);
    }

    return result[0];
  }
}
