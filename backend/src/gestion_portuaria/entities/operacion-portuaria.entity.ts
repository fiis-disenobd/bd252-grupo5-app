import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { Puerto } from '../../gestion_maritima/entities/puerto.entity';
import { Muelle } from '../../gestion_maritima/entities/muelle.entity';
import { Buque } from '../../shared/entities/buque.entity';
import { TipoOperacionPortuaria } from './tipo-operacion-portuaria.entity';

@Entity({ schema: 'gestion_portuaria', name: 'operacion_portuaria' })
export class OperacionPortuaria {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_portuaria: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'uuid' })
  id_puerto: string;

  @Column({ type: 'uuid' })
  id_muelle: string;

  @Column({ type: 'uuid' })
  id_tipo_operacion_portuaria: string;

  @Column({ type: 'uuid' })
  id_buque: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Puerto)
  @JoinColumn({ name: 'id_puerto' })
  puerto: Puerto;

  @ManyToOne(() => Muelle)
  @JoinColumn({ name: 'id_muelle' })
  muelle: Muelle;

  @ManyToOne(() => TipoOperacionPortuaria)
  @JoinColumn({ name: 'id_tipo_operacion_portuaria' })
  tipo_operacion_portuaria: TipoOperacionPortuaria;

  @ManyToOne(() => Buque)
  @JoinColumn({ name: 'id_buque' })
  buque: Buque;
}
