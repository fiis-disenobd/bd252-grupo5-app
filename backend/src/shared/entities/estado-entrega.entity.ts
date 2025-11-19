import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadoentrega' })
export class EstadoEntrega {
  @PrimaryGeneratedColumn('uuid')
  id_estado_entrega: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
