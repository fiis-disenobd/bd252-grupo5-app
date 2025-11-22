import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Operacion } from './operacion.entity';
import { EstatusNavegacion } from './estatus-navegacion.entity';
import { Buque } from './buque.entity';

@Entity({ schema: 'shared', name: 'operacionmaritima' })
export class OperacionMaritima {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_maritima: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'int' })
  cantidad_contenedores: number;

  @Column({ type: 'uuid' })
  id_estatus_navegacion: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  porcentaje_trayecto: number;

  @Column({ type: 'uuid' })
  id_buque: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => EstatusNavegacion)
  @JoinColumn({ name: 'id_estatus_navegacion' })
  estatus_navegacion: EstatusNavegacion;

  @ManyToOne(() => Buque)
  @JoinColumn({ name: 'id_buque' })
  buque: Buque;
}
