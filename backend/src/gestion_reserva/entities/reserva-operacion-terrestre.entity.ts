import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Reserva } from './reserva.entity';

@Entity({ schema: 'gestion_reserva', name: 'reservaoperacionterrestre' })
@Unique('uk_reserva_op_terrestre', ['id_reserva', 'id_operacion_terrestre'])
export class ReservaOperacionTerrestre {
  @PrimaryGeneratedColumn('uuid')
  id_reserva_operacion_terrestre: string;

  @Column({ type: 'uuid' })
  id_reserva: string;

  @Column({ type: 'uuid' })
  id_operacion_terrestre: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_vinculacion: Date;

  @ManyToOne(() => Reserva, (reserva) => reserva.operaciones_terrestres)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  // Nota: La entidad OperacionTerrestre debe ser creada en shared/entities
  // cuando esté disponible, descomentar la siguiente relación:
  // @ManyToOne(() => OperacionTerrestre)
  // @JoinColumn({ name: 'id_operacion_terrestre' })
  // operacion_terrestre: OperacionTerrestre;
}
