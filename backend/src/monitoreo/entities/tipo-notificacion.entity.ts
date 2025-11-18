import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'tiponotificacion' })
export class TipoNotificacion {
  @PrimaryGeneratedColumn('uuid')
  id_tipo_notificacion: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
