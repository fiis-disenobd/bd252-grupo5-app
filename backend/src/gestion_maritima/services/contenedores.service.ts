import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { EstadoContenedor } from '../../shared/entities/estado-contenedor.entity';
import { TipoContenedor } from '../../shared/entities/tipo-contenedor.entity';
import { ReservaContenedor } from '../../gestion_reserva/entities/reserva-contenedor.entity';
import { Reserva } from '../../gestion_reserva/entities/reserva.entity';
import { Cliente } from '../../gestion_reserva/entities/cliente.entity';
import { ContenedorMercancia } from '../../shared/entities/contenedor-mercancia.entity';

@Injectable()
export class ContenedoresMaritimosService {
  constructor(
    @InjectRepository(Contenedor)
    private readonly contenedorRepository: Repository<Contenedor>,
    @InjectRepository(EstadoContenedor)
    private readonly estadoContenedorRepository: Repository<EstadoContenedor>,
    @InjectRepository(TipoContenedor)
    private readonly tipoContenedorRepository: Repository<TipoContenedor>,
    @InjectRepository(ReservaContenedor)
    private readonly reservaContenedorRepository: Repository<ReservaContenedor>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(ContenedorMercancia)
    private readonly contenedorMercanciaRepository: Repository<ContenedorMercancia>,
  ) { }

  async findContenedores(
    page: number = 1,
    limit: number = 10,
    estado?: string,
    mercancia?: string,
  ) {
    try {
      const offset = (page - 1) * limit;

      let query = `
        SELECT   
            c.id_contenedor,
            c.codigo,
            tc.nombre AS tipo_nombre,    
            c.capacidad,
            c.dimensiones,
            ec.nombre AS estado,      
            cm.tipo_mercancia
        FROM shared.Contenedor c
        JOIN shared.EstadoContenedor ec ON c.id_estado_contenedor = ec.id_estado_contenedor
        JOIN shared.TipoContenedor tc ON c.id_tipo_contenedor = tc.id_tipo_contenedor
        LEFT JOIN shared.ContenedorMercancia cm ON c.id_contenedor = cm.id_contenedor
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (estado) {
        query += ` AND ec.nombre = $${paramIndex++}`;
        params.push(estado);
      }
      if (mercancia) {
        query += ` AND cm.tipo_mercancia ILIKE $${paramIndex++}`;
        params.push(`%${mercancia}%`);
      }

      const countQuery = `SELECT COUNT(DISTINCT subquery.id_contenedor) as total FROM (${query}) as subquery`;

      query += ` ORDER BY c.codigo LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
      params.push(limit, offset);

      const [data, countResult] = await Promise.all([
        this.contenedorRepository.query(query, params),
        this.contenedorRepository.query(countQuery, params.slice(0, -2))
      ]);

      const total = parseInt(countResult[0].total, 10);

      return {
        data: data.map((row: any) => ({
          id_contenedor: row.id_contenedor,
          codigo: row.codigo,
          tipo_contenedor: {
            nombre: row.tipo_nombre
          },
          capacidad: row.capacidad,
          dimensiones: row.dimensiones,
          estado_contenedor: {
            nombre: row.estado
          },
          mercancia: row.tipo_mercancia,
          cliente: null // Not included in the SQL query
        })),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error al obtener contenedores marítimos:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }
}
