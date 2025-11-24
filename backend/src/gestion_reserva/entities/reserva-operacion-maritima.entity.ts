import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Reserva } from './reserva.entity';
import { OperacionMaritima } from '../../shared/entities/operacion-maritima.entity';

@Entity({ schema: 'gestion_reserva', name: 'reservaoperacionmaritima' })
@Unique('uk_reserva_op_maritima', ['id_reserva', 'id_operacion_maritima'])
export class ReservaOperacionMaritima {
  @PrimaryGeneratedColumn('uuid')
  id_reserva_operacion_maritima: string;

  @Column({ type: 'uuid' })
  id_reserva: string;

  @Column({ type: 'uuid' })
  id_operacion_maritima: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_vinculacion: Date;

  @ManyToOne(() => Reserva, (reserva) => reserva.operaciones_maritimas)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => OperacionMaritima)
  @JoinColumn({ name: 'id_operacion_maritima' })
  operacion_maritima: OperacionMaritima;
}
