import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Incidencia } from './incidencia.entity';
import { Reporte } from './reporte.entity';

@Entity({ schema: 'monitoreo', name: 'incidenciareporte' })
export class IncidenciaReporte {
  @PrimaryGeneratedColumn('uuid')
  id_incidencia_reporte: string;

  @Column({ type: 'uuid' })
  id_incidencia: string;

  @Column({ type: 'uuid' })
  id_reporte: string;

  @ManyToOne(() => Incidencia)
  @JoinColumn({ name: 'id_incidencia' })
  incidencia: Incidencia;

  @ManyToOne(() => Reporte)
  @JoinColumn({ name: 'id_reporte' })
  reporte: Reporte;
}
