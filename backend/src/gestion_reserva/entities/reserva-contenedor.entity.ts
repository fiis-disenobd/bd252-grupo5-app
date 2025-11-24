import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Reserva } from './reserva.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';

@Entity({ schema: 'gestion_reserva', name: 'reservacontenedor' })
@Unique('uk_reserva_contenedor', ['id_reserva', 'id_contenedor'])
export class ReservaContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_reserva_contenedor: string;

  @Column({ type: 'uuid' })
  id_reserva: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: Date;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @ManyToOne(() => Reserva, (reserva) => reserva.contenedores)
  @JoinColumn({ name: 'id_reserva' })
  reserva: Reserva;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}
