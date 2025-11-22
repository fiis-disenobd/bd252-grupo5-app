import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoOperacion } from '../../shared/entities/estado-operacion.entity';
import { Operador } from '../entities/operador.entity';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';
import { Buque } from '../../shared/entities/buque.entity';
import { Ruta } from '../../shared/entities/ruta.entity';
import { Puerto } from '../../gestion_maritima/entities/puerto.entity';
import { Muelle } from '../../gestion_maritima/entities/muelle.entity';
import { RutaMaritima } from '../../gestion_maritima/entities/ruta-maritima.entity';
import { RutaPuertoIntermedio } from '../../gestion_maritima/entities/ruta-puerto-intermedio.entity';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(EstadoOperacion)
    private estadoOperacionRepository: Repository<EstadoOperacion>,
    @InjectRepository(Operador)
    private operadorRepository: Repository<Operador>,
    @InjectRepository(Vehiculo)
    private vehiculoRepository: Repository<Vehiculo>,
    @InjectRepository(Buque)
    private buqueRepository: Repository<Buque>,
    @InjectRepository(Puerto)
    private puertoRepository: Repository<Puerto>,
    @InjectRepository(Muelle)
    private muelleRepository: Repository<Muelle>,
    @InjectRepository(Ruta)
    private rutaRepository: Repository<Ruta>,
    @InjectRepository(RutaMaritima)
    private rutaMaritimaRepository: Repository<RutaMaritima>,
    @InjectRepository(RutaPuertoIntermedio)
    private rutaPuertoIntermedioRepository: Repository<RutaPuertoIntermedio>,
  ) {}

  async findEstados() {
    try {
      return await this.estadoOperacionRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener estados:', error);
      return [];
    }
  }

  async findOperadores() {
    try {
      return await this.operadorRepository.find({
        relations: ['empleado'],
        order: { turno: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener operadores:', error);
      return [];
    }
  }

  async findVehiculos() {
    try {
      // Solo vehículos con estado 'Disponible'
      return await this.vehiculoRepository
        .createQueryBuilder('v')
        .leftJoinAndSelect('v.estado_vehiculo', 'ev')
        .where('LOWER(ev.nombre) = :estado', { estado: 'disponible' })
        .orderBy('v.placa', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      return [];
    }
  }

  async findBuques() {
    try {
      // Solo buques con estado 'Disponible'
      return await this.buqueRepository
        .createQueryBuilder('b')
        .leftJoinAndSelect('b.estado_embarcacion', 'ee')
        .where('LOWER(ee.nombre) = :estado', { estado: 'disponible' })
        .orderBy('b.nombre', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error al obtener buques:', error);
      return [];
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

  async findPuertos() {
    try {
      return await this.puertoRepository.find({
        order: { nombre: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener puertos:', error);
      return [];
    }
  }

  async findMuellesByPuerto(id_puerto: string) {
    try {
      return await this.muelleRepository.find({
        where: { id_puerto },
        order: { codigo: 'ASC' },
      });
    } catch (error) {
      console.error('Error al obtener muelles por puerto:', error);
      return [];
    }
  }

  async findRutasMaritimasBetweenPuertos(id_puerto_origen: string, id_puerto_destino: string) {
    try {
      const rutas = await this.rutaMaritimaRepository.find({
        where: {
          id_puerto_origen,
          id_puerto_destino,
        },
        relations: ['ruta', 'puertos_intermedios', 'puertos_intermedios.puerto'],
        order: { codigo: 'ASC' },
      });

      return rutas.map((ruta) => ({
        id: ruta.id_ruta_maritima,
        codigo: ruta.codigo,
        distancia: ruta.distancia,
        duracion: ruta.ruta?.duracion ?? null,
        tarifa: ruta.ruta?.tarifa ?? null,
        puertosIntermedios:
          ruta.puertos_intermedios?.map((ri) => ri.puerto?.nombre).filter(Boolean) || [],
      }));
    } catch (error) {
      console.error('Error al obtener rutas marítimas entre puertos:', error);
      return [];
    }
  }

  async findRutaMaritimaById(id: string) {
    try {
      const ruta = await this.rutaMaritimaRepository.findOne({
        where: { id_ruta_maritima: id },
        relations: [
          'puerto_origen',
          'puerto_destino',
          'puertos_intermedios',
          'puertos_intermedios.puerto',
        ],
      });

      if (!ruta) {
        return null;
      }

      const puertos = [] as {
        tipo: 'origen' | 'intermedio' | 'destino';
        nombre: string;
        direccion: string;
      }[];

      if (ruta.puerto_origen) {
        puertos.push({
          tipo: 'origen',
          nombre: ruta.puerto_origen.nombre,
          direccion: ruta.puerto_origen.direccion,
        });
      }

      if (ruta.puertos_intermedios) {
        for (const intermedio of ruta.puertos_intermedios) {
          if (intermedio.puerto) {
            puertos.push({
              tipo: 'intermedio',
              nombre: intermedio.puerto.nombre,
              direccion: intermedio.puerto.direccion,
            });
          }
        }
      }

      if (ruta.puerto_destino) {
        puertos.push({
          tipo: 'destino',
          nombre: ruta.puerto_destino.nombre,
          direccion: ruta.puerto_destino.direccion,
        });
      }

      return {
        id: ruta.id_ruta_maritima,
        codigo: ruta.codigo,
        puertos,
      };
    } catch (error) {
      console.error('Error al obtener ruta marítima por id:', error);
      return null;
    }
  }
}
