import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Reporte } from './reporte.entity';
import { TipoNotificacion } from './tipo-notificacion.entity';

@Entity({ schema: 'monitoreo', name: 'notificacion' })
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id_notificacion: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'uuid' })
  id_tipo_notificacion: string;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'uuid' })
  id_sensor: string;

  @Column({ type: 'uuid' })
  id_reporte: string;

  @ManyToOne(() => TipoNotificacion)
  @JoinColumn({ name: 'id_tipo_notificacion' })
  tipo_notificacion: TipoNotificacion;

  @ManyToOne(() => Sensor)
  @JoinColumn({ name: 'id_sensor' })
  sensor: Sensor;

  @ManyToOne(() => Reporte)
  @JoinColumn({ name: 'id_reporte' })
  reporte: Reporte;
}
