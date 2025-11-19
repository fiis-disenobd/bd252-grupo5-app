import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadoincidencia' })
export class EstadoIncidencia {
  @PrimaryGeneratedColumn('uuid')
  id_estado_incidencia: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
