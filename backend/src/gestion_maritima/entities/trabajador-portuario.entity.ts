import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Empleado } from '../../shared/entities/empleado.entity';
import { OperacionEquipoPortuario } from './operacion-equipo-portuario.entity';
import { TrabajadorPortuarioEquipoPortuario } from './trabajador-portuario-equipo-portuario.entity';
import { TrabajadorPortuarioEquipoProteccion } from './trabajador-portuario-equipo-proteccion.entity';

@Entity({ schema: 'gestion_maritima', name: 'trabajadorportuario' })
@Unique('uq_trabajador_portuario_empleado', ['id_empleado'])
export class TrabajadorPortuario {
  @PrimaryGeneratedColumn('uuid')
  id_trabajador_portuario: string;

  @Column({ type: 'uuid' })
  id_empleado: string;

  @Column({ type: 'boolean', default: true })
  disponibilidad: boolean;

  @Column({ type: 'uuid' })
  id_turno: string;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @OneToMany(
    () => TrabajadorPortuarioEquipoPortuario,
    (relacion) => relacion.trabajador_portuario,
  )
  equipos_asignados: TrabajadorPortuarioEquipoPortuario[];

  @OneToMany(
    () => OperacionEquipoPortuario,
    (operacion) => operacion.trabajador_portuario,
  )
  operaciones: OperacionEquipoPortuario[];

  @OneToMany(
    () => TrabajadorPortuarioEquipoProteccion,
    (equipoProteccion) => equipoProteccion.trabajador_portuario,
  )
  equipos_proteccion: TrabajadorPortuarioEquipoProteccion[];
}

