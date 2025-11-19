import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TrabajadorPortuario } from './trabajador-portuario.entity';
import { EquipoPortuario } from './equipo-portuario.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'trabajadorportuarioequipoportuario',
})
@Unique('uk_trabajador_equipo_portuario', [
  'id_trabajador_portuario',
  'id_equipo_portuario',
])
export class TrabajadorPortuarioEquipoPortuario {
  @PrimaryGeneratedColumn('uuid')
  id_trabajador_portuario_equipo_portuario: string;

  @Column({ type: 'uuid' })
  id_trabajador_portuario: string;

  @Column({ type: 'uuid' })
  id_equipo_portuario: string;

  @ManyToOne(
    () => TrabajadorPortuario,
    (trabajador) => trabajador.equipos_asignados,
  )
  @JoinColumn({ name: 'id_trabajador_portuario' })
  trabajador_portuario: TrabajadorPortuario;

  @ManyToOne(() => EquipoPortuario, (equipo) => equipo.trabajadores_asignados)
  @JoinColumn({ name: 'id_equipo_portuario' })
  equipo_portuario: EquipoPortuario;
}

