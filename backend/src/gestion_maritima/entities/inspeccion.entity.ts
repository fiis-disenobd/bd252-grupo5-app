import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { Usuario } from '../../shared/entities/usuario.entity';
import { Hallazgo } from './hallazgo.entity';
import { TipoInspeccion } from '../../shared/entities/tipo-inspeccion.entity';
import { EstadoInspeccion } from '../../shared/entities/estado-inspeccion.entity';
import { Prioridad } from '../../shared/entities/prioridad.entity';

@Entity({ schema: 'gestion_maritima', name: 'inspeccion' })
@Unique('uq_inspeccion_codigo', ['codigo'])
export class Inspeccion {
  @PrimaryGeneratedColumn('uuid')
  id_inspeccion: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'uuid' })
  id_tipo_inspeccion: string;

  @Column({ type: 'uuid' })
  id_estado_inspeccion: string;

  @Column({ type: 'uuid' })
  id_prioridad: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'uuid' })
  id_usuario: string;

  @ManyToOne(() => TipoInspeccion)
  @JoinColumn({ name: 'id_tipo_inspeccion' })
  tipoInspeccion: TipoInspeccion;

  @ManyToOne(() => EstadoInspeccion)
  @JoinColumn({ name: 'id_estado_inspeccion' })
  estadoInspeccion: EstadoInspeccion;

  @ManyToOne(() => Prioridad)
  @JoinColumn({ name: 'id_prioridad' })
  prioridad: Prioridad;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => Hallazgo, (hallazgo) => hallazgo.inspeccion)
  hallazgos: Hallazgo[];
}

