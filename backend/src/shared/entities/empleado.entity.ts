import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ schema: 'shared', name: 'empleado' })
export class Empleado {
  @PrimaryGeneratedColumn('uuid')
  id_empleado: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'char', length: 8, unique: true })
  dni: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  direccion: string;

  @Column({ type: 'uuid' })
  id_especialidad_empleado: string;

  @Column({ type: 'uuid', unique: true })
  id_contrato: string;
}
