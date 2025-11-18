import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'tiposensor' })
export class TipoSensor {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_sensor: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
