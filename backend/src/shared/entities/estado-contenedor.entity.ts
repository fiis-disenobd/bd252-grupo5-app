import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadocontenedor' })
export class EstadoContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_estado_contenedor: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
