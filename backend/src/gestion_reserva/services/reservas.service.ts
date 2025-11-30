import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { ReservaContenedor } from '../entities/reserva-contenedor.entity';
import { Cliente } from '../entities/cliente.entity';
import { AgenteReservas } from '../entities/agente-reservas.entity';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(ReservaContenedor)
    private readonly reservaContenedorRepository: Repository<ReservaContenedor>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(AgenteReservas)
    private readonly agenteRepository: Repository<AgenteReservas>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<any> {
    try {
      console.log('Datos recibidos para crear reserva:', JSON.stringify(createReservaDto, null, 2));

      // 1. Verificar que no exista reserva con el mismo código
      const existingQuery = `
        SELECT id_reserva FROM gestion_reserva.reserva WHERE codigo = $1
      `;
      const existing = await this.reservaRepository.query(existingQuery, [createReservaDto.codigo]);
      
      if (existing.length > 0) {
        throw new ConflictException('Ya existe una reserva con ese código');
      }

      // 2. Verificar que el cliente existe
      const clienteQuery = `
        SELECT id_cliente, ruc, razon_social 
        FROM gestion_reserva.cliente 
        WHERE ruc = $1
      `;
      const clienteResult = await this.reservaRepository.query(clienteQuery, [createReservaDto.ruc_cliente]);
      
      if (clienteResult.length === 0) {
        throw new NotFoundException(`Cliente con RUC ${createReservaDto.ruc_cliente} no encontrado`);
      }

      // 3. Verificar que el agente existe
      const agenteQuery = `
        SELECT ar.id_agente_reservas, e.nombre, e.apellido
        FROM gestion_reserva.agentereservas ar
        JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
        WHERE ar.id_agente_reservas = $1
      `;
      const agenteResult = await this.reservaRepository.query(agenteQuery, [createReservaDto.id_agente_reservas]);
      
      if (agenteResult.length === 0) {
        throw new NotFoundException('Agente de reservas no encontrado');
      }

      // 4. Insertar la reserva
      const insertReservaQuery = `
        INSERT INTO gestion_reserva.reserva (
          codigo, 
          ruc_cliente, 
          id_ruta, 
          id_buque, 
          id_agente_reservas, 
          id_estado_reserva,
          pago_total,
          fecha_registro
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)
        RETURNING id_reserva, codigo, fecha_registro
      `;
      
      console.log('Insertando reserva con:', {
        codigo: createReservaDto.codigo,
        ruc_cliente: createReservaDto.ruc_cliente,
        id_ruta: createReservaDto.id_ruta,
        id_buque: createReservaDto.id_buque,
        id_agente_reservas: createReservaDto.id_agente_reservas,
        id_estado_reserva: createReservaDto.id_estado_reserva,
      });

      const reservaResult = await this.reservaRepository.query(insertReservaQuery, [
        createReservaDto.codigo,
        createReservaDto.ruc_cliente,
        createReservaDto.id_ruta,
        createReservaDto.id_buque,
        createReservaDto.id_agente_reservas,
        createReservaDto.id_estado_reserva,
        createReservaDto.pago_total || null,
      ]);

      const nuevaReserva = reservaResult[0];
      console.log('Reserva creada:', nuevaReserva);

      // 5. Asignar contenedores si se proporcionaron
      if (createReservaDto.contenedores && createReservaDto.contenedores.length > 0) {
        for (const cont of createReservaDto.contenedores) {
          const insertContenedorQuery = `
            INSERT INTO gestion_reserva.reservacontenedor (
              id_reserva, 
              id_contenedor, 
              cantidad, 
              fecha_asignacion
            ) VALUES ($1, $2, $3, CURRENT_DATE)
          `;
          await this.reservaRepository.query(insertContenedorQuery, [
            nuevaReserva.id_reserva,
            cont.id_contenedor,
            cont.cantidad || 1,
          ]);

        }
      }

      // 7. Retornar la reserva creada con todos sus datos
      return await this.findOne(nuevaReserva.id_reserva);
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }

  async findAll(): Promise<any[]> {
    const query = `
      SELECT 
        r.id_reserva,
        r.codigo,
        r.fecha_registro,
        r.pago_total,
        r.ruc_cliente,
        c.razon_social AS cliente_razon_social,
        c.direccion AS cliente_direccion,
        c.email AS cliente_email,
        ar.id_agente_reservas,
        e.nombre AS agente_nombre,
        e.apellido AS agente_apellido,
        b.id_buque,
        b.nombre AS buque_nombre,
        b.matricula AS buque_matricula,
        ru.id_ruta,
        ru.codigo AS ruta_codigo,
        er.id_estado_reserva,
        er.nombre AS estado_nombre
      FROM gestion_reserva.reserva r
      LEFT JOIN gestion_reserva.cliente c ON r.ruc_cliente = c.ruc
      LEFT JOIN gestion_reserva.agentereservas ar ON r.id_agente_reservas = ar.id_agente_reservas
      LEFT JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      LEFT JOIN shared.buque b ON r.id_buque = b.id_buque
      LEFT JOIN shared.ruta ru ON r.id_ruta = ru.id_ruta
      LEFT JOIN shared.estadoreserva er ON r.id_estado_reserva = er.id_estado_reserva
      ORDER BY r.fecha_registro DESC
    `;
    
    const result = await this.reservaRepository.query(query);
    
    return result.map((row: any) => ({
      id_reserva: row.id_reserva,
      codigo: row.codigo,
      fecha_registro: row.fecha_registro,
      pago_total: row.pago_total,
      ruc_cliente: row.ruc_cliente,
      cliente: {
        ruc: row.ruc_cliente,
        razon_social: row.cliente_razon_social,
        direccion: row.cliente_direccion,
        email: row.cliente_email,
      },
      agente_reservas: {
        id_agente_reservas: row.id_agente_reservas,
        empleado: {
          nombre: row.agente_nombre,
          apellido: row.agente_apellido,
        },
      },
      buque: {
        id_buque: row.id_buque,
        nombre: row.buque_nombre,
        matricula: row.buque_matricula,
      },
      ruta: {
        id_ruta: row.id_ruta,
        codigo: row.ruta_codigo,
      },
      estado_reserva: {
        id_estado_reserva: row.id_estado_reserva,
        nombre: row.estado_nombre,
      },
    }));
  }

  async findOne(id: string): Promise<any> {
    // Obtener datos de la reserva
    const reservaQuery = `
      SELECT 
        r.id_reserva,
        r.codigo,
        r.fecha_registro,
        r.pago_total,
        r.ruc_cliente,
        c.id_cliente,
        c.razon_social AS cliente_razon_social,
        c.direccion AS cliente_direccion,
        c.email AS cliente_email,
        ar.id_agente_reservas,
        e.id_empleado,
        e.nombre AS agente_nombre,
        e.apellido AS agente_apellido,
        e.codigo AS agente_codigo,
        b.id_buque,
        b.nombre AS buque_nombre,
        b.matricula AS buque_matricula,
        b.capacidad AS buque_capacidad,
        ru.id_ruta,
        ru.codigo AS ruta_codigo,
        er.id_estado_reserva,
        er.nombre AS estado_nombre
      FROM gestion_reserva.reserva r
      LEFT JOIN gestion_reserva.cliente c ON r.ruc_cliente = c.ruc
      LEFT JOIN gestion_reserva.agentereservas ar ON r.id_agente_reservas = ar.id_agente_reservas
      LEFT JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      LEFT JOIN shared.buque b ON r.id_buque = b.id_buque
      LEFT JOIN shared.ruta ru ON r.id_ruta = ru.id_ruta
      LEFT JOIN shared.estadoreserva er ON r.id_estado_reserva = er.id_estado_reserva
      WHERE r.id_reserva = $1
    `;
    
    const reservaResult = await this.reservaRepository.query(reservaQuery, [id]);
    
    if (reservaResult.length === 0) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }

    const row = reservaResult[0];

    // Obtener contenedores de la reserva
    const contenedoresQuery = `
      SELECT 
        rc.id_reserva_contenedor,
        rc.id_contenedor,
        rc.cantidad,
        rc.fecha_asignacion,
        co.codigo AS contenedor_codigo,
        tc.nombre AS tipo_contenedor
      FROM gestion_reserva.reservacontenedor rc
      LEFT JOIN shared.contenedor co ON rc.id_contenedor = co.id_contenedor
      LEFT JOIN shared.tipocontenedor tc ON co.id_tipo_contenedor = tc.id_tipo_contenedor
      WHERE rc.id_reserva = $1
    `;
    const contenedoresResult = await this.reservaRepository.query(contenedoresQuery, [id]);

    return {
      id_reserva: row.id_reserva,
      codigo: row.codigo,
      fecha_registro: row.fecha_registro,
      pago_total: row.pago_total,
      ruc_cliente: row.ruc_cliente,
      cliente: {
        id_cliente: row.id_cliente,
        ruc: row.ruc_cliente,
        razon_social: row.cliente_razon_social,
        direccion: row.cliente_direccion,
        email: row.cliente_email,
      },
      agente_reservas: {
        id_agente_reservas: row.id_agente_reservas,
        empleado: {
          id_empleado: row.id_empleado,
          nombre: row.agente_nombre,
          apellido: row.agente_apellido,
          codigo: row.agente_codigo,
        },
      },
      buque: {
        id_buque: row.id_buque,
        nombre: row.buque_nombre,
        matricula: row.buque_matricula,
        capacidad: row.buque_capacidad,
      },
      ruta: {
        id_ruta: row.id_ruta,
        codigo: row.ruta_codigo,
      },
      estado_reserva: {
        id_estado_reserva: row.id_estado_reserva,
        nombre: row.estado_nombre,
      },
      contenedores: contenedoresResult.map((c: any) => ({
        id_reserva_contenedor: c.id_reserva_contenedor,
        id_contenedor: c.id_contenedor,
        cantidad: c.cantidad,
        fecha_asignacion: c.fecha_asignacion,
        contenedor: {
          codigo: c.contenedor_codigo,
          tipo_contenedor: c.tipo_contenedor,
        },
      })),
    };
  }

  async findByCliente(rucCliente: string): Promise<any[]> {
    const query = `
      SELECT 
        r.id_reserva,
        r.codigo,
        r.fecha_registro,
        r.pago_total,
        r.ruc_cliente,
        ar.id_agente_reservas,
        e.nombre AS agente_nombre,
        e.apellido AS agente_apellido,
        b.id_buque,
        b.nombre AS buque_nombre,
        ru.id_ruta,
        ru.codigo AS ruta_codigo,
        er.nombre AS estado_nombre
      FROM gestion_reserva.reserva r
      LEFT JOIN gestion_reserva.agentereservas ar ON r.id_agente_reservas = ar.id_agente_reservas
      LEFT JOIN shared.empleado e ON ar.id_empleado = e.id_empleado
      LEFT JOIN shared.buque b ON r.id_buque = b.id_buque
      LEFT JOIN shared.ruta ru ON r.id_ruta = ru.id_ruta
      LEFT JOIN shared.estadoreserva er ON r.id_estado_reserva = er.id_estado_reserva
      WHERE r.ruc_cliente = $1
      ORDER BY r.fecha_registro DESC
    `;
    
    const result = await this.reservaRepository.query(query, [rucCliente]);
    
    return result.map((row: any) => ({
      id_reserva: row.id_reserva,
      codigo: row.codigo,
      fecha_registro: row.fecha_registro,
      pago_total: row.pago_total,
      ruc_cliente: row.ruc_cliente,
      agente_reservas: {
        id_agente_reservas: row.id_agente_reservas,
        empleado: {
          nombre: row.agente_nombre,
          apellido: row.agente_apellido,
        },
      },
      buque: {
        id_buque: row.id_buque,
        nombre: row.buque_nombre,
      },
      ruta: {
        id_ruta: row.id_ruta,
        codigo: row.ruta_codigo,
      },
      estado_reserva: {
        nombre: row.estado_nombre,
      },
    }));
  }

  async findByCodigo(codigo: string): Promise<any> {
    const query = `
      SELECT id_reserva FROM gestion_reserva.reserva WHERE codigo = $1
    `;
    const result = await this.reservaRepository.query(query, [codigo]);
    
    if (result.length === 0) {
      throw new NotFoundException(`Reserva con código ${codigo} no encontrada`);
    }

    return await this.findOne(result[0].id_reserva);
  }

  async update(id: string, updateReservaDto: UpdateReservaDto): Promise<any> {
    // Verificar que la reserva existe
    await this.findOne(id);

    // Verificar código único si se está actualizando
    if (updateReservaDto.codigo) {
      const checkQuery = `
        SELECT id_reserva FROM gestion_reserva.reserva 
        WHERE codigo = $1 AND id_reserva != $2
      `;
      const existing = await this.reservaRepository.query(checkQuery, [updateReservaDto.codigo, id]);
      
      if (existing.length > 0) {
        throw new ConflictException('Ya existe una reserva con ese código');
      }
    }

    // Construir query de actualización dinámicamente
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (updateReservaDto.codigo) {
      updates.push(`codigo = $${paramIndex++}`);
      params.push(updateReservaDto.codigo);
    }
    if (updateReservaDto.id_estado_reserva) {
      updates.push(`id_estado_reserva = $${paramIndex++}`);
      params.push(updateReservaDto.id_estado_reserva);
    }
    if (updateReservaDto.pago_total !== undefined) {
      updates.push(`pago_total = $${paramIndex++}`);
      params.push(updateReservaDto.pago_total);
    }
    if (updateReservaDto.id_buque) {
      updates.push(`id_buque = $${paramIndex++}`);
      params.push(updateReservaDto.id_buque);
    }
    if (updateReservaDto.id_ruta) {
      updates.push(`id_ruta = $${paramIndex++}`);
      params.push(updateReservaDto.id_ruta);
    }

    if (updates.length > 0) {
      params.push(id);
      const updateQuery = `
        UPDATE gestion_reserva.reserva 
        SET ${updates.join(', ')} 
        WHERE id_reserva = $${paramIndex}
      `;
      await this.reservaRepository.query(updateQuery, params);
    }

    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Verificar que existe
    await this.findOne(id);

    // Eliminar contenedores asociados primero
    const deleteContenedoresQuery = `
      DELETE FROM gestion_reserva.reservacontenedor WHERE id_reserva = $1
    `;
    await this.reservaRepository.query(deleteContenedoresQuery, [id]);

    // Eliminar la reserva
    const deleteReservaQuery = `
      DELETE FROM gestion_reserva.reserva WHERE id_reserva = $1
    `;
    await this.reservaRepository.query(deleteReservaQuery, [id]);
  }

  async getEstadisticas(): Promise<any> {
    // Total de reservas
    const totalQuery = `SELECT COUNT(*) as total FROM gestion_reserva.reserva`;
    const totalResult = await this.reservaRepository.query(totalQuery);

    // Por estado
    const porEstadoQuery = `
      SELECT 
        er.nombre as estado,
        COUNT(*) as cantidad
      FROM gestion_reserva.reserva r
      JOIN shared.estadoreserva er ON r.id_estado_reserva = er.id_estado_reserva
      GROUP BY er.nombre
    `;
    const porEstadoResult = await this.reservaRepository.query(porEstadoQuery);

    // Ingreso total
    const ingresoQuery = `
      SELECT COALESCE(SUM(pago_total), 0) as total 
      FROM gestion_reserva.reserva
    `;
    const ingresoResult = await this.reservaRepository.query(ingresoQuery);

    return {
      total: parseInt(totalResult[0].total, 10),
      porEstado: porEstadoResult,
      ingresoTotal: parseFloat(ingresoResult[0].total),
    };
  }
}
