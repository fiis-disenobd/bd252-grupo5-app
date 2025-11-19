import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { OperacionEquipoPortuario } from './operacion-equipo-portuario.entity';
import { TrabajadorPortuarioEquipoPortuario } from './trabajador-portuario-equipo-portuario.entity';

@Entity({ schema: 'gestion_maritima', name: 'equipoportuario' })
@Unique('uq_equipo_portuario_codigo', ['codigo'])
export class EquipoPortuario {
  @PrimaryGeneratedColumn('uuid')
  id_equipo_portuario: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad: number;

  @Column({ type: 'uuid' })
  id_tipo_equipo_portuario: string;

  @Column({ type: 'uuid' })
  id_estado_equipo_portuario: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion?: string;

  @OneToMany(
    () => TrabajadorPortuarioEquipoPortuario,
    (relacion) => relacion.equipo_portuario,
  )
  trabajadores_asignados: TrabajadorPortuarioEquipoPortuario[];

  @OneToMany(
    () => OperacionEquipoPortuario,
    (operacionEquipoPortuario) => operacionEquipoPortuario.equipo_portuario,
  )
  operaciones: OperacionEquipoPortuario[];
}

