import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RutaMaritima } from './ruta-maritima.entity';
import { Muelle } from './muelle.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'operacionrutamaritima',
})
@Unique('uk_operacion_ruta_maritima', ['id_operacion_maritima'])
export class OperacionRutaMaritima {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_ruta_maritima: string;

  @Column({ type: 'uuid' })
  id_operacion_maritima: string;

  @Column({ type: 'uuid' })
  id_ruta_maritima: string;

  @Column({ type: 'uuid' })
  id_muelle_origen: string;

  @Column({ type: 'uuid' })
  id_muelle_destino: string;

  @ManyToOne(() => RutaMaritima, (ruta) => ruta.operaciones)
  @JoinColumn({ name: 'id_ruta_maritima' })
  ruta_maritima: RutaMaritima;

  @ManyToOne(() => Muelle, (muelle) => muelle.operaciones_ruta_origen)
  @JoinColumn({ name: 'id_muelle_origen' })
  muelle_origen: Muelle;

  @ManyToOne(() => Muelle, (muelle) => muelle.operaciones_ruta_destino)
  @JoinColumn({ name: 'id_muelle_destino' })
  muelle_destino: Muelle;
}

