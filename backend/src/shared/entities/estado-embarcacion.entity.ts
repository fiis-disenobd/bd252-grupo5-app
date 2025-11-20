import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadoembarcacion' })
export class EstadoEmbarcacion {
  @PrimaryGeneratedColumn('uuid')
  id_estado_embarcacion: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
