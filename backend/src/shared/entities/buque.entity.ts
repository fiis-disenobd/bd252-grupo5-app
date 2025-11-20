import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoEmbarcacion } from './estado-embarcacion.entity';

@Entity({ schema: 'shared', name: 'buque' })
export class Buque {
  @PrimaryGeneratedColumn('uuid')
  id_buque: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  matricula: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'uuid' })
  id_estado_embarcacion: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  peso: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion_actual: string;

  @ManyToOne(() => EstadoEmbarcacion)
  @JoinColumn({ name: 'id_estado_embarcacion' })
  estado_embarcacion: EstadoEmbarcacion;
}
