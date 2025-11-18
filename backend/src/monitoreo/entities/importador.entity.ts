import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'monitoreo', name: 'importador' })
export class Importador {
  @PrimaryGeneratedColumn('uuid')
  id_importador: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'char', length: 11, unique: true })
  ruc: string;

  @Column({ type: 'varchar', length: 150 })
  razon_social: string;
}
