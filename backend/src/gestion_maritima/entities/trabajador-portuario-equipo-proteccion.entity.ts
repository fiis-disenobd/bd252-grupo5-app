import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { TrabajadorPortuario } from './trabajador-portuario.entity';

@Entity({
  schema: 'gestion_maritima',
  name: 'trabajadorportuarioequipoproteccion',
})
@Unique('uk_trabajador_equipo_proteccion', [
  'id_trabajador_portuario',
  'id_equipo_proteccion',
])
export class TrabajadorPortuarioEquipoProteccion {
  @PrimaryGeneratedColumn('uuid')
  id_trabajador_portuario_equipo_proteccion: string;

  @Column({ type: 'uuid' })
  id_trabajador_portuario: string;

  @Column({ type: 'uuid' })
  id_equipo_proteccion: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: string;

  @ManyToOne(
    () => TrabajadorPortuario,
    (trabajador) => trabajador.equipos_proteccion,
  )
  @JoinColumn({ name: 'id_trabajador_portuario' })
  trabajador_portuario: TrabajadorPortuario;
}

