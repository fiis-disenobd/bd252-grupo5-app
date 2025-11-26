import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { EstadoLectura } from '../../shared/entities/estado-lectura.entity';

@Entity({ schema: 'monitoreo', name: 'lecturasensor' })
export class LecturaSensor {
  @PrimaryGeneratedColumn('uuid')
  id_lectura_sensor: string;

  @Column({ type: 'uuid' })
  id_sensor: string;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'varchar', length: 10 })
  unidad: string;

  @Column({ type: 'uuid' })
  id_estado_lectura: string;

  @ManyToOne(() => Sensor)
  @JoinColumn({ name: 'id_sensor' })
  sensor: Sensor;

  @ManyToOne(() => EstadoLectura)
  @JoinColumn({ name: 'id_estado_lectura' })
  estado_lectura: EstadoLectura;
}
