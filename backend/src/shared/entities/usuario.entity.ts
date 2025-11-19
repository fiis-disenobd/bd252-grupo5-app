import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RolUsuario } from './rol-usuario.entity';
import { Empleado } from './empleado.entity';

@Entity({ schema: 'shared', name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id_usuario: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  correo_electronico: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena: string;

  @Column({ type: 'uuid' })
  id_rol_usuario: string;

  @Column({ type: 'uuid' })
  id_empleado: string;

  @ManyToOne(() => RolUsuario)
  @JoinColumn({ name: 'id_rol_usuario' })
  rol_usuario: RolUsuario;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;
}
