import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { Empleado } from '../../shared/entities/empleado.entity';

@Entity({ schema: 'gestion_maritima', name: 'operacionempleado' })
@Unique('uk_operacion_empleado_fecha', [
  'id_operacion',
  'id_empleado',
  'fecha_asignacion',
])
export class OperacionEmpleado {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_empleado: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'uuid' })
  id_empleado: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: string;

  @Column({ type: 'date', nullable: true })
  fecha_desasignacion?: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;
}

