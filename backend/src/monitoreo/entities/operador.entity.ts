import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../shared/entities/empleado.entity';

@Entity({ schema: 'monitoreo', name: 'operador' })
export class Operador {
  @PrimaryGeneratedColumn('uuid')
  id_operador: string;

  @Column({ type: 'uuid', unique: true })
  id_empleado: string;

  @Column({ type: 'varchar', length: 20 })
  turno: string;

  @Column({ type: 'varchar', length: 100 })
  zona_monitoreo: string;

  @OneToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;
}
