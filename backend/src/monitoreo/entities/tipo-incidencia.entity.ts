import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'tipoincidencia' })
export class TipoIncidencia {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_incidencia: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
