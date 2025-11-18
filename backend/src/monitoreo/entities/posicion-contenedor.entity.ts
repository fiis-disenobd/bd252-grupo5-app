import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';

@Entity({ schema: 'monitoreo', name: 'posicioncontenedor' })
export class PosicionContenedor {
  @PrimaryGeneratedColumn('uuid')
  id_posicion: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitud: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitud: number;

  @Column({ type: 'timestamp' })
  fecha_hora: Date;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}
