import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'estadooperacion' })
export class EstadoOperacion {
  @PrimaryGeneratedColumn('uuid')
  id_estado_operacion: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
