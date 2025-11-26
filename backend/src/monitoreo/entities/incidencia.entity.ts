import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Operacion } from '../../shared/entities/operacion.entity';
import { TipoIncidencia } from './tipo-incidencia.entity';
import { EstadoIncidencia } from './estado-incidencia.entity';
import { Usuario } from '../../shared/entities/usuario.entity';

@Entity({ schema: 'shared', name: 'incidencia' })
export class Incidencia {
  @PrimaryGeneratedColumn('uuid')
  id_incidencia: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'uuid' })
  id_tipo_incidencia: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'int' })
  grado_severidad: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora: Date;

  @Column({ type: 'uuid' })
  id_estado_incidencia: string;

  @Column({ type: 'uuid' })
  id_operacion: string;

  @Column({ type: 'uuid' })
  id_usuario: string;

  @ManyToOne(() => Operacion)
  @JoinColumn({ name: 'id_operacion' })
  operacion: Operacion;

  @ManyToOne(() => TipoIncidencia)
  @JoinColumn({ name: 'id_tipo_incidencia' })
  tipo_incidencia: TipoIncidencia;

  @ManyToOne(() => EstadoIncidencia)
  @JoinColumn({ name: 'id_estado_incidencia' })
  estado_incidencia: EstadoIncidencia;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
