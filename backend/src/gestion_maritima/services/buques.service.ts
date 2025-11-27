import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';

@Injectable()
export class BuquesService {
  constructor(
    @InjectRepository(Buque)
    private readonly buqueRepository: Repository<Buque>,
  ) { }

  async findBuques(
    page: number = 1,
    limit: number = 10,
    minWeight?: number,
    maxWeight?: number,
    stateId?: string,
  ) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT 
            b.id_buque,
            b.matricula,
            b.nombre,
            b.capacidad,
            b.peso,
            b.ubicacion_actual,
            b.id_estado_embarcacion,
            ee.nombre AS estado
        FROM shared.Buque b
        JOIN shared.EstadoEmbarcacion ee ON b.id_estado_embarcacion = ee.id_estado_embarcacion
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (minWeight) {
        query += ` AND b.peso >= $${paramIndex++}`;
        params.push(minWeight);
      }
      if (maxWeight) {
        query += ` AND b.peso <= $${paramIndex++}`;
        params.push(maxWeight);
      }
      if (stateId) {
        query += ` AND b.id_estado_embarcacion = $${paramIndex++}`;
        params.push(stateId);
      }

      // Query para contar total
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;

      // Query principal con paginación
      query += ` ORDER BY b.nombre LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(limit, offset);

      const [data, countResult] = await Promise.all([
        this.buqueRepository.query(query, params),
        this.buqueRepository.query(countQuery, params.slice(0, -2))
      ]);

      const total = parseInt(countResult[0].total, 10);

      return {
        data: data.map((row: any) => ({
          id_buque: row.id_buque,
          matricula: row.matricula,
          nombre: row.nombre,
          capacidad: row.capacidad,
          peso: row.peso,
          ubicacion_actual: row.ubicacion_actual,
          id_estado_embarcacion: row.id_estado_embarcacion,
          estado_embarcacion: {
            id_estado_embarcacion: row.id_estado_embarcacion,
            nombre: row.estado
          }
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error al obtener buques:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }

  async findBuqueById(id: string) {
    try {
      return await this.buqueRepository.findOne({ where: { id_buque: id } });
    } catch (error) {
      console.error('Error al obtener buque por id:', error);
      return null;
    }
  }
}
