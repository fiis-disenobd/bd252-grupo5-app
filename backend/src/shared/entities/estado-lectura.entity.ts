import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadolectura' })
export class EstadoLectura {
  @PrimaryGeneratedColumn('uuid')
  id_estado_lectura: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
