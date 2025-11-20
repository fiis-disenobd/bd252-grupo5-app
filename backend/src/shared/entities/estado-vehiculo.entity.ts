import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadovehiculo' })
export class EstadoVehiculo {
  @PrimaryGeneratedColumn('uuid')
  id_estado_vehiculo: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
