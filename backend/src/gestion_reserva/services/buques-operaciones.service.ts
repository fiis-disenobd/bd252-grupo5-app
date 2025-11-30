import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';

@Injectable()
export class BuquesOperacionesService {
  constructor(
    @InjectRepository(Buque)
    private readonly buqueRepository: Repository<Buque>,
    @InjectRepository(OperacionMaritima)
    private readonly operacionMaritimaRepository: Repository<OperacionMaritima>,
  ) {}

  async findBuquesConOperaciones(): Promise<any[]> {
    try {
      const query = `
        SELECT DISTINCT ON (b.id_buque)
          b.id_buque,
          b.nombre,
          b.matricula,
          b.capacidad,
          om.porcentaje_trayecto,
          eo.nombre AS estado_operacion
        FROM shared.buque b
        JOIN shared.operacionmaritima om ON b.id_buque = om.id_buque
        JOIN shared.operacion o ON om.id_operacion = o.id_operacion
        JOIN shared.estadooperacion eo ON o.id_estado_operacion = eo.id_estado_operacion
        WHERE eo.nombre IN ('En Curso', 'Programada')
        ORDER BY b.id_buque, om.porcentaje_trayecto DESC
      `;

      const result = await this.buqueRepository.query(query);

      return result.map((row: any) => ({
        id_buque: row.id_buque,
        nombre: row.nombre,
        matricula: row.matricula,
        capacidad: row.capacidad,
        porcentaje_trayecto: Number(row.porcentaje_trayecto) || 0,
        estado_operacion: row.estado_operacion,
      }));
    } catch (error) {
      console.error('Error al obtener buques con operaciones:', error);
      return [];
    }
  }
}
