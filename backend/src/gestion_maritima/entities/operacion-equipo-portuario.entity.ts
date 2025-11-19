import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { OperacionPortuaria } from './operacion-portuaria.entity';
import { EquipoPortuario } from './equipo-portuario.entity';
import { TrabajadorPortuario } from './trabajador-portuario.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'operacionequipoportuario',
})
@Unique('uk_operacion_equipo_fecha', [
  'id_operacion_portuaria',
  'id_equipo_portuario',
  'fecha_asignacion',
])
export class OperacionEquipoPortuario {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_equipo_portuario: string;

  @Column({ type: 'uuid' })
  id_operacion_portuaria: string;

  @Column({ type: 'uuid' })
  id_equipo_portuario: string;

  @Column({ type: 'uuid' })
  id_trabajador_portuario: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_asignacion: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_devolucion?: Date;

  @ManyToOne(
    () => OperacionPortuaria,
    (operacionPortuaria) => operacionPortuaria.equipos_portuarios,
  )
  @JoinColumn({ name: 'id_operacion_portuaria' })
  operacion_portuaria: OperacionPortuaria;

  @ManyToOne(() => EquipoPortuario, (equipo) => equipo.operaciones)
  @JoinColumn({ name: 'id_equipo_portuario' })
  equipo_portuario: EquipoPortuario;

  @ManyToOne(
    () => TrabajadorPortuario,
    (trabajador) => trabajador.operaciones,
  )
  @JoinColumn({ name: 'id_trabajador_portuario' })
  trabajador_portuario: TrabajadorPortuario;
}

