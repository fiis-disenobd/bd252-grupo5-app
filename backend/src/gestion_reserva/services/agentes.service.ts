import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgenteReservas } from '../entities/agente-reservas.entity';

@Injectable()
export class AgentesService {
  constructor(
    @InjectRepository(AgenteReservas)
    private readonly agenteRepository: Repository<AgenteReservas>,
  ) {}

  async findAll(): Promise<any[]> {
    const query = `
      SELECT 
        ar.id_agente_reservas,
        ar.id_empleado,
        e.nombre AS empleado_nombre,
        e.apellido AS empleado_apellido,
        e.codigo AS empleado_codigo
      FROM gestion_reserva.agentereservas ar
      JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      ORDER BY e.apellido ASC, e.nombre ASC
    `;
    
    const result = await this.agenteRepository.query(query);

    return result.map((row: any) => ({
      id_agente_reservas: row.id_agente_reservas,
      id_empleado: row.id_empleado,
      empleado: {
        id_empleado: row.id_empleado,
        nombre: row.empleado_nombre,
        apellido: row.empleado_apellido,
        codigo: row.empleado_codigo,
      },
    }));
  }

  async findOne(id: string): Promise<any> {
    const query = `
      SELECT 
        ar.id_agente_reservas,
        ar.id_empleado,
        e.nombre AS empleado_nombre,
        e.apellido AS empleado_apellido,
        e.codigo AS empleado_codigo
      FROM gestion_reserva.agentereservas ar
      JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      WHERE ar.id_agente_reservas = $1
    `;
    
    const result = await this.agenteRepository.query(query, [id]);

    if (result.length === 0) {
      throw new NotFoundException(`Agente con ID ${id} no encontrado`);
    }

    const row = result[0];

    // Obtener reservas del agente
    const reservasQuery = `
      SELECT 
        r.id_reserva,
        r.codigo,
        r.fecha_registro,
        c.razon_social AS cliente,
        er.nombre AS estado
      FROM gestion_reserva.reserva r
      LEFT JOIN gestion_reserva.cliente c ON r.ruc_cliente = c.ruc
      LEFT JOIN shared.estadoreserva er ON r.id_estado_reserva = er.id_estado_reserva
      WHERE r.id_agente_reservas = $1
      ORDER BY r.fecha_registro DESC
    `;
    const reservas = await this.agenteRepository.query(reservasQuery, [id]);

    return {
      id_agente_reservas: row.id_agente_reservas,
      id_empleado: row.id_empleado,
      empleado: {
        id_empleado: row.id_empleado,
        nombre: row.empleado_nombre,
        apellido: row.empleado_apellido,
        codigo: row.empleado_codigo,
      },
      reservas: reservas,
    };
  }

  async findByEmpleado(idEmpleado: string): Promise<any> {
    const query = `
      SELECT 
        ar.id_agente_reservas,
        ar.id_empleado,
        e.nombre AS empleado_nombre,
        e.apellido AS empleado_apellido,
        e.codigo AS empleado_codigo
      FROM gestion_reserva.agentereservas ar
      JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      WHERE ar.id_empleado = $1
    `;
    
    const result = await this.agenteRepository.query(query, [idEmpleado]);

    if (result.length === 0) {
      throw new NotFoundException(`Agente con empleado ID ${idEmpleado} no encontrado`);
    }

    const row = result[0];

    return {
      id_agente_reservas: row.id_agente_reservas,
      id_empleado: row.id_empleado,
      empleado: {
        id_empleado: row.id_empleado,
        nombre: row.empleado_nombre,
        apellido: row.empleado_apellido,
        codigo: row.empleado_codigo,
      },
    };
  }
}
