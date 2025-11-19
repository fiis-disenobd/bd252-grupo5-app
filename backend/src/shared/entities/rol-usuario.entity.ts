import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ schema: 'shared', name: 'rolusuario' })
export class RolUsuario {
  @PrimaryGeneratedColumn('uuid')
  id_rol_usuario: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;
}
