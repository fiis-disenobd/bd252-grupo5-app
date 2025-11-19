import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { Contenedor } from '../../shared/entities/contenedor.entity';

@Entity({ schema: 'gestion_maritima', name: 'operacioncontenedor' })
@Unique('uk_operacion_contenedor_fecha', [
  'id_operacion',
  'id_contenedor',
  'fecha_asignacion',
])
export class OperacionContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_operacion_contenedor: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha_asignacion: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}

