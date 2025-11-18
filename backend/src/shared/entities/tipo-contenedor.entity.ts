import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'tipocontenedor' })
export class TipoContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_contenedor: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo: number;
}
