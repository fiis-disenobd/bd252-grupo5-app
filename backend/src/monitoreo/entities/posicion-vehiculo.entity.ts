import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehiculo } from '../../shared/entities/vehiculo.entity';

@Entity({ schema: 'monitoreo', name: 'posicionvehiculo' })
export class PosicionVehiculo {
  @PrimaryGeneratedColumn('uuid')
  id_posicion: string;

  @Column({ type: 'uuid' })
  id_vehiculo: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitud: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitud: number;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo: Vehiculo;
}
