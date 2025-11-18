import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';

@Entity({ schema: 'monitoreo', name: 'posicionbuque' })
export class PosicionBuque {
  @PrimaryGeneratedColumn('uuid')
  id_posicion: string;

  @Column({ type: 'uuid' })
  id_buque: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitud: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitud: number;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @ManyToOne(() => Buque)
  @JoinColumn({ name: 'id_buque' })
  buque: Buque;
}
