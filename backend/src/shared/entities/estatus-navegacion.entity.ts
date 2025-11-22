import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'estatusnavegacion' })
export class EstatusNavegacion {
  @PrimaryGeneratedColumn('uuid')
  id_estatus_navegacion: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
