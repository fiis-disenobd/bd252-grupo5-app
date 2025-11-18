import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { EstadoOperacion } from './estado-operacion.entity';

@Entity({ schema: 'shared', name: 'operacion' })
export class Operacion {
  @PrimaryGeneratedColumn('uuid')
  id_operacion: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'timestamp' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_fin: Date;

  @Column({ type: 'uuid' })
  id_estado_operacion: string;

  @ManyToOne(() => EstadoOperacion)
  @JoinColumn({ name: 'id_estado_operacion' })
  estado_operacion: EstadoOperacion;
}
