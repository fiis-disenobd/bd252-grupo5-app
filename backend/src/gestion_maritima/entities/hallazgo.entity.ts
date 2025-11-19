import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Inspeccion } from './inspeccion.entity';

@Entity({ schema: 'gestion_maritima', name: 'hallazgo' })
@Unique('uq_hallazgo_codigo', ['codigo'])
export class Hallazgo {
  @PrimaryGeneratedColumn('uuid')
  id_hallazgo: string;

  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  @Column({ type: 'uuid' })
  id_tipo_hallazgo: string;

  @Column({ type: 'int' })
  nivel_gravedad: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  accion_sugerida?: string;

  @Column({ type: 'uuid' })
  id_inspeccion: string;

  @ManyToOne(() => Inspeccion, (inspeccion) => inspeccion.hallazgos)
  @JoinColumn({ name: 'id_inspeccion' })
  inspeccion: Inspeccion;
}

