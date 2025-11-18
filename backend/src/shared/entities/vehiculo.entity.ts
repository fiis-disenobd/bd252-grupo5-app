import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Activo } from './activo.entity';

@Entity({ schema: 'shared', name: 'vehiculo' })
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id_vehiculo: string;

  @Column({ type: 'uuid', unique: true })
  id_activo: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  placa: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad_ton: number;

  @Column({ type: 'uuid' })
  id_tipo_vehiculo: string;

  @Column({ type: 'uuid' })
  id_estado_vehiculo: string;

  @OneToOne(() => Activo)
  @JoinColumn({ name: 'id_activo' })
  activo: Activo;
}
