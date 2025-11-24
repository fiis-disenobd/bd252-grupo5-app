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

  async findBuquesConOperaciones() {
    try {
      // Obtener todas las operaciones marítimas con sus buques
      const operaciones = await this.operacionMaritimaRepository.find({
        relations: ['buque', 'operacion', 'operacion.estado_operacion'],
        order: { porcentaje_trayecto: 'DESC' },
      });

      // Agrupar por buque y tomar la operación más reciente/activa de cada uno
      const buquesMap = new Map();

      for (const operacion of operaciones) {
        if (operacion.buque && !buquesMap.has(operacion.buque.id_buque)) {
          // Solo estados activos: En Curso, Programada
          const estadoNombre = operacion.operacion?.estado_operacion?.nombre;
          if (estadoNombre === 'En Curso' || estadoNombre === 'Programada') {
            buquesMap.set(operacion.buque.id_buque, {
              id_buque: operacion.buque.id_buque,
              nombre: operacion.buque.nombre,
              porcentaje_trayecto: Number(operacion.porcentaje_trayecto) || 0,
              estado_operacion: estadoNombre,
            });
          }
        }
      }

      return Array.from(buquesMap.values());
    } catch (error) {
      console.error('Error al obtener buques con operaciones:', error);
      return [];
    }
  }
}
