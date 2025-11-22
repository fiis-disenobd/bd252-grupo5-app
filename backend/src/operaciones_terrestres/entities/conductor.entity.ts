import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empleado } from '../../shared/entities/empleado.entity';

@Entity({ schema: 'operaciones_terrestres', name: 'conductor' })
export class Conductor {
  @PrimaryGeneratedColumn('uuid')
  id_conductor: string;

  @Column({ type: 'uuid', unique: true })
  id_empleado: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  licencia: string;

  @Column({ type: 'varchar', length: 20 })
  categoria: string;

  @Column({ type: 'boolean', default: true })
  disponibilidad: boolean;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;
}
