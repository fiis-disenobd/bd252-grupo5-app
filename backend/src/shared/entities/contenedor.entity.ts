import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoContenedor } from './estado-contenedor.entity';
import { TipoContenedor } from './tipo-contenedor.entity';

@Entity({ schema: 'shared', name: 'contenedor' })
export class Contenedor {
  @PrimaryGeneratedColumn('uuid')
  id_contenedor: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  peso: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  capacidad: number;

  @Column({ type: 'varchar', length: 50 })
  dimensiones: string;

  @Column({ type: 'uuid' })
  id_estado_contenedor: string;

  @Column({ type: 'uuid' })
  id_tipo_contenedor: string;

  @ManyToOne(() => EstadoContenedor)
  @JoinColumn({ name: 'id_estado_contenedor' })
  estado_contenedor: EstadoContenedor;

  @ManyToOne(() => TipoContenedor)
  @JoinColumn({ name: 'id_tipo_contenedor' })
  tipo_contenedor: TipoContenedor;
}
