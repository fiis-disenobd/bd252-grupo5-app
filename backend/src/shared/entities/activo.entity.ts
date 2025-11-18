import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'activo' })
export class Activo {
  @PrimaryGeneratedColumn('uuid')
  id_activo: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'uuid' })
  id_tipo_activo: string;

  @Column({ type: 'uuid' })
  id_estado_activo: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ubicacion: string;
}
