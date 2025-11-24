import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';
import { Tripulante } from '../../shared/entities/tripulante.entity';

@Entity({ schema: 'personal_tripulacion', name: 'BuqueTripulante' })
export class BuqueTripulante {
  @PrimaryGeneratedColumn('uuid')
  id_buque_tripulante: string;

  @Column({ type: 'uuid', name: 'id_buque' })
  id_buque: string;

  @Column({ type: 'uuid', name: 'id_tripulante' })
  id_tripulante: string;

  @Column({ type: 'date', name: 'fecha_asignacion', default: () => 'CURRENT_DATE' })
  fecha_asignacion: Date;

  @Column({ type: 'time', name: 'hora_asignacion', default: () => 'CURRENT_TIME' })
  hora_asignacion: Date;

  // Relaciones
  @ManyToOne(() => Buque, buque => buque.id_buque, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_buque', referencedColumnName: 'id_buque' })
  buque: Buque;

  @ManyToOne(() => Tripulante, tripulante => tripulante.id_tripulante, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_tripulante', referencedColumnName: 'id_tripulante' })
  tripulante: Tripulante;
}
