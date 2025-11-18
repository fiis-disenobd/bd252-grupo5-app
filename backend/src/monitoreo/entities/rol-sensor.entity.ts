import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'rolsensor' })
export class RolSensor {
  @PrimaryGeneratedColumn('uuid')
  id_rol_sensor: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
