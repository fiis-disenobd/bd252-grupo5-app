import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from './empleado.entity';

@Entity('tripulante', { schema: 'shared' })
export class Tripulante {
  @PrimaryColumn({ type: 'uuid', name: 'id_tripulante', default: () => 'gen_random_uuid()' })
  id_tripulante: string;

  @Column({ type: 'uuid', name: 'id_empleado', nullable: false, unique: true })
  id_empleado: string;

  @Column({ name: 'disponibilidad', type: 'boolean', default: true, nullable: false })
  disponibilidad: boolean;

  @Column({ type: 'varchar', length: 50, nullable: false, name: 'nacionalidad' })
  nacionalidad: string;

  // Relación con Empleado
  @ManyToOne(() => Empleado, empleado => empleado.id_empleado, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'id_empleado', referencedColumnName: 'id_empleado' })
  empleado: Empleado;
}
