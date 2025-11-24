import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Contenedor } from './contenedor.entity';

@Entity({ schema: 'shared', name: 'ContenedorMercancia' })
@Unique('uk_contenedor_mercancia', ['id_contenedor', 'tipo_mercancia'])
export class ContenedorMercancia {
  @PrimaryGeneratedColumn('uuid')
  id_contenedor_mercancia: string;

  @Column({ type: 'uuid' })
  id_contenedor: string;

  @Column({ type: 'varchar', length: 100 })
  tipo_mercancia: string;

  @ManyToOne(() => Contenedor, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_contenedor' })
  contenedor: Contenedor;
}
