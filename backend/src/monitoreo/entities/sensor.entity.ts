import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { TipoSensor } from './tipo-sensor.entity';
import { RolSensor } from './rol-sensor.entity';

@Entity({ schema: 'monitoreo', name: 'sensor' })
export class Sensor {
  @PrimaryGeneratedColumn('uuid')
  id_sensor: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'uuid' })
  id_tipo_sensor: string;

  @Column({ type: 'uuid' })
  id_rol_sensor: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @ManyToOne(() => TipoSensor)
  @JoinColumn({ name: 'id_tipo_sensor' })
  tipo_sensor: TipoSensor;

  @ManyToOne(() => RolSensor)
  @JoinColumn({ name: 'id_rol_sensor' })
  rol_sensor: RolSensor;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}
