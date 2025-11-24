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

  async findContenedores() {
    try {
      const contenedores = await this.contenedorRepository.find({
        relations: ['estado_contenedor', 'tipo_contenedor'],
        order: { codigo: 'ASC' },
      });

      if (!contenedores.length) {
        return [];
      }

      const idsContenedores = contenedores.map((c) => c.id_contenedor);
      console.log('Buscando mercancía para', idsContenedores.length, 'contenedores');
      console.log('Primer ID:', idsContenedores[0]);

      // Obtener mercancías asociadas a cada contenedor usando query raw
      let mercanciaPorContenedor = new Map<string, string[]>();
      try {
        const rawMercancias = await this.contenedorMercanciaRepository.query(
          `SELECT id_contenedor, tipo_mercancia 
           FROM shared.contenedormercancia 
           WHERE id_contenedor = ANY($1)`,
          [idsContenedores]
        );

        console.log('Mercancías encontradas (raw):', rawMercancias.length);
        if (rawMercancias.length > 0) {
          console.log('Primera mercancía (raw):', rawMercancias[0]);
        }

        for (const cm of rawMercancias) {
          const lista = mercanciaPorContenedor.get(cm.id_contenedor) || [];
          lista.push(cm.tipo_mercancia);
          mercanciaPorContenedor.set(cm.id_contenedor, lista);
        }
      } catch (mercanciaError) {
        console.error('Error obteniendo mercancías:', mercanciaError);
        // Continuar sin mercancías
      }

      // Obtener reservas asociadas a cada contenedor (para cliente) - opcional
      let clientePorContenedor = new Map<string, string>();
      try {
        const reservasContenedores = await this.reservaContenedorRepository.find({
          where: { id_contenedor: In(idsContenedores) },
          relations: ['reserva', 'reserva.cliente'],
        });

        for (const rc of reservasContenedores) {
          const nombreCliente = rc.reserva?.cliente?.razon_social;
          if (nombreCliente && !clientePorContenedor.has(rc.id_contenedor)) {
            clientePorContenedor.set(rc.id_contenedor, nombreCliente);
          }
        }
      } catch (clienteError) {
        console.error('Error obteniendo clientes:', clienteError);
        // Continuar sin clientes
      }

      return contenedores.map((c) => ({
        ...c,
        cliente: clientePorContenedor.get(c.id_contenedor) || null,
        mercancia: mercanciaPorContenedor.get(c.id_contenedor)?.join(', ') || null,
      }));
    } catch (error) {
      console.error('Error al obtener contenedores marítimos:', error);
      throw error;
    }
  }
}
