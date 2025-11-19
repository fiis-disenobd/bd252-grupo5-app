import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Buque } from '../../shared/entities/buque.entity';
import { Operacion } from '../../shared/entities/operacion.entity';
import { Puerto } from './puerto.entity';
import { Muelle } from './muelle.entity';
import { OperacionEquipoPortuario } from './operacion-equipo-portuario.entity';
import { Estiba } from './estiba.entity';

@Entity({ schema: 'gestion_maritima', name: 'operacionportuaria' })
@Unique('uq_operacion_portuaria_operacion', ['id_operacion'])
@Unique('uq_operacion_portuaria_codigo', ['codigo'])
export class OperacionPortuaria {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_portuaria: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'uuid' })
  id_puerto: string;

  @Column({ type: 'uuid' })
  id_muelle: string;

  @Column({ type: 'uuid' })
  id_tipo_operacion_portuaria: string;

  @Column({ type: 'uuid' })
  id_buque: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Puerto)
  @JoinColumn({ name: 'id_puerto' })
  puerto: Puerto;

  @ManyToOne(() => Muelle, (muelle) => muelle.operaciones_portuarias)
  @JoinColumn({ name: 'id_muelle' })
  muelle: Muelle;

  @ManyToOne(() => Buque)
  @JoinColumn({ name: 'id_buque' })
  buque: Buque;

  @OneToMany(
    () => OperacionEquipoPortuario,
    (operacionEquipo) => operacionEquipo.operacion_portuaria,
  )
  equipos_portuarios: OperacionEquipoPortuario[];

  @OneToMany(() => Estiba, (estiba) => estiba.operacion_portuaria)
  estibas: Estiba[];
}

