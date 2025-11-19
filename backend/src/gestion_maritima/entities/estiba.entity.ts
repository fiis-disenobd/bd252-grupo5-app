import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OperacionPortuaria } from './operacion-portuaria.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';

@Entity({ schema: 'gestion_maritima', name: 'estiba' })
export class Estiba {
  @PrimaryGeneratedColumn('uuid')
  id_estiba: string;

  @Column({ type: 'uuid' })
  id_operacion_portuaria: string;

  @Column({ type: 'varchar', length: 50 })
  ubicacion: string;

  @Column({ type: 'varchar', length: 30 })
  zona_buque: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @ManyToOne(
    () => OperacionPortuaria,
    (operacionPortuaria) => operacionPortuaria.estibas,
  )
  @JoinColumn({ name: 'id_operacion_portuaria' })
  operacion_portuaria: OperacionPortuaria;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}

