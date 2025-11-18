import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Contenedor } from '../../shared/entities/contenedor.entity';
import { Importador } from './importador.entity';

@Entity({ schema: 'monitoreo', name: 'entrega' })
export class Entrega {
  @PrimaryGeneratedColumn('uuid')
  id_entrega: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  codigo: string;

  @Column({ type: 'uuid' })
  id_estado_entrega: string;

  @Column({ type: 'date' })
  fecha_entrega: Date;

  @Column({ type: 'varchar', length: 100 })
  lugar_entrega: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'uuid' })
  id_importador: string;

  @ManyToOne(() => Contenedor)
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;

  @ManyToOne(() => Importador)
  @JoinColumn({ name: 'id_importador' })
  importador: Importador;
}
